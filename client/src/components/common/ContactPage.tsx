import { useState } from 'react';
import { ArrowUpRight, ArrowRight, Mail } from 'lucide-react';
import ContactInquiryForm from './ContactInquiryForm';
import ContactInquiryDialog from './ContactInquiryDialog';
import { usePublicData } from '../../lib/publicContext';
import { PublishedContent } from '../../lib/PublicData';
import { Link, useSearchParams } from 'react-router-dom';
import contactImage from '../../assets/Collection090.webp';
import GarageImage from './GarageImage';
import { assetUrl } from '../../lib/api';
import '../../styles/ContactPage.css';

export default function ContactPage() {
  const {cars,pages}=usePublicData();
  const page=pages.contact;
  const contactHero=page?.hero;
  const [params]=useSearchParams();
  const [contactOpen,setContactOpen]=useState(false);

  return (
    <main className="mg-contact-page" aria-labelledby="mg-contact-title">
      <div className="mg-contact-page__masthead"><span><i aria-hidden="true" /> THE GARAGE / CONTACT</span><span>GOOD CONVERSATIONS START SOMEWHERE.</span></div>
      <header className={`mg-contact-page__heading${contactHero?.image?' mg-contact-page__heading--image':''}`}>
        {contactHero?.image&&<GarageImage className="mg-contact-page__heading-image" src={assetUrl(contactHero.image)} alt="" aria-hidden="true" priority />}
        <div><p className="mg-contact-page__eyebrow">{contactHero?.eyebrow||'THE GARAGE / CONTACT'}</p><h1 id="mg-contact-title">{contactHero?.title||'LET’S TALK'}<br /><em>{contactHero?.accent||'about what moves you.'}</em></h1></div><p>{contactHero?.description||'No perfect opening line needed. Just a little curiosity.'}</p>
      </header>

      <PublishedContent page="contact"/><div className="mg-contact-page__layout">
        <aside className="mg-contact-page__editorial" aria-label="Contact information">
          <figure className="mg-contact-page__image"><GarageImage src={assetUrl(contactHero?.image||contactImage)} alt={contactHero?.imageAlt||'Classic Mustang Shelby GT500 from the garage collection'} fetchPriority="high" /><span className="mg-contact-page__image-mark" aria-hidden="true">MG / 01</span><figcaption>THE MACHINE IS ONLY THE BEGINNING.</figcaption></figure>
          <div className="mg-contact-page__direct"><span className="mg-contact-page__eyebrow">PREFER A DIRECT INTRODUCTION?</span><button type="button" onClick={()=>setContactOpen(true)} aria-haspopup="dialog" aria-expanded={contactOpen}><Mail size={17} aria-hidden="true" /><span>hello@mustanggarage.com</span><ArrowUpRight size={18} aria-hidden="true" /></button><p>Select the address above to write to the garage. For visit arrangements or questions about a car, leave the team a message.</p></div>
          <Link className="mg-contact-page__inventory" to="/inventory">STILL LOOKING FOR THE RIGHT MACHINE? <ArrowRight size={17} aria-hidden="true" /></Link>
        </aside>

        <section className="mg-contact-page__form-panel" aria-labelledby="mg-contact-form-title">
          <div className="mg-contact-page__form-top"><span>CORRESPONDENCE / No. 01</span><span>THE GARAGE DESK</span></div>
          <h2 id="mg-contact-form-title">Start the<br /><em>conversation.</em></h2>
          <p className="mg-contact-page__form-intro">Tell us what you have in mind. Your message will be submitted to the garage inbox.</p>
          <ContactInquiryForm cars={cars} defaultCarId={params.get("car")??""}/>
        </section>
      </div>
      <div className="mg-contact-page__closing"><span>FOR THE MACHINES. FOR THE STORIES. FOR THE PEOPLE.</span><Link to="/about">MEET THE GARAGE <ArrowRight size={17} aria-hidden="true" /></Link></div>
      {contactOpen&&<ContactInquiryDialog cars={cars} defaultCarId={params.get("car")??""} onClose={()=>setContactOpen(false)}/>}
    </main>
  );
}
