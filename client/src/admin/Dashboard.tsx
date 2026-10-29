import { Link } from 'react-router-dom';
import { ArrowUpRight, CarFront, BookOpen, Mail, Users } from 'lucide-react';
import type { AdminProps } from './adminState';
import RecentActivity from './RecentActivity';

export default function Dashboard({ state }: AdminProps) {
  const cards = [
    { title: 'Machines on file', value: state.cars.length, note: `${state.cars.filter(car => car.status === 'Listed').length} listed`, to: '/admin/cars', Icon: CarFront },
    { title: 'Journal stories', value: state.articles.length, note: `${state.articles.filter(article => article.status === 'Draft').length} editorial drafts`, to: '/admin/journal', Icon: BookOpen },
    { title: 'Mailing list', value: state.subscribers.length, note: `${state.subscribers.filter(subscriber => subscriber.status === 'Subscribed').length} subscribed`, to: '/admin/mailing', Icon: Users },
    { title: 'Unread inquiries', value: state.inquiries.filter(inquiry => inquiry.status === 'Unread').length, note: 'Incoming contact messages', to: '/admin/inbox', Icon: Mail },
  ];
  return <><div className="mg-admin-welcome"><div><p className="mg-admin-kicker">THE GARAGE / CONTROL DESK</p><h2>Keep the story<br /><em>moving.</em></h2><p>An editorial workspace for the machines, the pages, and the conversations around them.</p></div><div className="mg-admin-welcome-stamp">MG<span>LIVE / 01</span></div></div><div className="mg-admin-stats">{cards.map(({title,value,note,to,Icon}) => <Link to={to} key={title}><div><Icon size={20} aria-hidden="true" /><ArrowUpRight size={17} aria-hidden="true" /></div><span>{title}</span><strong>{String(value).padStart(2,'0')}</strong><p>{note}</p></Link>)}</div><div className="mg-admin-two-col"><RecentActivity items={state.activity}/><section className="mg-admin-panel"><p className="mg-admin-kicker">PUBLISH WITH INTENTION</p><h2>A working desk.<br />A lasting record.</h2><p className="mg-admin-muted">Manage database records, review drafts, and publish approved content. Reply drafts are stored in the inquiry conversation. Only the explicit Send action contacts the email provider.</p><div className="mg-admin-quick-links"><Link to="/admin/cars">Open the inventory <ArrowUpRight size={17} aria-hidden="true" /></Link><Link to="/admin/inbox">Open the inbox <ArrowUpRight size={17} aria-hidden="true" /></Link><Link to="/admin/pages">Edit page content <ArrowUpRight size={17} aria-hidden="true" /></Link></div></section></div></>;
}
