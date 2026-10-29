import { ArrowUpRight, ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Car } from '../../features/inventory/types';
import '../../styles/FeaturedCarSpotlight.css';
import { usePublicData } from '../../lib/publicContext';

type FeaturedCarSpotlightProps = { car?: Car; loading?: boolean };
const formatPrice = (price: number) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0,
}).format(price);

export default function FeaturedCarSpotlight({ car, loading = false }: FeaturedCarSpotlightProps) {
  const page=usePublicData().pages.home;
  const copy=page?.sections.find(section=>section.id==='the-garage-spotlight');
  if (loading) {
    return <section className="mg-spotlight mg-spotlight--empty" role="status"><span>THE GARAGE / COVER MACHINE</span><p>Setting the scene.</p><span>The next feature is loading.</span></section>;
  }
  if (!car) return null;
  const file = String(car.id).padStart(3, '0');
  const destination = `/inventory/${car.id}`;

  return (
    <section className="mg-spotlight" aria-labelledby="mg-spotlight-title">
      <div className="mg-spotlight__masthead">
        <span><i aria-hidden="true" /> THE GARAGE SPOTLIGHT</span>
        <span>A STUDY IN CHARACTER</span>
        <span>FEATURE No. {file}</span>
      </div>
      <header className="mg-spotlight__heading">
        <div>
          <p className="mg-spotlight__eyebrow">THE MACHINE. THE MOMENT. THE FEELING.</p>
          <h2 id="mg-spotlight-title">{copy?.heading||<>ONE MACHINE.<br /><em>All the character.</em></>}</h2>
        </div>
        <div className="mg-spotlight__heading-note"><span>IN FOCUS / {car.year}</span><p>{copy?.body||<>Some cars deserve<br />a little more of<br /><em>your attention.</em></>}</p></div>
      </header>

      <div className="mg-spotlight__stage">
        <Link className="mg-spotlight__image" to={destination} aria-label={`View ${car.year} ${car.make} ${car.model}`}>
          <img src={copy?.image||car.image} alt={copy?.imageAlt||`${car.year} ${car.make} ${car.model}`} loading="lazy" />
          <span className="mg-spotlight__image-mark"><span>MUSTANG GARAGE</span><strong>MG / {file}</strong></span>
          <span className="mg-spotlight__image-year" aria-hidden="true">{car.year}</span>
          <span className="mg-spotlight__image-caption"><span>{car.tag} <i>/</i> {car.type}</span><span>OPEN THE MACHINE FILE <ArrowUpRight size={19} aria-hidden="true" /></span></span>
        </Link>

        <div className="mg-spotlight__dossier">
          <div className="mg-spotlight__identity">
            <p className="mg-spotlight__eyebrow">{car.year} <span>/</span> {car.make}</p>
            <h3><Link to={destination}>{car.model}</Link></h3>
            <p className="mg-spotlight__trim">{car.trim}</p>
            <p className="mg-spotlight__description">{car.description}</p>
          </div>
          <dl className="mg-spotlight__specs">
            <div><dt>01 / POWER</dt><dd>{car.power}</dd></div>
            <div><dt>02 / MILEAGE</dt><dd>{car.miles} <span>mi</span></dd></div>
            <div><dt>03 / EXTERIOR</dt><dd>{car.color}</dd></div>
          </dl>
          <div className="mg-spotlight__invitation">
            <span className="mg-spotlight__price-label">ASKING PRICE / USD</span>
            <strong>{formatPrice(car.price)}</strong>
            <p><MapPin size={13} aria-hidden="true" />{car.location}</p>
            <Link className="mg-spotlight__file-link" to={destination}><span>MEET THE MACHINE</span><ArrowUpRight size={22} aria-hidden="true" /></Link>
            <span className="mg-spotlight__invitation-note">THE DETAILS MAKE THE DIFFERENCE.</span>
          </div>
        </div>
      </div>
      <footer className="mg-spotlight__footer"><span>ONE OF THE STORIES INSIDE OUR GARAGE.</span><Link to="/inventory">DISCOVER THE FULL COLLECTION <ArrowRight size={16} aria-hidden="true" /></Link></footer>
    </section>
  );
}
