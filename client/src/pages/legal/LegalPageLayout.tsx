import { useEffect,useState } from 'react';
import { api } from '../../lib/api';
import type { PublishedPage } from '../../lib/PublicData';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LegalDraft } from '../../features/legal/drafts';
import '../../styles/LegalPages.css';

type LegalPageLayoutProps = { document: LegalDraft };

export default function LegalPageLayout({ document: fallback }: LegalPageLayoutProps) {
  const [published,setPublished]=useState<PublishedPage|null>(null);
  useEffect(()=>{let active=true;api<PublishedPage>(`/public/pages/${fallback.kind}`).then(value=>{if(active)setPublished(value);}).catch(()=>undefined);return()=>{active=false;};},[fallback.kind]);
  const document:LegalDraft=published?{...fallback,title:published.title,introduction:published.intro,sections:published.sections.map(section=>({id:section.id,title:section.heading,paragraphs:section.body.split(/\n\s*\n/),confirm:'Business and legal review remains the publisher’s responsibility.'}))}:fallback;
  const prefix = `mg-legal-${document.kind}`;
  const otherPage = document.kind === 'privacy' ? { to: '/terms', label: 'Terms & Conditions' } : { to: '/privacy', label: 'Privacy Policy' };
  return (
    <main className="mg-legal" aria-labelledby={`${prefix}-title`}>
      <div className="mg-legal__masthead"><Link to="/" className="mg-legal__back"><ArrowLeft size={15} aria-hidden="true" /> MUSTANG GARAGE</Link><span>THE DETAILS / LEGAL DRAFT</span></div>
      <header className="mg-legal__heading"><p className="mg-legal__eyebrow">CLARITY MATTERS.</p><h1 id={`${prefix}-title`}>{document.title}</h1><p>{document.subtitle}</p><div className="mg-legal__metadata"><span>DRAFT — LEGAL REVIEW REQUIRED</span><span>EFFECTIVE DATE: PENDING APPROVAL</span></div></header>
      <aside className="mg-legal__notice" aria-labelledby={`${prefix}-notice`}><h2 id={`${prefix}-notice`}>Before this page is published</h2><p>{document.introduction}</p><p>Confirmation notes are intentionally visible. This draft is not an exhaustive legal checklist; the responsible business and its legal adviser must approve the final scope and wording.</p></aside>
      <div className="mg-legal__layout">
        <nav className="mg-legal__contents" aria-label={`${document.title} sections`}><span>IN THIS DOCUMENT</span>{document.sections.map((section,index) => <a key={section.id} href={`#${prefix}-${section.id}`}><span>{String(index+1).padStart(2,'0')}</span>{section.title}</a>)}<Link className="mg-legal__crosslink" to={otherPage.to}>{otherPage.label}<ArrowUpRight size={16} aria-hidden="true" /></Link></nav>
        <div className="mg-legal__sections">{document.sections.map((section,index) => <section key={section.id} id={`${prefix}-${section.id}`} aria-labelledby={`${prefix}-${section.id}-title`}><p className="mg-legal__section-number">{String(index+1).padStart(2,'0')} / {document.kind === 'privacy' ? 'PRIVACY' : 'TERMS'}</p><h2 id={`${prefix}-${section.id}-title`}>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<div className="mg-legal__confirm"><span>TO CONFIRM BEFORE PUBLICATION</span><p>{section.confirm}</p></div></section>)}</div>
      </div>
      <div className="mg-legal__end"><span>END OF DRAFT / BUSINESS & LEGAL APPROVAL PENDING</span><Link to={otherPage.to}>{otherPage.label}<ArrowUpRight size={17} aria-hidden="true" /></Link></div>
    </main>
  );
}
