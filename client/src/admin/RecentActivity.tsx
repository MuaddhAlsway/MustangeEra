import { History, ArrowDownLeft } from 'lucide-react';
import type { Activity } from './adminState';
import './RecentActivity.css';

function timestamp(value:string) {
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return null;
  return {
    iso:date.toISOString(),
    day:new Intl.DateTimeFormat(undefined,{day:'2-digit',month:'short',year:'numeric'}).format(date),
    clock:new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit'}).format(date),
  };
}

export default function RecentActivity({items}:{items:Activity[]}) {
  return <section className="mg-admin-panel mg-recent-activity" aria-labelledby="mg-recent-activity-title">
    <header className="mg-recent-activity__header">
      <div><p className="mg-recent-activity__eyebrow">THE GARAGE / CHANGELOG</p><h2 id="mg-recent-activity-title">Recent <em>activity.</em></h2></div>
      <span className="mg-recent-activity__mark" aria-hidden="true"><History size={23} strokeWidth={1.3}/></span>
    </header>
    <div className="mg-recent-activity__intro"><p>A record of the work behind the garage.</p><span>{String(items.length).padStart(2,'0')} {items.length===1?'ENTRY':'ENTRIES'}</span></div>
    {items.length ? <div className="mg-recent-activity__scroll" tabIndex={0} role="region" aria-label="Recorded admin activity"><ol className="mg-recent-activity__list">{items.map((item,index)=>{
      const time=timestamp(item.time);
      return <li className="mg-recent-activity__entry" key={item.id}>
        <span className="mg-recent-activity__node" aria-hidden="true"><ArrowDownLeft size={13} strokeWidth={1.5}/></span>
        <div className="mg-recent-activity__record"><span className="mg-recent-activity__number">RECORD / {String(index+1).padStart(2,'0')}</span><p>{item.text}</p></div>
        {time?<time dateTime={time.iso} className="mg-recent-activity__time"><span>{time.day}</span><strong>{time.clock}</strong></time>:<span className="mg-recent-activity__time">Time unavailable</span>}
      </li>;
    })}</ol></div>:<div className="mg-recent-activity__empty"><History size={28} strokeWidth={1.2} aria-hidden="true"/><h3>The next chapter starts here.</h3><p>Saved admin actions will appear in this activity record.</p></div>}
    <footer className="mg-recent-activity__footer"><span>THE EDITORIAL RECORD</span><span>MG / CONTROL DESK</span></footer>
  </section>;
}
