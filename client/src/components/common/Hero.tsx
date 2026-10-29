import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import './../../styles/Hero.css';
import Hero01 from '../../assets/Hero01.webp'
import Hero02 from '../../assets/Hero030.webp'
import Hero03 from '../../assets/Hero03.webp'
import { usePublicData } from '../../lib/publicContext';
import GarageImage from './GarageImage';

type HeroSlide = {
  image: string;
  issue: string;
  label: string;
  kicker: string;
  title: string;
  accent: string;
  description: string;
  year: string;
  model: string;
};

const slides: HeroSlide[] = [
  {
    image: Hero01,
    issue: '01',
    label: 'COVER STORY',
    kicker: 'THE AMERICAN ORIGINAL · EST. 1964',
    title: 'BORN TO',
    accent: 'RUN.',
    description: 'The long hood. The fastback line. An icon that never learned to sit still.',
    year: '1969',
    model: 'MUSTANG BOSS 429',
  },
  {
    image: Hero02,
    issue: '02',
    label: 'RARE FORM',
    kicker: 'DETROIT IRON · LIMITED LEGEND',
    title: 'BUILT TO',
    accent: 'BE LOUD.',
    description: 'Big displacement, unmistakable presence, and a story worth passing down.',
    year: '1970',
    model: 'DODGE CHALLENGER R/T',
  },
  {
    image: Hero03,
    issue: '03',
    label: 'MODERN CLASSIC',
    kicker: 'NEXT-GEN MUSCLE · PURE ATTITUDE',
    title: 'THE ROAD',
    accent: 'IS YOURS.',
    description: 'A new chapter in American performance. Same pulse, sharper edge.',
    year: '2022',
    model: 'MUSTANG SHELBY GT500',
  },
];

