import { ArrowUp, ArrowUpRight, ArrowRight } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import NewsletterSignup from '../Home/NewsletterSignup';
import '../../styles/Footer.css';

const navigation = [
  { number: '01', label: 'The collection', to: '/inventory' },
  { number: '02', label: 'The garage', to: '/about' },
  { number: '03', label: 'The journal', to: '/journal' },
  { number: '04', label: 'Your saved machines', to: '/saved' },
];

export default function Footer() {
  function backToTop() {
    window.scrollTo({
      top: 0, left: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }

  return (
    <footer className="mg-footer">
      <div className="mg-footer__overline">
        <span><i aria-hidden="true" /> END OF THE PAGE. START OF SOMETHING ELSE.</span>
        <span>MUSTANG GARAGE / EST. MMXVIII</span>
      </div>

      <NewsletterSignup />

      <div className="mg-footer__main">
        <div className="mg-footer__invitation">
          <p className="mg-footer__eyebrow">YOUR NEXT CHAPTER IS OUT THERE.</p>
          <h2>KEEP THE<br /><em>story moving.</em></h2>
          <p>Rare machines. Open roads. Stories worth carrying forward. There’s always another reason to turn the key.</p>
          <Link className="mg-footer__collection" to="/inventory"><span>FIND YOUR NEXT MACHINE</span><ArrowUpRight size={23} aria-hidden="true" /></Link>
        </div>

        <div className="mg-footer__directory">
          <nav aria-label="Footer navigation">
            <p className="mg-footer__eyebrow">THE GARAGE DIRECTORY</p>
            {navigation.map(({number, label, to}) => (
              <NavLink className="mg-footer__route" key={to} to={to}>
                <span>{number}</span><span>{label}</span><ArrowUpRight size={18} aria-hidden="true" />
              </NavLink>
            ))}
          </nav>
          <div className="mg-footer__contact">
            <span>A QUESTION? A CAR? A STORY?</span>
            <a href="mailto:hello@mustanggarage.com">Talk to the garage <ArrowRight size={18} aria-hidden="true" /></a>
            <span>hello@mustanggarage.com</span>
          </div>
        </div>
      </div>

      <div className="mg-footer__brand-strip">
        <Link className="mg-footer__brand" to="/" aria-label="Mustang Garage home">
          <span className="mg-footer__wordmark">MUSTANG<span aria-hidden="true">MG</span></span>
          <span className="mg-footer__garage"><i aria-hidden="true" />G A R A G E<i aria-hidden="true" /></span>
        </Link>
        <div className="mg-footer__brand-caption"><span>COLLECT BROADLY. CURATE STRICTLY.</span><span>A HOME FOR THE UNCOMMON.</span></div>
      </div>

      <div className="mg-footer__bottom">
        <span>© {new Date().getFullYear()} MUSTANG GARAGE.<br />BUILT FOR THE LONG ROAD.</span>
        <nav className="mg-footer__legal" aria-label="Legal pages"><Link to="/privacy">PRIVACY</Link><Link to="/terms">TERMS</Link></nav>
        <button className="mg-footer__top" type="button" onClick={backToTop} aria-label="Back to top"><span>BACK TO THE TOP</span><span className="mg-footer__top-arrow"><ArrowUp size={18} aria-hidden="true" /></span></button>
      </div>
    </footer>
  );
}

