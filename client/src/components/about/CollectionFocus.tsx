import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockInventory } from '../../features/inventory/mockInventory';
import GarageImage from '../common/GarageImage';
import '../../styles/CollectionFocus.css';

const perspectives = [
  { number: '01', label: 'DESIGN', title: 'A silhouette that stays.', text: 'Cars with a strong point of view, from unmistakable silhouettes to thoughtful details.', caption: 'LOOK AT THE LINE. THEN LOOK AGAIN.', carId: 1, annotation: 'Start with what catches your eye: proportion, stance, and the details that make you want a second look.' },
  { number: '02', label: 'DRIVING CHARACTER', title: 'More than the numbers.', text: 'The appeal of a machine is personal. Its configuration can begin a conversation about the experience you are looking for.', caption: 'THE SPECIFICATION STARTS THE CONVERSATION.', carId: 3, annotation: 'Read the individual machine file. Ask about condition and suitability rather than assuming a particular driving experience from an image.' },
  { number: '03', label: 'STORY', title: 'Context gives it depth.', text: 'Each car has its own context. We share the history and records available for it, with room for the questions that remain.', caption: 'THE STORY DESERVES A CLOSER LOOK.', carId: 6, annotation: 'A badge, an era, a different perspective. Ask which records support the individual car’s story and which details still need an answer.' },
];

export default function CollectionFocus() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = perspectives[activeIndex];
  const car = mockInventory.find(item => item.id === active.carId);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % perspectives.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + perspectives.length) % perspectives.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = perspectives.length - 1;
    else return;
    event.preventDefault();
    setActiveIndex(next);
    tabs.current[next]?.focus();
  }

  return (
    <section className="mg-collection-focus" aria-labelledby="mg-collection-focus-title">
      <div className="mg-collection-focus__masthead"><span><i aria-hidden="true" /> THE COLLECTION / A CLOSER LOOK</span><span>THREE PERSPECTIVES. NO SINGLE FORMULA.</span></div>
      <header className="mg-collection-focus__heading"><div><p className="mg-collection-focus__eyebrow">WHAT CATCHES OUR EYE</p><h2 id="mg-collection-focus-title">DIFFERENT MACHINES.<br /><em>The same curiosity.</em></h2></div><p>Across marques. Across eras.<br />A collection connected by<br /><em>character, not convention.</em></p></header>

      <div className="mg-collection-focus__study">
        <div className="mg-collection-focus__selector">
          <span className="mg-collection-focus__selector-label">CHOOSE YOUR POINT OF VIEW</span>
          <div className="mg-collection-focus__tabs" role="tablist" aria-label="Collection perspectives">
            {perspectives.map((item,index) => <button
              type="button" role="tab" id={`mg-focus-tab-${index}`} aria-controls={`mg-focus-panel-${index}`}
              aria-selected={index === activeIndex} tabIndex={index === activeIndex ? 0 : -1}
              ref={element => { tabs.current[index] = element; }} key={item.number}
              onClick={() => setActiveIndex(index)} onKeyDown={event => handleKeyDown(event,index)}
            ><span className="mg-collection-focus__tab-number">{item.number}</span><span className="mg-collection-focus__tab-copy"><span>{item.label}</span><strong>{item.title}</strong></span><ArrowUpRight size={20} aria-hidden="true" /></button>)}
          </div>
          <p className="mg-collection-focus__selector-note">A perspective, not a promise. Each machine deserves its own questions.</p>
        </div>

        <div className="mg-collection-focus__panel" role="tabpanel" id={`mg-focus-panel-${activeIndex}`} aria-labelledby={`mg-focus-tab-${activeIndex}`} tabIndex={0}>
          <div className="mg-collection-focus__frame" key={active.number}>
            {car ? <GarageImage src={car.image} alt={`${car.year} ${car.make} ${car.model}`} /> : <span className="mg-collection-focus__image-missing">IMAGE NOT AVAILABLE</span>}
            <span className="mg-collection-focus__frame-label">COLLECTION STUDY / {active.number}</span>
            <span className="mg-collection-focus__frame-number" aria-hidden="true">{active.number}</span>
            <span className="mg-collection-focus__frame-caption">{active.caption}</span>
          </div>
          <div className="mg-collection-focus__annotation">
            <div><p className="mg-collection-focus__eyebrow">THE FOCUS / {active.label}</p><h3>{active.title}</h3><p>{active.text}</p></div>
            <div className="mg-collection-focus__machine-note"><span>A MACHINE FROM THE COLLECTION</span>{car && <><p>{car.year} / {car.make}</p><strong>{car.model}</strong><Link to={`/inventory/${car.id}`}>OPEN MACHINE FILE <ArrowUpRight size={18} aria-hidden="true" /></Link></>}</div>
          </div>
          <p className="mg-collection-focus__field-note"><span>↳</span>{active.annotation}</p>
        </div>
      </div>

      <div className="mg-collection-focus__closing"><span>THERE IS MORE THAN ONE WAY TO BELONG.</span><Link to="/inventory">FIND YOUR POINT OF VIEW <ArrowRight size={19} aria-hidden="true" /></Link></div>
      <p className="mg-collection-focus__note">GENERAL COLLECTION THEMES / Inventory images illustrate these perspectives. They do not establish a vehicle’s provenance, condition, or driving characteristics.</p>
    </section>
  );
}
