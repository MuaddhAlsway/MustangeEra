# Mustang Garage

React/Vite frontend and Express/MongoDB API for Mustang Garage. The API keeps inventory, published page content, journal articles, mailing-list subscribers, contact inquiries, email replies, and admin activity in MongoDB. Existing images are project URLs; admin uploads are persisted in MongoDB GridFS and also exposed as URLs. No separate image-hosting service is used.

## Requirements and installation

- Node.js 22 or newer
- MongoDB locally or an accessible MongoDB deployment

Install dependencies from each app directory:

```sh
cd backend && npm install
cd ../client && npm install
```

Copy `backend/.env.example` to `backend/.env` for server settings and to `client/.env.local` for client settings. These files are ignored by git. Replace all placeholders; never put `CLERK_SECRET_KEY` in a client environment file.

## Configuration and service setup

- **MongoDB:** set `MONGODB_URI` to the database connection string. The API will fail startup without a working connection. For Atlas, create a database user under **Database Access** (this is separate from your Atlas account), use its password in the URI, URL-encode special characters in the password, and grant it `readWrite` on the selected database. Add the server's outgoing IP under **Network Access**.
- **Clerk:** create a Clerk application and configure its sign-in and sign-up options. Put its secret key in `backend/.env` as `CLERK_SECRET_KEY`; put the publishable key in `client/.env.local` as `VITE_CLERK_PUBLISHABLE_KEY`. Add the exact administrator email addresses (comma-separated) to `ADMIN_EMAILS`. Admin access requires a verified Clerk email matching this server-side allowlist. Add local and production frontend origins as appropriate in Clerk's allowed origins/redirect configuration.
- **CORS:** set `CLIENT_URL` to the exact frontend origin(s), comma-separated when needed. Wildcard origins are rejected in production.
- **Resend (optional until replies are needed):** verify the sending domain in Resend, publish its required DNS records, then set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` to a sender on that verified domain. Replies are sent only when an authenticated admin explicitly presses Send. Development tests use a fake provider and do not send email.
- **Images:** no Cloudinary or other image-hosting credentials/dependencies are used. Existing project images are listed in the admin media library. Explicit admin uploads are stored persistently in the same MongoDB database using GridFS (8 MB maximum); uploaded images are served from the API. Deletion is blocked while a published car, article, or page references an image. MongoDB storage capacity applies.

## Run and seed

In separate terminals:

```sh
cd backend && npm run dev
cd client && npm run dev
```

## Deploy (Render API + Vercel frontend)

The repository includes a Render Blueprint (`render.yaml`) for the Express API and a Vercel SPA rewrite (`client/vercel.json`) for React Router routes.

1. **Deploy the frontend to Vercel.** Import the repository, set the Vercel project **Root Directory** to `client`, and use the detected Vite framework with `npm run build` and `dist` output. Add `VITE_CLERK_PUBLISHABLE_KEY` from the same Clerk instance as the backend key. Deploy once and note the production origin (for example, `https://your-project.vercel.app`).
2. **Deploy the backend to Render.** Create a Blueprint deployment from the repository root. In the prompted environment values, set `CLIENT_URL` to the exact Vercel origin (scheme and host, no trailing slash), `MONGODB_URI` to the existing MongoDB URI, `CLERK_SECRET_KEY` from that same Clerk instance, and `ADMIN_EMAILS` to verified administrator emails. The Blueprint sets the API health check to `/api/health`.
3. **Connect Vercel to Render.** After Render provides the API URL, set Vercel `VITE_API_URL` to `https://<render-service>.onrender.com/api` and redeploy. Set it for Production and any Preview environments you use.
4. **Allow the deployed origin in Clerk.** Add the Vercel production domain to the Clerk application's allowed origins/redirect URLs. If using a custom Vercel domain, use that exact origin for both Clerk and Render `CLIENT_URL`; add additional origins as a comma-separated list in Render when needed.
5. **Set email variables if using contact notifications.** `RESEND_API_KEY` and `CONTACT_NOTIFICATION_EMAIL` are prompted by the Blueprint; the default sender is `Mustang Garage <onboarding@resend.dev>`. Resend's onboarding sender can notify only the Resend account email. Sending direct admin replies to arbitrary visitor addresses requires a verified sender domain.

For MongoDB Atlas, allow connections from Render (Render free instances do not have a stable outbound IP; Atlas `0.0.0.0/0` is a broad-access tradeoff—use a strong database password and least-privilege database user). Keep all secret values in the hosting dashboards, never in Vercel variables prefixed with `VITE_`. Do not run the seed script during deployment: Render connects to the configured database as-is, preserving its existing content and draft publication states.

The API listens on port 4000 by default. `npm run seed` in `server` copies the checked-in frontend inventory and journal into an empty collection as drafts and inserts missing page drafts. It is safe to rerun and does not replace existing records. After reviewing source data, `npm run seed -- --publish` explicitly marks initial car/article seed data published; use only if that is intended.

Build and verification:

```sh
cd backend && npm test && npm run build
cd client && npm run build && npm run lint
```

## API overview

Public routes (MongoDB-backed): `GET /api/public/cars`, `GET /api/public/cars/:id`, `GET /api/public/articles`, `GET /api/public/articles/:slug`, `GET /api/public/pages/:key`, `POST /api/public/contact`, and `POST /api/public/newsletter`. Public queries expose only published/listed content; contact and newsletter submissions are validated and rate limited.

All `/api/admin/*` routes require a verified Clerk session and a verified email in `ADMIN_EMAILS`. Admin resources include paginated/searchable `GET /cars`, `/articles`, `/pages`, `/subscribers`, `/inquiries`, `/media`, and `/activity`; CRUD/publish operations for cars and articles; page updates; subscriber export/status/removal; inquiry status and editable reply drafts; explicit reply delivery at `POST /replies/:id/send`; and media upload/delete at `/api/admin/media`. Uploaded files are persisted in GridFS; public file URLs are served at `/media/uploads/:id`. Email delivery is unavailable until Resend is configured.

MongoDB models: `Car`, `Article`, `Page` (keeps separate draft and last-published content), `Subscriber` (status and consent), `Inquiry`, `EmailReply` (draft/provider result/status), `Activity`, and an ID `Counter` for cars. The legacy media-reference collection is read-only and is not an image-storage service.


## Contact-form email notifications

Public submissions from both the Contact page and its popup are saved to MongoDB and then sent as owner notifications through Resend. Set `CONTACT_NOTIFICATION_EMAIL` on the backend to the email registered to your Resend account. The current local recipient is the owner-provided Gmail address. Keep `RESEND_API_KEY` and `RESEND_FROM_EMAIL` server-side. No Gmail OAuth connection is needed for this notification flow.

With `Mustang Garage <onboarding@resend.dev>` as the sender, notifications can be delivered to the Resend account owner without a custom domain. `Reply-To` is the visitor's validated email address, so the owner can reply using Gmail's Reply button. The public request cannot override the notification recipient. No existing Resend domains are modified.

The admin inbox remains the source of record if email is unavailable or rejected. `Inquiry.notification` stores `Accepted`, `Failed`, `Unavailable`, or `Unconfirmed`, the provider ID when accepted, and the attempt timestamp. Provider acceptance is not proof of inbox delivery. A stable inquiry-specific Resend idempotency key is used. Notification trouble does not return a false failure for an inquiry already saved successfully.

Restart the backend after changing its environment. Sending direct replies from the admin panel to arbitrary visitor addresses through Resend still requires a verified sender domain; owner notifications do not lift that restriction.
