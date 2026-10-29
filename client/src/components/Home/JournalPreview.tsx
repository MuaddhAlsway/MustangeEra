import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePublicData } from '../../lib/publicContext';
import GarageImage from '../common/GarageImage';
import '../../styles/JournalPreview.css';

export default function JournalPreview() {
  const {stories:journalStories,loading,error}=usePublicData();
  if(loading)return <section className="mg-api-state">Loading journal…</section>;
  if(error)return <section className="mg-api-state" role="alert">{error}</section>;
  if(!journalStories.length)return <section className="mg-api-state"><h2>The Garage Journal</h2><p>No stories have been published yet.</p></section>;
  const [featured, ...latest] = journalStories.slice(0, 3);

  return (
    <section className="mg-journal" id="journal" aria-labelledby="mg-journal-title">
      <div className="mg-journal__masthead">
        <span>INDEPENDENT MOTORING CULTURE</span>
        <span className="mg-journal__edition">VOL. 01 / THE GARAGE EDITION</span>
        <span>EST. MMXVIII</span>
      </div>

      <header className="mg-journal__heading">
        <div>
          <p className="mg-journal__eyebrow">MACHINES. PEOPLE. THE STORIES BETWEEN.</p>
          <h2 id="mg-journal-title">THE GARAGE <em>Journal.</em></h2>
        </div>
        <div className="mg-journal__heading-aside">
          <p>For the ones who hear<br />a story in every engine.</p>
          <Link className="mg-journal__all" to="/journal">
            VISIT THE JOURNAL <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <div className="mg-journal__section-rule">
        <span><i aria-hidden="true" /> THE LATEST DISPATCH</span>
        <span>HISTORY HAS HORSEPOWER.</span>
      </div>

      <div className="mg-journal__layout">
        <article className="mg-journal__feature">
          <Link className="mg-journal__feature-link" to={`/journal/${featured.slug}`}>
            <div className="mg-journal__feature-image">
              <GarageImage src={featured.image} alt={featured.imageAlt} />
              <span className="mg-journal__feature-stamp">THE COVER STORY</span>
              <span className="mg-journal__feature-number" aria-hidden="true">{featured.number}</span>
              <span className="mg-journal__image-caption">AMERICAN IRON / THE ORIGINS ISSUE</span>
            </div>
            <div className="mg-journal__feature-copy">
              <span className="mg-journal__category">{featured.category}</span>
              <h3>{featured.title}</h3>
              <p>{featured.excerpt}</p>
              <span className="mg-journal__read">
                <span>SAMPLE EDITORIAL <i>/</i> {featured.readTime}</span>
                <span className="mg-journal__read-arrow"><ArrowUpRight size={23} aria-hidden="true" /></span>
              </span>
            </div>
          </Link>
        </article>

        <aside className="mg-journal__latest" aria-label="More journal previews">
          <div className="mg-journal__latest-head">
            <span>FROM THE EDITORS</span><span>02 — 03</span>
          </div>
          {latest.map(story => (
            <article className="mg-journal__story" key={story.number}>
              <Link className="mg-journal__story-link" to={`/journal/${story.slug}`}>
                <div className="mg-journal__story-image">
                  <GarageImage src={story.image} alt="" />
                  <span aria-hidden="true">{story.number}</span>
                </div>
                <div className="mg-journal__story-copy">
                  <span className="mg-journal__category">{story.category}</span>
                  <h3>{story.title}</h3>
                  <p>{story.excerpt}</p>
                  <span className="mg-journal__story-read">
                    {story.readTime} <ArrowUpRight size={17} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
          <div className="mg-journal__editors-note">
            <span>A NOTE FROM THE GARAGE</span>
            <p>Good machines deserve<br /><em>good stories.</em></p>
            <Link className="mg-journal__archive" to="/journal">
              EXPLORE THE JOURNAL <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </div>

      <div className="mg-journal__bottomline">
        <span>MUSTANG GARAGE / THE AUTOMOTIVE JOURNAL</span>
        <span>BUILT FOR THE LONG READ. <b>001</b></span>
      </div>
    </section>
  );
}

