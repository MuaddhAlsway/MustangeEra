import { LoaderCircle } from 'lucide-react';
import '../../styles/AccountStates.css';

export default function GarageLoading({title='Loading garage records…'}:{title?:string}) {
  return <section className="mg-record-loading" role="status" aria-live="polite" aria-busy="true">
    <div className="mg-record-loading__heading"><span className="mg-record-loading__icon" aria-hidden="true"><LoaderCircle size={23} strokeWidth={1.4}/></span><div><p className="mg-record-loading__eyebrow">MUSTANG GARAGE / THE EDITORIAL DESK</p><h2>{title}</h2><p className="mg-record-loading__copy">Preparing your collection, stories, and conversations.</p></div></div>
    <div className="mg-record-loading__skeleton" aria-hidden="true"><span/><span/><span/></div>
    <div className="mg-record-loading__footer" aria-hidden="true"><span>CONNECTING TO THE GARAGE</span><span>MG / PLEASE WAIT</span></div>
  </section>;
}
