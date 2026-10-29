import { ArrowUpRight, Mail, MessageCircle } from 'lucide-react';
import '../../styles/VisitGarage.css';

export default function VisitGarage() {
  return (
    <section className="mg-visit" aria-labelledby="mg-visit-title">
      <div className="mg-visit__copy">
        <p className="mg-visit__eyebrow"><span /> VISIT OR GET IN TOUCH</p>
        <h2 id="mg-visit-title">
          THE NEXT GOOD
          <br />
          STORY STARTS <em>HERE.</em>
        </h2>
        <p className="mg-visit__intro">
          Have a question about a car, the collection, or the garage? Get in
          touch and start a conversation with our team.
        </p>

        <div className="mg-visit__actions">
          <a className="mg-visit__primary" href="mailto:hello@mustanggarage.com">
            <Mail size={16} /> EMAIL THE GARAGE <ArrowUpRight size={15} />
          </a>
          <a
            className="mg-visit__secondary"
            href="mailto:hello@mustanggarage.com?subject=Visit%20enquiry"
          >
            <MessageCircle size={16} /> ASK ABOUT A VISIT
          </a>
        </div>

        <p className="mg-visit__email-label">DIRECT LINE</p>
        <a className="mg-visit__email" href="mailto:hello@mustanggarage.com">
          hello@mustanggarage.com
        </a>
      </div>

      <div className="mg-visit__aside" aria-label="Contact details">
        <span className="mg-visit__aside-number">MG / 05</span>
        <span className="mg-visit__aside-mark" aria-hidden="true">M</span>
        <p>
          GOOD CARS
          <br />
          MAKE GOOD
          <br />
          <em>CONVERSATION.</em>
        </p>
        <span className="mg-visit__aside-caption">
          MUSTANG GARAGE · GET IN TOUCH
        </span>
      </div>
    </section>
  );
}