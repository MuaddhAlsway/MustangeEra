import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Car } from '../../features/inventory/types';
import { api } from '../../lib/api';

type Props={cars:Car[];defaultCarId?:string;autoFocus?:boolean;onBusyChange?:(busy:boolean)=>void};
export default function ContactInquiryForm({cars,defaultCarId='',autoFocus=false,onBusyChange}:Props) {
  const id=useId();
  const [busy,setBusy]=useState(false);
  const [status,setStatus]=useState<{type:'success'|'error';message:string}|null>(null);
  async function handleSubmit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(busy)return;
    const form=event.currentTarget;
    if(!form.reportValidity())return;
    const data=new FormData(form);
    const name=String(data.get('name')??'').trim();
    const email=String(data.get('email')??'').trim();
    const topic=String(data.get('topic')??'General question');
    const carId=String(data.get('car')??'');
    const car=cars.find(item=>String(item.id)===carId);
    const message=String(data.get('message')??'').trim();
    if(!name||message.length<10){setStatus({type:'error',message:'Enter your name and a message of at least 10 characters.'});return;}
    const subject=`Mustang Garage / ${topic}${car?` / ${car.model}`:''}`;
    setBusy(true);onBusyChange?.(true);setStatus(null);
    try {
      const result=await api<{message:string}>('/public/contact',{method:'POST',body:JSON.stringify({name,email,subject,message,...(car?{carId:car.id}:{})})});
      setStatus({type:'success',message:result.message});form.reset();
    }catch(error){setStatus({type:'error',message:error instanceof Error?error.message:'Your inquiry could not be submitted. Please try again.'});}
    finally{setBusy(false);onBusyChange?.(false);}
  }
  return <form onSubmit={handleSubmit} aria-describedby={`${id}-delivery`} aria-busy={busy}>
    <p className="mg-contact-page__required-note">Fields marked * are required.</p>
    <fieldset className="mg-contact-page__form-fields" disabled={busy}>
      <legend className="mg-contact-page__visually-hidden">Your inquiry</legend>
      <div className="mg-contact-page__fields">
        <div className="mg-contact-page__field"><label htmlFor={`${id}-name`}>YOUR NAME *</label><input id={`${id}-name`} name="name" type="text" autoComplete="name" required maxLength={100} autoFocus={autoFocus} placeholder="How should we address you?"/></div>
        <div className="mg-contact-page__field"><label htmlFor={`${id}-email`}>EMAIL ADDRESS *</label><input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com"/></div>
        <div className="mg-contact-page__field"><label htmlFor={`${id}-topic`}>WHAT'S ON YOUR MIND?</label><select id={`${id}-topic`} name="topic" defaultValue="General question"><option>General question</option><option>A car in the collection</option><option>Arranging a visit</option><option>A story or collaboration</option></select></div>
        <div className="mg-contact-page__field"><label htmlFor={`${id}-car`}>A PARTICULAR MACHINE? <span>OPTIONAL</span></label><select id={`${id}-car`} name="car" defaultValue={defaultCarId}><option value="">No particular car</option>{cars.map(car=><option key={car.id} value={car.id}>{car.year} {car.make} {car.model}</option>)}</select></div>
      </div>
      <div className="mg-contact-page__field mg-contact-page__message"><label htmlFor={`${id}-message`}>YOUR MESSAGE *</label><textarea id={`${id}-message`} name="message" required minLength={10} maxLength={2000} rows={6} placeholder="Tell us what you have in mind." aria-describedby={`${id}-help`}/><span id={`${id}-help`}>10–2,000 characters. Please leave out sensitive personal or payment information.</span></div>
    </fieldset>
    <p className="mg-contact-page__privacy">Read our <Link to="/privacy">Privacy Policy</Link> for information about your inquiry.</p>
    <button className="mg-contact-page__submit" type="submit" disabled={busy}>{busy?'SENDING INQUIRY...':'SEND INQUIRY'}<ArrowUpRight size={22} aria-hidden="true"/></button>
    <p id={`${id}-delivery`} className="mg-contact-page__delivery">Your message is submitted directly to the garage inbox.</p>
    {status&&<p className={`mg-contact-page__status mg-contact-page__status--${status.type}`} role={status.type==='error'?'alert':'status'} aria-live={status.type==='error'?'assertive':'polite'}>{status.message}</p>}
  </form>;
}
