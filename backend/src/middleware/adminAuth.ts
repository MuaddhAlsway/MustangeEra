import { clerkClient } from '@clerk/express';
import { verifyToken } from '@clerk/backend';
import type { RequestHandler } from 'express';

const adminEmails = () => (process.env.ADMIN_EMAILS ?? '').split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
const unavailable: RequestHandler = (_req, res) => { res.status(503).json({ error: 'Clerk authentication is not configured.' }); };

export function clerkUserAuthentication(): RequestHandler[] {
  if (!process.env.CLERK_SECRET_KEY) return [unavailable];
  const origins=(process.env.CLIENT_URL??'http://localhost:5173').split(',').map(value=>value.trim()).filter(Boolean);
  return [async(req,res,next)=>{
    try {
      const authorization=req.header('authorization')??'';
      const bearer=authorization.match(/^Bearer\s+(.+)$/i)?.[1];
      if(!bearer){res.status(401).json({error:'No Clerk session token was sent. Sign in again and retry account sync.'});return;}
      const token=await verifyToken(bearer,{secretKey:process.env.CLERK_SECRET_KEY,authorizedParties:origins});
      const userId=token.sub;
      if(!userId){res.status(401).json({error:'Clerk session token has no user identity. Sign in again.'});return;}
      const user=await clerkClient.users.getUser(userId);
      const verifiedEmails=user.emailAddresses.filter(item=>item.verification?.status==='verified').map(item=>item.emailAddress.toLowerCase());
      const primary=user.emailAddresses.find(item=>item.id===user.primaryEmailAddressId)?.emailAddress?.toLowerCase()??'';
      const email=verifiedEmails.includes(primary)?primary:(verifiedEmails[0]??primary);
      res.locals.actor=userId;
      res.locals.clerkProfile={id:userId,email,name:[user.firstName,user.lastName].filter(Boolean).join(' '),imageUrl:user.imageUrl,verified:Boolean(verifiedEmails.length),role:verifiedEmails.some(value=>adminEmails().includes(value))?'admin':'user'};
      next();
    }catch(error){
      const details=error as {name?:string;reason?:string};
      const reason=details.reason??'clerk-api-request-failed';
      console.error('Clerk session verification failed',{type:details.name??'Error',reason});
      const message=reason==='token-invalid-authorized-parties'
        ? 'This site origin is not allowed for account sync. Add the exact browser origin (including port) to backend CLIENT_URL, restart the backend, and sign in again.'
        : reason==='token-expired'
          ? 'Your Clerk session expired. Sign out and sign in again, then retry account sync.'
          : reason==='token-iat-in-the-future'
            ? 'The backend system clock is behind Clerk. Enable automatic date, time, and time-zone synchronization on the server, then sign in again.'
          : reason==='secret-key-invalid'
            ? 'The backend Clerk server key is invalid. Set CLERK_SECRET_KEY from the same Clerk instance as the frontend publishable key.'
            : reason==='token-invalid-signature'||reason==='token-invalid-issuer'
              ? 'The session and backend Clerk keys do not match. Set both keys from the same Clerk instance, restart the backend and client, then sign in again.'
              : 'The backend could not verify this Clerk session. Confirm both Clerk keys use the same instance and mode, CLIENT_URL matches the browser origin, and the session is current; then sign in again.';
      res.status(401).json({error:message});
    }
  }];
}

export function adminAuthentication(): RequestHandler[] {
  return [...clerkUserAuthentication(),(_req,res,next)=>{
    const profile=res.locals.clerkProfile as {verified?:boolean;email?:string}|undefined;
    if(!profile?.verified||!adminEmails().includes((profile.email??'').toLowerCase())){
      res.status(403).json({error:'This verified account is not authorized for the garage admin. Ask an administrator to add its email to ADMIN_EMAILS.'});
      return;
    }
    next();
  }];
}
