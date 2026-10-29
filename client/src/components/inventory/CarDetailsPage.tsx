import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Heart } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import type { Car } from '../../features/inventory/types';
import '../../styles/CarDetailsPage.css';

gsap.registerPlugin(ScrollTrigger);

type CarDetailsPageProps = {
  cars: Car[];
  savedIds: number[];
  onToggleSaved: (id: number) => void;
  onAskAboutCar: (car: Car) => void;
};

const money = (amount: number) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0,
}).format(amount);

export default function CarDetailsPage({ cars, savedIds, onToggleSaved, onAskAboutCar }: CarDetailsPageProps) {
  const pageRef = useRef<HTMLElement>(null);
  const { carId } = useParams<{ carId: string }>();
  const car = carId && /^\d+$/.test(carId) ? cars.find(item => item.id === Number(carId)) : undefined;

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page || !car) return;
    const media = gsap.matchMedia(page);
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('[data-detail-reveal]', page).forEach(element => {
        gsap.fromTo(element, { opacity: 0, y: 22 }, {
          opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: {
            trigger: element, start: 'top 94%', end: 'bottom top',
            toggleActions: 'restart reset restart reset',
          },
        });
      });
      gsap.fromTo('.mg-car-detail__cover > img', { scale: 1.06, yPercent: -2 }, {
        scale: 1.06, yPercent: 2, ease: 'none',
        scrollTrigger: { trigger: '.mg-car-detail__cover', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      });
    });
    let disposed = false;
    let frame = 0;
    const refresh = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const image = page.querySelector<HTMLImageElement>('.mg-car-detail__cover > img');
    image?.addEventListener('load', refresh);
    void document.fonts.ready.then(refresh);
    refresh();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      image?.removeEventListener('load', refresh);
      media.revert();
    };
  }, [car]);

  if (!car) {
    return (
      <main className="mg-car-detail mg-car-detail--missing">
        <p className="mg-car-detail__micro">MUSTANG GARAGE / MACHINE FILE</p>
        <span className="mg-car-detail__missing-code" aria-hidden="true">404</span>
        <h1>A wrong turn.<br /><em>A different road.</em></h1>
        <p>This machine ID is not in the current inventory.</p>
        <Link className="mg-car-detail__back" to="/inventory"><ArrowLeft size={16} aria-hidden="true" /> Back to collection</Link>
      </main>
    );
  }

  const issue = String(car.id).padStart(3, '0');
  const saved = savedIds.includes(car.id);
  const nextCar = cars.length > 1 ? cars[(cars.findIndex(item => item.id === car.id) + 1) % cars.length] : undefined;
  const words = car.model.trim().split(/\s+/);
  const lastWord = words.pop();
  const specifications = [
    ['Power', car.power], ['Mileage', car.miles ? `${car.miles} mi` : 'Not provided'],
    ['Exterior', car.color], ['Vehicle type', car.type], ['Location', car.location],
  ];
  const notes = [
    ['Inventory designation', car.tag],
    ['Provenance / ownership history', 'Trace the story before making it yours. Ask the garage for an ownership timeline, title history, and any restoration records; this listing does not establish a verified chain of ownership.'],
    ['Supporting documentation', 'Build sheets, factory invoices, service receipts, and restoration photographs can help support a car’s story. Ask which records accompany this machine and review them before purchase.'],
    ['Production / rarity figures', 'The inventory designation is an editorial label, not a verified production count. Request model-year production references and vehicle-specific identification before relying on rarity or originality claims.'],
  ];

  return (
    <main ref={pageRef} className="mg-car-detail" aria-labelledby="mg-car-detail-title">
      <header className="mg-car-detail__masthead">
        <Link className="mg-car-detail__back" to="/inventory"><ArrowLeft size={15} aria-hidden="true" /> The collection</Link>
        <span>MUSTANG GARAGE <i>/</i> MACHINE FILE</span>
        <span>VOLUME 01 <i>—</i> No. {issue}</span>
      </header>

      <header className="mg-car-detail__title-block">
        <div data-detail-reveal>
          <p className="mg-car-detail__micro">{car.year} <i>/</i> {car.make} <i>/</i> {car.type}</p>
          <h1 id="mg-car-detail-title">{words.join(' ')}{' '}<em>{lastWord}</em></h1>
          <p className="mg-car-detail__trim">{car.trim || 'Not provided'}</p>
        </div>
        <div className="mg-car-detail__file-label" data-detail-reveal>
          <span>THE GARAGE EDITION</span><strong>{issue}</strong><span>{car.tag}</span>
        </div>
      </header>

      <figure className="mg-car-detail__cover">
        <img src={car.image} alt={`${car.year} ${car.make} ${car.model}`} fetchPriority="high" />
        <div className="mg-car-detail__cover-shade" aria-hidden="true" />
        <span className="mg-car-detail__tag">{car.tag}</span>
        <span className="mg-car-detail__cover-year" aria-hidden="true">{car.year}</span>
        <figcaption className="mg-car-detail__caption">
          <span>{car.year} / {car.make} / {car.model}</span><span>ON LOCATION / {car.location}</span>
        </figcaption>
      </figure>

      <div className="mg-car-detail__running-line"><span>A MACHINE WITH A POINT OF VIEW.</span><span>MG / {issue} <i>—</i> THE COLLECTOR’S FILE</span></div>

      <div className="mg-car-detail__editorial">
        <div className="mg-car-detail__main-stack">
          <section className="mg-car-detail__story" aria-labelledby="mg-detail-story">
            <p className="mg-car-detail__section-index" data-detail-reveal>01 / THE STORY</p>
            <h2 id="mg-detail-story" data-detail-reveal>Some machines<br /><em>stay with you.</em></h2>
            <p className="mg-car-detail__story-copy" data-detail-reveal>{car.description || 'Not provided'}</p>
            <span className="mg-car-detail__source">FROM THE INVENTORY / {car.year} {car.make}</span>
          </section>
          <section className="mg-car-detail__spec-section" aria-labelledby="mg-detail-specs">
            <div className="mg-car-detail__section-heading"><div><p className="mg-car-detail__section-index" data-detail-reveal>02 / MACHINE SPECIFICATIONS</p><h2 id="mg-detail-specs" data-detail-reveal>The hard data.</h2></div><span aria-hidden="true">/ 02</span></div>
            <dl className="mg-car-detail__specs">
              {specifications.map(([label, value], index) => <div key={label} data-detail-reveal><dt><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{label}</dt><dd>{value || 'Not provided'}</dd></div>)}
            </dl>
          </section>
        </div>
        <aside className="mg-car-detail__purchase" aria-label="Price and actions">
          <div className="mg-car-detail__purchase-head"><span>YOUR NEXT CHAPTER</span><span>MG / {issue}</span></div>
          <p className="mg-car-detail__micro">ASKING PRICE / USD</p>
          <strong>{money(car.price)}</strong>
          <p className="mg-car-detail__purchase-caption">An introduction starts<br /><em>with a conversation.</em></p>
          <button className="mg-car-detail__inquiry" type="button" onClick={() => onAskAboutCar(car)}>Ask about this car <ArrowUpRight size={20} aria-hidden="true" /></button>
          <button className="mg-car-detail__save" type="button" aria-pressed={saved} onClick={() => onToggleSaved(car.id)}>{saved ? <Check size={17} aria-hidden="true" /> : <Heart size={17} aria-hidden="true" />}{saved ? 'Machine saved' : 'Save machine'}</button>
          <p className="mg-car-detail__availability">Contact the garage to confirm availability and request records.</p>
          <div className="mg-car-detail__purchase-location"><span>BASED IN</span><strong>{car.location}</strong></div>
        </aside>
      </div>

      <section className="mg-car-detail__notes" aria-labelledby="mg-detail-notes">
        <header><p className="mg-car-detail__section-index" data-detail-reveal>03 / COLLECTOR NOTES</p><h2 id="mg-detail-notes" data-detail-reveal>Read between<br /><em>the lines.</em></h2><p>The story draws you in. The records deserve a closer look. Use these notes to guide your conversation with the garage.</p><span className="mg-car-detail__notes-stamp">CHARACTER. CONTEXT. CLARITY.</span></header>
        <dl>{notes.map(([label, value]) => <div key={label} data-detail-reveal><dt>{label}</dt><dd>{value || 'Not provided'}</dd></div>)}</dl>
      </section>

      <section className="mg-car-detail__garage" aria-labelledby="mg-detail-garage">
        <div className="mg-car-detail__section-heading"><div><p className="mg-car-detail__section-index" data-detail-reveal>04 / GARAGE DETAILS</p><h2 id="mg-detail-garage" data-detail-reveal>All in the file.</h2></div><span aria-hidden="true">/ 04</span></div>
        <dl className="mg-car-detail__technical">
          <div data-detail-reveal><dt>File ID</dt><dd>MG / {issue}</dd></div>
          <div data-detail-reveal><dt>Year / make</dt><dd>{car.year} / {car.make}</dd></div>
          <div data-detail-reveal><dt>Configuration</dt><dd>{car.trim || 'Not provided'}</dd></div>
          <div data-detail-reveal><dt>Location</dt><dd>{car.location || 'Not provided'}</dd></div>
        </dl>
        <div className="mg-car-detail__endnote"><p>Availability is not listed. Ask the garage for current availability, documentation, and further details.</p><Link className="mg-car-detail__back" to="/inventory"><ArrowLeft size={15} aria-hidden="true" /> Back to collection</Link></div>
      </section>

      {nextCar && <Link className="mg-car-detail__next" to={`/inventory/${nextCar.id}`}>
        <img src={nextCar.image} alt="" loading="lazy" />
        <div><span>THE NEXT MACHINE / KEEP EXPLORING</span><p>{nextCar.year} {nextCar.make}</p><h2>{nextCar.model}</h2></div>
        <span className="mg-car-detail__next-arrow"><ArrowRight size={28} aria-hidden="true" /></span>
      </Link>}
    </main>
  );
}
