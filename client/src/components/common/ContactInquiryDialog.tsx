import { useEffect, useId, useRef, useState } from 'react';
import { Mail, X } from 'lucide-react';
import type { Car } from '../../features/inventory/types';
import ContactInquiryForm from './ContactInquiryForm';

type Props={cars:Car[];defaultCarId?:string;onClose:()=>void};
export default function ContactInquiryDialog({cars,defaultCarId,onClose}:Props) {
  const ref=useRef<HTMLDialogElement>(null);
  const titleId=useId();
  const [busy,setBusy]=useState(false);
  useEffect(()=>{
    const dialog=ref.current;
    if(!dialog)return;
    const previousFocus=document.activeElement;
    const previousOverflow=document.body.style.overflow;
    dialog.showModal();document.body.style.overflow='hidden';
    return()=>{dialog.close();document.body.style.overflow=previousOverflow;if(previousFocus instanceof HTMLElement&&previousFocus.isConnected)previousFocus.focus();};
  },[]);
  return <dialog ref={ref} className="mg-contact-dialog" aria-labelledby={titleId} onCancel={event=>{event.preventDefault();if(!busy)onClose();}} onClick={event=>{if(event.target===event.currentTarget&&!busy)onClose();}}>
    <div className="mg-contact-dialog__bar"><span><Mail size={15} aria-hidden="true"/>MUSTANG GARAGE / CONTACT DESK</span><button type="button" disabled={busy} onClick={onClose} aria-label="Close contact form"><X size={21} aria-hidden="true"/></button></div>
    <div className="mg-contact-page__form-panel"><div className="mg-contact-page__form-top"><span>YOUR NEXT CHAPTER</span><span>DIRECT TO THE GARAGE</span></div><h2 id={titleId}>A question.<br/><em>A conversation.</em></h2><p className="mg-contact-page__form-intro">Leave a message for the garage team. Your inquiry will reach the admin inbox.</p><ContactInquiryForm cars={cars} defaultCarId={defaultCarId} autoFocus onBusyChange={setBusy}/></div>
  </dialog>;
}
