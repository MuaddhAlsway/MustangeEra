import { useState } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import '../../styles/OwnerStories.css';

const stories = [
  {
    issue: 'OWNER FILE / 001',
    quote:
      'The first turn of the key brought the whole story back to life. This car was never meant to sit still.',
    name: 'MARCUS R.',
    detail: 'SAMPLE OWNER STORY · 1969 FORD MUSTANG',
    initials: 'MR',
  },
  {
    issue: 'OWNER FILE / 002',
    quote:
      'I wanted something with a past, a point of view, and enough attitude to make every drive an occasion.',
    name: 'ELENA W.',
    detail: 'SAMPLE OWNER STORY · 1970 PLYMOUTH CUDA',
    initials: 'EW',
  },
  {
    issue: 'OWNER FILE / 003',
    quote:
      'It is more than the numbers. It is the sound, the shape, and the people who stop to tell you their story.',
    name: 'JAMES T.',
    detail: 'SAMPLE OWNER STORY · 1993 JAGUAR XJ220',
    initials: 'JT',
  },
];

export default function OwnerStories() {
  const [activeIndex, setActiveIndex] = useState(0);
  const story = stories[activeIndex];

  const showStory = (direction: number) => {
    setActiveIndex(
      (current) => (current + direction + stories.length) % stories.length,
    );
  };

  return (
    <section
      className="mg-owner-stories"
      aria-labelledby="mg-owner-stories-title"
    >
      <div className="mg-owner-stories__topline">
        <span>
          <i /> THE PEOPLE BEHIND THE MACHINES
        </span>
        <span>
          GARAGE VOICES / {String(activeIndex + 1).padStart(2, '0')} — 03
        </span>
      </div>

      <div className="mg-owner-stories__layout" aria-live="polite">
        <div className="mg-owner-stories__visual" aria-hidden="true">
          <span className="mg-owner-stories__giant">MG</span>
          <span className="mg-owner-stories__portrait">{story.initials}</span>
          <span className="mg-owner-stories__visual-caption">
            SAMPLE STORY · EDITORIAL PLACEHOLDER
          </span>
          <span className="mg-owner-stories__issue">{story.issue}</span>
        </div>

        <div className="mg-owner-stories__copy">
          <p className="mg-owner-stories__eyebrow">{story.detail}</p>
          <h2 id="mg-owner-stories-title">
            EVERY CAR
            <br />
            HAS A <em>STORY.</em>
          </h2>

          <Quote
            className="mg-owner-stories__quote-mark"
            size={28}
            aria-hidden="true"
          />

          <blockquote>“{story.quote}”</blockquote>

          <div className="mg-owner-stories__credit">
            <span className="mg-owner-stories__avatar">{story.initials}</span>
            <span>
              <b>{story.name}</b>
              <small>SAMPLE TESTIMONIAL</small>
            </span>
          </div>

          <div className="mg-owner-stories__controls">
            <span>
              {String(activeIndex + 1).padStart(2, '0')} <i>/</i> 03
            </span>

            <div
              className="mg-owner-stories__progress"
              aria-label="Select an owner story"
            >
              {stories.map((item, index) => (
                <button
                  key={item.issue}
                  type="button"
                  aria-label={`Show owner story ${index + 1}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Previous story"
              onClick={() => showStory(-1)}
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Next story"
              onClick={() => showStory(1)}
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <p className="mg-owner-stories__disclaimer">
        SAMPLE CONTENT FOR DESIGN PREVIEW — REPLACE WITH VERIFIED OWNER
        PERMISSION AND QUOTES.
      </p>
    </section>
  );
}