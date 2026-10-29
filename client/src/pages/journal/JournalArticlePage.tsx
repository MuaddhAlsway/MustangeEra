import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { journalContentNote } from '../../features/journal/stories';
import { usePublicData } from '../../lib/publicContext';
import '../../styles/JournalPages.css';

export default function JournalArticlePage() {
  const {stories:journalStories,loading,error}=usePublicData();
  const { slug } = useParams<{ slug: string }>();
  if(loading)return <main className="mg-api-state">Loading story…</main>;
  if(error)return <main className="mg-api-state" role="alert">{error}</main>;
  const story = journalStories.find(article => article.slug === slug);
  if (!story) return (
    <main className="mg-journal-page mg-journal-page--missing">
      <p className="mg-journal-page__kicker">MUSTANG GARAGE / FILE 404</p><h1>THIS PAGE<br /><em>TOOK A DETOUR.</em></h1><p>That article is not in this issue. There are more stories waiting in the journal.</p><Link className="mg-journal-page__back" to="/journal"><ArrowLeft size={16} aria-hidden="true" /> BACK TO THE JOURNAL</Link>
    </main>
  );
  const related = journalStories.filter(article => article.slug !== story.slug).slice(0, 2);
  return (
    <main className="mg-journal-page mg-journal-page--article">
      <div className="mg-journal-page__masthead"><Link className="mg-journal-page__back" to="/journal"><ArrowLeft size={16} aria-hidden="true" /> THE JOURNAL</Link><span>VOLUME 01 / STORY {story.number}</span></div>
      <article aria-labelledby="mg-journal-article-title">
        <header className="mg-journal-page__article-heading"><p className="mg-journal-page__kicker">{story.category} <span>/</span> {story.readTime}</p><h1 id="mg-journal-article-title">{story.title}</h1><p>{story.excerpt}</p><span className="mg-journal-page__byline">BY THE GARAGE EDITORIAL / SAMPLE ESSAY</span></header>
        <figure className="mg-journal-page__article-cover"><img src={story.image} alt={story.imageAlt} fetchPriority="high" /><figcaption>INVENTORY IMAGE / EDITORIAL ILLUSTRATION <span>MG / {story.number}</span></figcaption></figure>
        <div className="mg-journal-page__reading-layout">
          <aside className="mg-journal-page__contents" aria-label="Article contents"><span>IN THIS STORY</span><nav aria-label="Article sections">{story.body.map((section, index) => <a href={`#journal-section-${index + 1}`} key={section.heading}><span>{String(index + 1).padStart(2, '0')}</span>{section.heading}</a>)}</nav><p>{story.readTime} / SAMPLE EDITORIAL</p></aside>
          <div className="mg-journal-page__body">
            <p className="mg-journal-page__article-note">{journalContentNote}</p>
            {story.body.map((section, index) => <section id={`journal-section-${index + 1}`} key={section.heading} aria-labelledby={`journal-section-title-${index + 1}`}><p className="mg-journal-page__kicker">{String(index + 1).padStart(2, '0')} / THE STORY</p><h2 id={`journal-section-title-${index + 1}`}>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}
            <div className="mg-journal-page__article-end"><span>END OF FILE / {story.number}</span><Link className="mg-journal-page__back" to="/journal"><ArrowLeft size={16} aria-hidden="true" /> BACK TO THE JOURNAL</Link></div>
          </div>
        </div>
      </article>
      <section className="mg-journal-page__related" aria-labelledby="mg-journal-related-title"><div className="mg-journal-page__section-heading"><h2 id="mg-journal-related-title">KEEP READING.</h2><span>ANOTHER ROAD. ANOTHER STORY.</span></div><div className="mg-journal-page__related-grid">{related.map(article => <Link to={`/journal/${article.slug}`} key={article.slug}><img src={article.image} alt="" loading="lazy" /><div><p className="mg-journal-page__kicker">{article.category}</p><h3>{article.title}</h3><span>{article.readTime} <ArrowUpRight size={18} aria-hidden="true" /></span></div></Link>)}</div></section>
    </main>
  );
}
