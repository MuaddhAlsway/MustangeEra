import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import coverImage from '../../assets/FrontClassic.webp';
import detailImage from '../../assets/Mustange02.webp';
import '../../styles/OriginStory.css';
import { usePublicData } from '../../lib/publicContext';

const chapters = [
  { number: '01', label: 'THE SPARK', title: 'More than a machine.', copy: 'A shape that stops you. A detail you remember. A car can mean more than the figures on its specification sheet. That feeling is the starting point of this story.' },
  { number: '02', label: 'THE POINT OF VIEW', title: 'Character comes first.', copy: 'Mustang gives the garage its attitude, not its boundaries. Distinctive machines from different marques and eras belong in the conversation when there is something worth looking at more closely.' },
  { number: '03', label: 'THE ROAD AHEAD', title: 'Keep the story moving.', copy: 'Bring the machines, their details, and the people who care about them into the same place. Give curiosity a home, and leave room for the next chapter.' },
];

export default function OriginStory() {
  const origin=usePublicData().pages.about;
  const section=origin?.sections.find(item=>item.id==='origin-story');
  return (
    <section className="mg-origin" id="origin-story" aria-labelledby="mg-origin-title">
      <div className="mg-origin__masthead"><span><i aria-hidden="true" /> THE ORIGIN STORY</span><span>MUSTANG GARAGE / FIELD NOTES 001</span></div>
      <header className="mg-origin__heading">
        <div><p className="mg-origin__eyebrow">{origin?.hero?.eyebrow||'EVERY GARAGE BEGINS WITH A REASON.'}</p><h1 id="mg-origin-title">{origin?.hero?.title||<>BUILT ON<br />A LOVE OF<br /><em>the drive.</em></>}</h1></div>
        <aside className="mg-origin__annotation"><span>THE STARTING POINT</span><p>Not just what<br />you drive.<br /><em>What moves you.</em></p><span className="mg-origin__annotation-mark" aria-hidden="true">MG / 01</span></aside>
      </header>

      <div className="mg-origin__photo-spread">
        <figure className="mg-origin__cover"><img src={origin?.hero?.image||section?.image||coverImage} alt={origin?.hero?.imageAlt||section?.imageAlt||'White Mustang Boss 429 from the garage collection'} fetchPriority="high" /><span className="mg-origin__photo-label">{origin?.hero?.accent||'A HOME FOR THE UNCOMMON'}</span><figcaption><span>COLLECTION STUDY / No. 001</span><span>{origin?.hero?.description||'THE MACHINE IS ONLY THE BEGINNING.'}</span></figcaption></figure>
        <div className="mg-origin__side-note"><span>THE GARAGE / IN ONE LINE</span><p>Some things<br />are collected.<br /><em>Others stay<br />with you.</em></p><span className="mg-origin__note-rule" aria-hidden="true" /><span>CHARACTER OVER CONVENTION.</span></div>
      </div>

      <div className="mg-origin__editorial">
        <div className="mg-origin__editorial-heading"><p className="mg-origin__eyebrow">THE IDEA BEHIND THE NAME</p><h2>A little attitude.<br /><em>A lasting feeling.</em></h2><span>COLLECT BROADLY.<br />CURATE STRICTLY.</span></div>
        <div className="mg-origin__letter"><span className="mg-origin__letter-label">A NOTE FROM THE GARAGE</span><p className="mg-origin__lead">The best cars carry more than horsepower. They carry design, character, and stories worth passing on.</p><p>Mustang Garage is built around that idea: bring distinctive machines together and give each one the attention its story deserves. The badge starts the conversation. The details give it somewhere to go.</p><p>Our name reflects an attitude. Our collection makes room for different marques, eras, and perspectives. What connects them is a reason to look closer.</p><div className="mg-origin__signature"><strong>Mustang Garage.</strong><span>FOR THE MACHINES. FOR THE STORIES.</span></div></div>
      </div>

      <section className="mg-origin__chapters" aria-labelledby="mg-origin-chapters-title"><div className="mg-origin__chapter-heading"><h2 id="mg-origin-chapters-title">THREE NOTES.<br /><em>One point of view.</em></h2><span>THE GARAGE NOTEBOOK / 01 — 03</span></div><div className="mg-origin__chapter-grid">{chapters.map(chapter => <article className="mg-origin__chapter" key={chapter.number}><span className="mg-origin__chapter-number" aria-hidden="true">{chapter.number}</span><p className="mg-origin__eyebrow">{chapter.label}</p><h3>{chapter.title}</h3><p>{chapter.copy}</p></article>)}</div></section>

      <div className="mg-origin__closing"><figure><img src={detailImage} alt="Classic Mustang Shelby GT500 from the garage collection" loading="lazy" /><figcaption>ANOTHER MACHINE. ANOTHER CHAPTER.</figcaption></figure><div><p className="mg-origin__eyebrow">THE STORY CONTINUES WITH YOU.</p><h2>Come for the cars.<br /><em>Stay for the stories.</em></h2><Link className="mg-origin__collection-link" to="/inventory">STEP INSIDE THE COLLECTION <ArrowUpRight size={22} aria-hidden="true" /></Link><a className="mg-origin__contact" href="mailto:hello@mustanggarage.com">START A CONVERSATION <ArrowRight size={16} aria-hidden="true" /></a></div></div>
      <p className="mg-origin__sample-note">SAMPLE ORIGIN ESSAY / Brand storytelling for the design preview. Founders, dates, locations, and founding milestones have not been verified. Collection images are editorial illustrations.</p>
    </section>
  );
}
