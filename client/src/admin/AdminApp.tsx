import { useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { ArrowUpRight, BookOpen, CarFront, FileText, Images, LayoutDashboard, Mail, Menu, Users, X } from 'lucide-react';
import useAdminData from './useAdminData';
import { SignOutControl } from '../lib/Auth';
import GarageLoading from '../components/common/GarageLoading';
import Dashboard from './Dashboard';
import CarsPanel from './CarsPanel';
import PagesPanel from './PagesPanel';
import JournalPanel from './JournalPanel';
import MediaPanel from './MediaPanel';
import MailingPanel from './MailingPanel';
import InboxPanel from './InboxPanel';
import AccountsPanel from './AccountsPanel';
import './Admin.css';

const links=[
  {to:'/admin',label:'Overview',Icon:LayoutDashboard},
  {to:'/admin/cars',label:'Cars',Icon:CarFront},
  {to:'/admin/pages',label:'Pages',Icon:FileText},
  {to:'/admin/journal',label:'Journal',Icon:BookOpen},
  {to:'/admin/media',label:'Media',Icon:Images},
  {to:'/admin/mailing',label:'Mailing list',Icon:Users},
  {to:'/admin/inbox',label:'Inbox',Icon:Mail},
  {to:'/admin/users',label:'Accounts',Icon:Users},
];

export default function AdminApp() {
  const data=useAdminData();
  const {state}=data;
  const [menu,setMenu]=useState(false);
  const [notice,setNotice]=useState('');
  const {pathname}=useLocation();
  const title=links.find(item=>item.to===pathname.replace(/\/$/,''))?.label??'Overview';
  const shared={...data,notify:(message:string)=>setNotice(message)};
  return <div className="mg-admin"><aside className={`mg-admin-sidebar${menu?' is-open':''}`}><Link to="/admin" className="mg-admin-brand" onClick={()=>setMenu(false)}><strong>MUSTANG</strong><span>GARAGE / THE CONTROL DESK</span></Link><p className="mg-admin-sidebar-label">AUTHENTICATED WORKSPACE</p><nav aria-label="Admin navigation" id="admin-navigation">{links.map(({to,label,Icon})=><NavLink key={to} to={to} end={to==='/admin'} onClick={()=>{setMenu(false);setNotice('');}}><Icon size={17} aria-hidden="true" /><span>{label}</span>{label==='Inbox'&&<small>{state.inquiries.filter(item=>item.status==='Unread').length}</small>}</NavLink>)}</nav><div className="mg-admin-sidebar-note"><span>LIVE WORKSPACE</span><p>Changes are saved to the garage database. Publishing makes content visible on the public site.</p><Link to="/">Back to public site <ArrowUpRight size={15} aria-hidden="true" /></Link></div></aside><div className="mg-admin-main"><header className="mg-admin-header"><button className="mg-admin-menu" type="button" aria-label={menu?'Close admin menu':'Open admin menu'} aria-expanded={menu} aria-controls="admin-navigation" onClick={()=>setMenu(value=>!value)}>{menu?<X size={20} aria-hidden="true" />:<Menu size={20} aria-hidden="true" />}</button><div><p>MUSTANG GARAGE / ADMIN</p><h1>{title}</h1></div><Link to="/">View site <ArrowUpRight size={16} aria-hidden="true" /></Link></header><div className="mg-admin-demo-banner"><strong>EDITORIAL WORKSPACE</strong><span>Save drafts before publishing. Email is sent only when you explicitly select Send.</span><SignOutControl className="mg-signout--admin"/></div><main className="mg-admin-content" id="admin-content">{notice&&<div className="mg-admin-notice" role="status" aria-live="polite"><span>{notice}</span><button type="button" aria-label="Dismiss notification" onClick={()=>setNotice('')}><X size={16} aria-hidden="true" /></button></div>}{data.loading?<GarageLoading/>:data.error?<p role="alert" className="mg-admin-error">{data.error} <button type="button" onClick={()=>window.location.reload()}>Retry</button></p>:<Routes><Route index element={<Dashboard {...shared} />} /><Route path="cars" element={<CarsPanel {...shared} />} /><Route path="pages" element={<PagesPanel {...shared} />} /><Route path="journal" element={<JournalPanel {...shared} />} /><Route path="media" element={<MediaPanel {...shared} />} /><Route path="mailing" element={<MailingPanel {...shared} />} /><Route path="inbox" element={<InboxPanel {...shared} />} /><Route path="users" element={<AccountsPanel {...shared} />} /><Route path="*" element={<div className="mg-admin-empty"><h2>This desk is not in the workspace.</h2><Link to="/admin">Return to overview</Link></div>} /></Routes>}</main><footer className="mg-admin-footer">MG / EDITORIAL WORKSPACE <span>PERSISTENT CONTENT / AUTHORIZED ACCESS</span></footer></div></div>;
}
