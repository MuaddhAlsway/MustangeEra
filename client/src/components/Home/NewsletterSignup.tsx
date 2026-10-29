import { useState, type FormEvent } from 'react';
import { ArrowRight, Check, Mail } from 'lucide-react';
import { api } from '../../lib/api';
import '../../styles/NewsletterSignup.css';

export default function NewsletterSignup() {
  const [busy,setBusy]=useState(false);
  const [consent,setConsent]=useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setMessage('Enter your email address to join the list.');
      return;
    }

    if(!consent){setMessage('Please confirm newsletter consent.');return;}
    setBusy(true);
    try{const result=await api<{message:string}>('/public/newsletter',{method:'POST',body:JSON.stringify({email,consent,consentVersion:'newsletter-v1'})});setSubscribed(true);setMessage(result.message);setEmail('');}catch(error){setMessage(error instanceof Error?error.message:'Signup failed. Please try again.');}finally{setBusy(false);}
  }

  return (
    <section className="mg-newsletter" aria-labelledby="mg-newsletter-title">
      <div className="mg-newsletter__mark" aria-hidden="true">
        MG
      </div>

      <div className="mg-newsletter__copy">
        <p className="mg-newsletter__eyebrow">
          <Mail size={14} /> THE GARAGE DISPATCH
        </p>
        <h2 id="mg-newsletter-title">
          RARE CARS.
          <br />
          <em>GOOD STORIES.</em>
        </h2>
        <p className="mg-newsletter__description">
          New arrivals, collector notes, and stories from the road. Sent
          occasionally, never noisily.
        </p>
      </div>

      <div className="mg-newsletter__form-wrap">
        {subscribed ? (
          <div className="mg-newsletter__success" role="status">
            <Check size={19} />
            <span>{message}</span>
          </div>
        ) : (
          <form className="mg-newsletter__form" onSubmit={handleSubmit}>
            <label htmlFor="mg-newsletter-email">YOUR EMAIL ADDRESS</label>
            <div className="mg-newsletter__input-row">
              <input
                id="mg-newsletter-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setMessage('');
                }}
                required
              />
              <button
                type="submit" disabled={busy}
                aria-label="Subscribe to the Garage Dispatch"
              >
                <span>JOIN THE LIST</span>
                <ArrowRight size={16} />
              </button>
            </div>
            <label style={{display:"flex",gap:10,marginTop:14,lineHeight:1.6}}><input type="checkbox" required checked={consent} onChange={event=>setConsent(event.target.checked)}/> I agree to receive Mustang Garage newsletter emails and understand I can unsubscribe.</label>
            <p className="mg-newsletter__message" aria-live="polite">
              {message ||
                'By subscribing, you agree to receive occasional Mustang Garage updates.'}
            </p>
          </form>
        )}
        <span className="mg-newsletter__frequency">
          NO SPAM. JUST THE GOOD STUFF.
        </span>
      </div>
    </section>
  );
}