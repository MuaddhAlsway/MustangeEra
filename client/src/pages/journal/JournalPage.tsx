import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { journalContentNote } from '../../features/journal/stories';
import { usePublicData } from '../../lib/publicContext';
import GarageImage from '../../components/common/GarageImage';
import '../../styles/JournalPages.css';

export default function JournalPage() {
  const {stories:journalStories,loading,error,pages}=usePublicData();
  const hero=pages.journal?.hero;
  if(loading)return <section className="mg-api-state">Loading journal…</section>;
  if(error)return <section className="mg-api-state" role="alert">{error}</section>;
  if(!journalStories.length)return <main className="mg-journal-page"><div className="mg-journal-page__masthead"><span>{hero?.eyebrow||'MUSTANG GARAGE / EDITORIAL'}</span><span>VOLUME 01 — THE GARAGE EDITION</span></div><header className="mg-journal-page__heading"><div><p className="mg-journal-page__kicker">HISTORY. CHARACTER. A LITTLE ATTITUDE.</p><h1>{hero?.title||'THE GARAGE'}<br/><em>{hero?.accent||'JOURNAL.'}</em></h1></div><p>{hero?.description||'For the stories that start where the specification sheet ends.'}</p></header>{hero?.image&&<GarageImage src={hero.image} alt={hero.imageAlt||''} fetchPriority="high" style={{width:'100%',maxHeight:520,objectFit:'cover'}}/>}<p className="mg-api-state">No stories have been published yet.</p></main>;
  const [featured, ...articles] = journalStories;
  return (
    <main className="mg-journal-page" aria-labelledby="mg-journal-page-title">
      <div className="mg-journal-page__masthead"><span>{hero?.eyebrow||'MUSTANG GARAGE / EDITORIAL'}</span><span>VOLUME 01 — THE GARAGE EDITION</span></div>
      <header className="mg-journal-page__heading">
        <div><p className="mg-journal-page__kicker">HISTORY. CHARACTER. A LITTLE ATTITUDE.</p><h1 id="mg-journal-page-title">{hero?.title||'THE GARAGE'}<br /><em>{hero?.accent||'JOURNAL.'}</em></h1></div>
        <p>{hero?.description||'For the stories that start where the specification sheet ends.'}</p>
      </header>
      {hero?.image&&<GarageImage src={hero.image} alt={hero.imageAlt||''} fetchPriority="high" style={{width:'100%',maxHeight:520,objectFit:'cover'}}/>}
      <Link className="mg-journal-page__cover" to={`/journal/${featured.slug}`}>
        <GarageImage src={featured.image} alt={featured.imageAlt} fetchPriority="high" />
        <span className="mg-journal-page__cover-label">THE COVER STORY / {featured.number}</span>
        <div className="mg-journal-page__cover-copy"><p className="mg-journal-page__kicker">{featured.category} / {featured.readTime}</p><h2>{featured.title}</h2><p>{featured.excerpt}</p><span>READ THE FEATURE <ArrowUpRight size={22} aria-hidden="true" /></span></div>
      </Link>
      <div className="mg-journal-page__issue-line"><span>ORIGINAL SAMPLE EDITORIAL</span><span>{String(journalStories.length).padStart(2, '0')} STORIES / ONE POINT OF VIEW</span></div>
      <section aria-labelledby="mg-journal-latest-title" className="mg-journal-page__latest">
        <div className="mg-journal-page__section-heading"><h2 id="mg-journal-latest-title">FROM THE EDITORS.</h2><span>THE REST OF THE ISSUE <ArrowRight size={17} aria-hidden="true" /></span></div>
        <div className="mg-journal-page__grid">
          {articles.map(article => <article className="mg-journal-page__card" key={article.slug}>
            <Link to={`/journal/${article.slug}`}>
              <div className="mg-journal-page__card-image"><GarageImage src={article.image} alt={article.imageAlt} /><span>{article.number}</span></div>
              <p className="mg-journal-page__kicker">{article.category}</p><h3>{article.title}</h3><p className="mg-journal-page__excerpt">{article.excerpt}</p><span className="mg-journal-page__read">{article.readTime}<ArrowUpRight size={20} aria-hidden="true" /></span>
            </Link>
          </article>)}
        </div>
      </section>
      <p className="mg-journal-page__sample-note">{journalContentNote}</p>
    </main>
  );
}
