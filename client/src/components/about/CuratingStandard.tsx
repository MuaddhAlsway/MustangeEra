import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../../styles/CuratingStandard.css';

const steps = [
  {
    number: '01', label: 'THE FIRST LOOK', title: 'Look for character.',
    detail: 'Describe the qualities that make a car a fit for the collection: its design, story, specification, or driving spirit.',
    focus: 'DESIGN / SPECIFICATION / INDIVIDUALITY',
    questions: ['What makes this particular machine worth a closer look?', 'Which details distinguish it from a familiar model description?'],
  },
  {
    number: '02', label: 'THE PAPER TRAIL', title: 'Review what is known.',
    detail: 'Document the available history and supporting records, and be clear about details that remain unverified.',
    focus: 'HISTORY / RECORDS / THE GAPS BETWEEN',
    questions: ['What records can be reviewed alongside the listing?', 'Which claims are supported, and what remains unknown?'],
  },
  {
    number: '03', label: 'THE MACHINE FILE', title: 'Present it honestly.',
    detail: 'Share the car’s condition, specifications, and known history in clear language for interested buyers.',
    focus: 'CLEAR LANGUAGE / CONTEXT / CONVERSATION',
    questions: ['Can a reader separate supplied facts from editorial description?', 'What should be discussed with the garage before going further?'],
  },
];

export default function CuratingStandard() {
  return (
    <section className="mg-curation" aria-labelledby="mg-curation-title">
      <div className="mg-curation__masthead"><span><i aria-hidden="true" /> THE CURATING STANDARD</span><span>WORKSHOP NOTES / DRAFT 02</span></div>
      <div className="mg-curation__layout">
        <header className="mg-curation__intro">
          <p className="mg-curation__eyebrow">THE REASON. THE RECORD. THE REALITY.</p>
          <h2 id="mg-curation-title">A GOOD<br />STORY.<br /><em>A closer<br />look.</em></h2>
          <p>Every car is considered on its own merits. Our aim is to explain what makes it distinctive and share what we know with care and clarity.</p>
          <div className="mg-curation__margin-note"><span>THE WORKING PRINCIPLE</span><p>Curiosity gets us interested.<br /><em>The details keep us honest.</em></p></div>
          <span className="mg-curation__folio">MG / STANDARD No. 02</span>
        </header>
        <div className="mg-curation__process">
          <div className="mg-curation__process-heading"><span>THREE STAGES / ONE STANDARD</span><span>OPEN A CHAPTER <ArrowRight size={14} aria-hidden="true" /></span></div>
          <ol className="mg-curation__steps">
            {steps.map((step, index) => <li key={step.number}>
              <details className="mg-curation__step" open={index === 0}>
                <summary><span className="mg-curation__number" aria-hidden="true">{step.number}</span><span className="mg-curation__step-title"><span>{step.label}</span><h3>{step.title}</h3></span><span className="mg-curation__toggle"><Plus size={20} aria-hidden="true" /></span></summary>
                <div className="mg-curation__step-body"><p>{step.detail}</p><div className="mg-curation__questions"><span>QUESTIONS WORTH ASKING</span><ul>{step.questions.map(question => <li key={question}>{question}</li>)}</ul></div><span className="mg-curation__focus">{step.focus}</span></div>
              </details>
            </li>)}
          </ol>
          <div className="mg-curation__process-note"><span aria-hidden="true">↳</span><p>A good machine file makes room for what is known <em>and</em> what still needs an answer.</p></div>
        </div>
      </div>
      <div className="mg-curation__closing"><div><span>FROM A POINT OF VIEW TO A MACHINE FILE.</span><p>See the collection.<br /><em>Ask the next question.</em></p></div><div className="mg-curation__actions"><Link to="/inventory">EXPLORE THE MACHINES <ArrowUpRight size={22} aria-hidden="true" /></Link><a href="mailto:hello@mustanggarage.com">ASK ABOUT OUR APPROACH <ArrowRight size={17} aria-hidden="true" /></a></div></div>
      <p className="mg-curation__note">DRAFT PROCESS COPY / These are editorial working principles. Confirm they match the garage’s actual practices before publishing; they do not establish inspection results or vehicle certification.</p>
    </section>
  );
}
