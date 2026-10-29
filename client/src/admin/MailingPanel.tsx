import { useState } from 'react';
import { Download } from 'lucide-react';
import type { AdminProps, Subscriber } from './adminState';
import { matches } from './adminState';
import { Badge, Confirm, Empty, SearchBox } from './AdminUI';

export default function MailingPanel({state,dispatch,notify,exportSubscribers}:AdminProps) {
  const [error,setError]=useState('');
  const [removing,setRemoving]=useState<Subscriber|null>(null);
  const [query,setQuery]=useState('');
  const [status,setStatus]=useState('All statuses');
  const [pending,setPending]=useState<{subscriber:Subscriber;status:Subscriber['status']}|null>(null);
  const rows=state.subscribers.filter(row=>matches(query,row.name,row.email)&&(status==='All statuses'||status===row.status));
  async function exportDemo() {
    try{await exportSubscribers(query);notify('Matching subscriber records exported.');}catch(error){setError(error instanceof Error?error.message:'Export failed.');}
  }
  return <><div className="mg-admin-section-top"><div><h2>The dispatch list</h2><p>Subscription records with consent captured by the public form.</p></div><button className="mg-admin-primary" type="button" disabled={!rows.length} onClick={exportDemo}><Download size={16} aria-hidden="true" /> Export matching CSV</button></div><div className="mg-admin-toolbar"><SearchBox value={query} onChange={setQuery} label="Search subscribers" /><select aria-label="Subscriber status filter" value={status} onChange={event=>setStatus(event.target.value)}>{['All statuses','Subscribed','Unsubscribed','Bounced'].map(value=><option key={value}>{value}</option>)}</select></div><p className="mg-admin-count" role="status">{rows.length} subscribers in view</p>{!rows.length?<Empty title="No subscribers match.">Try another name, email, or status.</Empty>:<div className="mg-admin-table-wrap"><table><caption className="mg-admin-sr">Mailing list</caption><thead><tr><th scope="col">Name</th><th scope="col">Email</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead><tbody>{rows.map(row=><tr key={row.id}><td>{row.name}</td><td>{row.email}</td><td><Badge>{row.status}</Badge></td><td><select aria-label={`Change status for ${row.name}`} value={row.status} onChange={event=>setPending({subscriber:row,status:event.target.value as Subscriber['status']})}>{[...(row.status==='Subscribed'?['Subscribed']:[]),'Unsubscribed','Bounced'].map(value=><option key={value}>{value}</option>)}</select><button type="button" onClick={()=>setRemoving(row)}>Remove</button><small>Consent: {row.consent?.version??'Not provided'}</small></td></tr>)}</tbody></table></div>}
    {pending&&<Confirm title="Change subscriber status?" description={`Set ${pending.subscriber.email} to ${pending.status}? `} onCancel={()=>setPending(null)} onConfirm={async()=>{await dispatch({type:'subscriber/status',id:pending.subscriber.id,status:pending.status});setPending(null);notify('Subscription status updated.');}} />}
  {error&&<p role="alert" className="mg-admin-error">{error}</p>}{removing&&<Confirm title="Remove subscriber?" description={`Delete the stored record for ${removing.email}?`} onCancel={()=>setRemoving(null)} onConfirm={async()=>{await dispatch({type:'subscriber/delete',id:removing.id});setRemoving(null);notify('Subscriber removed.');}}/>}</>;
}
