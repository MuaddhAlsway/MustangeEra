import { ArrowRight, ArrowUpRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../../styles/PeopleBehindGarage.css';

const conversations = [
  { number: '01', question: 'What caught your eye?', answer: 'A silhouette. A specification. A memory of a car you have never quite forgotten. Start with what drew you in.' },
  { number: '02', question: 'What would you like to know?', answer: 'Ask about the machine file, the available records, or the details that are still unclear. A good conversation makes room for questions.' },
  { number: '03', question: 'What is your next chapter?', answer: 'A different marque, another era, or a story of your own. Tell the garage what you are curious about.' },
];

export default function PeopleBehindGarage() {
  return (
    <section className="mg-people" aria-labelledby="mg-people-title">
      <div className="mg-people__masthead"><span><i aria-hidden="true" /> THE PEOPLE BEHIND THE GARAGE</span><span>THE HUMAN SIDE / FIELD NOTE 04</span></div>
      <header className="mg-people__heading"><div><p className="mg-people__eyebrow">THE BEST PART IS WHO YOU MEET ALONG THE WAY.</p><h2 id="mg-people-title">HUMAN.<br /><em>By nature.</em></h2></div><p>Behind every machine,<br />there is a reason<br /><em>to start talking.</em></p></header>

      <div className="mg-people__spread">
        <aside className="mg-people__profile" aria-label="Garage identity card">
          <div className="mg-people__profile-top"><span>THE GARAGE DESK</span><span>No. 04</span></div>
          <div className="mg-people__identity" aria-hidden="true"><span className="mg-people__identity-small">MUSTANG</span><span className="mg-people__monogram">M<span>G</span></span><span className="mg-people__identity-small">GARAGE</span></div>
          <div className="mg-people__profile-caption"><span>CHARACTER BRINGS US TOGETHER.</span><span className="mg-people__profile-rule" aria-hidden="true" /></div>
          <div className="mg-people__profile-bottom"><span>AN INTRODUCTION,<br />NOT JUST AN INVENTORY.</span><MessageCircle size={22} strokeWidth={1.3} aria-hidden="true" /></div>
        </aside>

        <div className="mg-people__editorial">
          <div className="mg-people__letter"><span className="mg-people__eyebrow">A NOTE FROM THE GARAGE</span><h3>Good cars.<br /><em>Better conversation.</em></h3><p className="mg-people__lead">Mustang Garage is built around a shared appreciation for distinctive cars and the stories people bring to them.</p><p>A machine might be the starting point. Your questions, your curiosity, and the details that matter to you give the conversation its direction.</p><div className="mg-people__signature"><span>Mustang Garage.</span><span>FOR THE MACHINES.<br />AND THE PEOPLE AROUND THEM.</span></div></div>
          <div className="mg-people__conversations"><div className="mg-people__conversation-heading"><span>THREE WAYS TO SAY HELLO</span><span>01 — 03</span></div>{conversations.map(item => <article key={item.number}><span className="mg-people__number" aria-hidden="true">{item.number}</span><div><h3>{item.question}</h3><p>{item.answer}</p></div><ArrowUpRight size={16} aria-hidden="true" /></article>)}</div>
        </div>
      </div>

      <div className="mg-people__invitation"><div><span>YOUR NEXT CONVERSATION STARTS HERE.</span><p>Tell us what<br /><em>moves you.</em></p></div><div className="mg-people__actions"><a href="mailto:hello@mustanggarage.com">SAY HELLO TO THE GARAGE <ArrowUpRight size={22} aria-hidden="true" /></a><span>hello@mustanggarage.com</span><Link to="/inventory">LET THE MACHINES DO THE INTRODUCTIONS <ArrowRight size={16} aria-hidden="true" /></Link></div></div>
      <p className="mg-people__note">EDITORIAL PROFILE PREVIEW / The identity card is a graphic, not a founder portrait. Add approved names, biographies, and photographs before presenting individual team profiles.</p>
    </section>
  );
}
