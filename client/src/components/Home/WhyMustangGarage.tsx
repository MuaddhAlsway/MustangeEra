import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import garageImage from '../../assets/Collection090.webp';
import '../../styles/WhyMustangGarage.css';
import { usePublicData } from '../../lib/publicContext';

const principles = [
  {
    number: '01',
    label: 'CHARACTER / THE REASON',
    title: 'Every car has a reason.',
    detail: 'Rarity, provenance, specification, or design. We explain what makes each machine worth a closer look.',
  },
  {
    number: '02',
    label: 'CLARITY / THE DETAILS',
    title: 'The details matter.',
    detail: 'Specifications and history are presented clearly, with claims identified and supporting records noted when available.',
  },
  {
    number: '03',
    label: 'CULTURE / THE STORY',
    title: 'The story comes with it.',
    detail: 'Our journal explores the people, engineering, and moments that made these cars matter.',
  },
];

export default function WhyMustangGarage() {
  const page=usePublicData().pages.home;
  const copy=page?.sections.find(section=>section.id==='our-point-of-view');

  return (
    <section className="mg-standard" id="story" aria-labelledby="mg-standard-title">
      <div className="mg-standard__masthead">
        <span><i aria-hidden="true" /> OUR POINT OF VIEW</span>
        <span>THE GARAGE CODE / 001</span>
      </div>

      <div className="mg-standard__spread">
        <header className="mg-standard__statement">
          <p className="mg-standard__eyebrow">A LITTLE ATTITUDE. A HIGHER STANDARD.</p>
          <h2 id="mg-standard-title">
            {copy?.heading ? copy.heading : <><span>Not every</span><span>car makes</span><em>the garage.</em></>}
          </h2>
          <span className="mg-standard__signature">MUSTANG GARAGE <i>/</i> A HOME FOR THE UNCOMMON</span>
        </header>

        <figure className="mg-standard__visual">
          <img src={copy?.image||garageImage} alt={copy?.image ? (copy.imageAlt||'Garage editorial image') : 'Mustang Shelby GT500 from the Mustang Garage collection'} loading="lazy" />
          <span className="mg-standard__image-index" aria-hidden="true">MG<br />/ 001</span>
          <span className="mg-standard__vertical" aria-hidden="true">CHARACTER CANNOT BE MASS-PRODUCED.</span>
          <figcaption><span>FROM THE GARAGE / COLLECTION STUDY</span><span>01 — THE ATTITUDE</span></figcaption>
        </figure>
      </div>

      <div className="mg-standard__editorial">
        <div className="mg-standard__position">
          <p className="mg-standard__eyebrow">THE NAME IS MUSTANG. THE MIND IS OPEN.</p>
          <h3>No single marque.<br /><em>One point of view.</em></h3>
        </div>
        <div className="mg-standard__note">
          <span>FROM THE GARAGE / AN EDITOR’S NOTE</span>
          <p>{copy?.body || <>Mustang Garage is a home for distinctive cars from every marque and era. Mustang gives us our attitude; <strong>rarity, history, and character</strong> decide what belongs.</>}</p>
          <span className="mg-standard__note-signature">COLLECT BROADLY. CURATE STRICTLY.</span>
        </div>
      </div>

      <div className="mg-standard__principles">
        {principles.map(({ number, label, title, detail }) => (
          <article className="mg-standard__principle" key={number}>
            <div className="mg-standard__principle-top">
              <span className="mg-standard__number" aria-hidden="true">{number}</span>
              <span className="mg-standard__principle-mark" aria-hidden="true">MG / CODE</span>
            </div>
            <p className="mg-standard__principle-label">{label}</p>
            <h3>{title}</h3>
            <p className="mg-standard__principle-detail">{detail}</p>
          </article>
        ))}
      </div>

      <div className="mg-standard__footer">
        <div><span>THE MACHINES ARE ONLY HALF THE STORY.</span><p>Meet the culture behind the metal.</p></div>
        <Link className="mg-standard__link" to="/journal">
          <span>READ THE GARAGE JOURNAL</span>
          <ArrowUpRight size={24} aria-hidden="true" />
        </Link>
        <Link className="mg-standard__inventory" to="/inventory">
          MEET THE MACHINES <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