export default function Hero() {
  const {pages}=usePublicData();
  const custom=pages.home?.hero;
  const configuredSlides=custom?.slides?.length===3?custom.slides:undefined;
  const [activeIndex, setActiveIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const navigateRef = useRef<(index: number) => void>(index=>setActiveIndex((index%slides.length+slides.length)%slides.length));
  const activeSlide = configuredSlides?.[activeIndex]??slides[activeIndex];
  const goTo = (index: number) => navigateRef.current(index);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let cancelled=false;
    let cleanup=()=>{};
    void (async()=>{
    const [{gsap},{ScrollTrigger}]=await Promise.all([import('gsap'),import('gsap/ScrollTrigger')]);
    if(cancelled)return;
    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0;
    let locked = false;
    let hovered = hero.matches(':hover');
    let focused = hero.contains(document.activeElement);
    let lastInteraction = 0;
    let lastWheel = 0;
    let wheelTotal = 0;
    let visible = false;
    const image = hero.querySelector('.mg-hero__image');
    const copy = gsap.utils.toArray<HTMLElement>(
      '.mg-hero__eyebrow, .mg-hero__cover-label, .mg-hero h1, .mg-hero__content > p, .mg-hero__cta, .mg-hero__feature',
      hero,
    );
    let timeline: gsap.core.Timeline;
    let trigger: ScrollTrigger;
    const context = gsap.context(() => {
      timeline = gsap.timeline({ paused: true });
      trigger = ScrollTrigger.create({
        trigger: hero,
        start: 'top center',
        end: 'bottom center',
        onToggle: self => { visible = self.isActive; },
      });
      visible = trigger.isActive;
    }, hero);

    const changeSlide = (target: number, manual = true) => {
      if (manual) lastInteraction = performance.now();
      const next = (target + slides.length) % slides.length;
      if (locked || next === index) return;
      const direction = target > index ? 1 : -1;
      const commit = () => {
        index = next;
        flushSync(() => setActiveIndex(next));
      };
      if (reduced.matches) {
        commit();
        return;
      }
      locked = true;
      timeline.clear().eventCallback('onComplete', () => { locked = false; });
      timeline
        .to(copy, { autoAlpha: 0, y: -12 * direction, duration: 0.22, stagger: 0.015, ease: 'power2.in' }, 0)
        .to(image, { opacity: 0.25, scale: 1.06, xPercent: -1 * direction, duration: 0.32 }, 0)
        .call(commit)
        .fromTo(image,
          { opacity: 0.25, scale: 1.08, xPercent: direction },
          { opacity: 1, scale: 1.025, xPercent: 0, duration: 0.85, ease: 'power3.out' },
        )
        .fromTo(copy,
          { autoAlpha: 0, y: 24 * direction },
          { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.045, ease: 'power3.out' },
          '<0.08',
        )
        .play(0);
    };
    navigateRef.current = target => changeSlide(target);

    const onWheel = (event: WheelEvent) => {
      // Leave zoom gestures, horizontal gestures and reduced-motion scrolling native.
      if (!hovered || !visible || reduced.matches || event.ctrlKey || event.defaultPrevented ||
          Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      const direction = Math.sign(event.deltaY);
      const now = performance.now();
      const gap = now - lastWheel;
      lastWheel = now;
      lastInteraction = now;
      if (locked) {
        event.preventDefault();
        wheelTotal = 0;
        return;
      }
      if ((direction > 0 && index === slides.length - 1) || (direction < 0 && index === 0)) {
        wheelTotal = 0;
        return;
      }
      event.preventDefault();
      // Wait for a fresh gesture after a slide transition.
      if (gap < 220 && wheelTotal === 0) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? hero.clientHeight : 1);
      if (gap >= 220 || Math.sign(wheelTotal) !== direction) wheelTotal = 0;
      wheelTotal += delta;
      if (Math.abs(wheelTotal) >= 40) {
        changeSlide(index + direction);
        wheelTotal = 0;
      }
    };
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') hovered = true;
    };
    const onLeave = () => { hovered = false; wheelTotal = 0; };
    const onFocus = () => { focused = true; lastInteraction = performance.now(); };
    const onBlur = (event: FocusEvent) => {
      focused = event.relatedTarget instanceof Node && hero.contains(event.relatedTarget);
    };
    const onMotionChange = () => {
      timeline.pause().clear();
      locked = false;
      gsap.set([image, ...copy], { clearProps: 'opacity,visibility,transform' });
    };
    hero.addEventListener('wheel', onWheel, { passive: false });
    hero.addEventListener('pointerenter', onEnter);
    hero.addEventListener('pointerleave', onLeave);
    hero.addEventListener('focusin', onFocus);
    hero.addEventListener('focusout', onBlur);
    reduced.addEventListener('change', onMotionChange);
    const timer = window.setInterval(() => {
      if (!hovered && !focused && visible && !document.hidden && !reduced.matches &&
          performance.now() - lastInteraction >= 7000) changeSlide(index + 1, false);
    }, 7000);

    cleanup=() => {
      window.clearInterval(timer);
      hero.removeEventListener('wheel', onWheel);
      hero.removeEventListener('pointerenter', onEnter);
      hero.removeEventListener('pointerleave', onLeave);
      hero.removeEventListener('focusin', onFocus);
      hero.removeEventListener('focusout', onBlur);
      reduced.removeEventListener('change', onMotionChange);
      navigateRef.current = () => {};
      context.revert();
    };
    })();
    return()=>{cancelled=true;cleanup();};
  }, []);

  return (
    <section
      ref={heroRef}
      className="mg-hero"
      aria-roledescription="carousel"
      aria-label="Featured muscle cars"
    >
      <GarageImage
        className="mg-hero__image"
        src={activeSlide.image||custom?.image||slides[activeIndex].image}
        alt={`${activeSlide.year} ${activeSlide.model}`}
        fetchPriority="high"
        decoding="async"
      />
      <div className="mg-hero__shade" />
      <div className="mg-hero__grain" aria-hidden="true" />

      <div className="mg-hero__masthead" aria-hidden="true">
        <span>MUSTANG GARAGE</span>
        <i>THE AMERICAN AUTOMOTIVE JOURNAL</i>
        <b>VOL. 01 — MMXXV</b>
      </div>

      <div className="mg-hero__content">
        <div className="mg-hero__eyebrow">
          <span />
          {configuredSlides?activeSlide.kicker:(custom?.eyebrow||activeSlide.kicker)}
        </div>

        <div className="mg-hero__cover-label">
          <span>{activeSlide.label}</span>
          <i>NO. {activeSlide.issue}</i>
        </div>

        <h1>
          {configuredSlides?activeSlide.title:(custom?.title||activeSlide.title)}
          <br />
          <em>{configuredSlides?activeSlide.accent:(custom?.accent||activeSlide.accent)}</em>
        </h1>

        <p>{configuredSlides?activeSlide.description:(custom?.description||activeSlide.description)}</p>

        <a className="mg-hero__cta" href="#inventory">
          <span>EXPLORE THE GARAGE</span>
          <ArrowUpRight size={17} />
        </a>
      </div>

      <div className="mg-hero__vertical" aria-hidden="true">
        <span>AMERICAN IRON</span>
        <i />
        <span>RARE BY NATURE</span>
        <i />
        <span>BUILT FOR THE LONG ROAD</span>
      </div>

      <div className="mg-hero__feature" aria-live="polite">
        <span className="mg-hero__feature-year">{activeSlide.year}</span>
        <span className="mg-hero__feature-rule" />
        <span className="mg-hero__feature-model">{activeSlide.model}</span>
        <span className="mg-hero__feature-caption">FEATURED MACHINE</span>
      </div>

      <div className="mg-hero__footer">
        <a className="mg-hero__scroll" href="#inventory">
          <ArrowDown size={15} />
          SCROLL TO THE COLLECTION
        </a>

        <div className="mg-hero__controls" aria-label="Carousel controls">
          <span className="mg-hero__count">
            <b>{activeSlide.issue}</b> <i>/</i> 03
          </span>

          <div className="mg-hero__progress">
            {slides.map((slide, index) => (
              <button
                key={slide.issue}
                type="button"
                aria-label={`Show featured car ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                className={index === activeIndex ? 'is-active' : ''}
                onClick={() => goTo(index)}
              />
            ))}
          </div>

          <button
            className="mg-hero__arrow"
            type="button"
            aria-label="Previous featured car"
            onClick={() => goTo(activeIndex - 1)}
          >
            <ArrowLeft size={16} />
          </button>

          <button
            className="mg-hero__arrow"
            type="button"
            aria-label="Next featured car"
            onClick={() => goTo(activeIndex + 1)}
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <span className="mg-hero__edge-index" aria-hidden="true">
        MG / {activeSlide.issue}
      </span>
    </section>
  );
}


