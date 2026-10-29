import { useClerk, useUser } from '@clerk/react';
import { ArrowUpRight, BookOpen, Heart, History, Mail, Settings, ShieldCheck, Trash2, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Car } from '../../features/inventory/types';
import useRecentlyViewedCars from '../../features/inventory/useRecentlyViewedCars';
import useAdminAccess from '../../lib/useAdminAccess';
import { SignOutControl } from '../../lib/Auth';
import '../../styles/UserDashboard.css';

type Props={cars:Car[];loading:boolean;savedIds:number[];onRemove:(id:number)=>void};
const price=(value:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);

export default function UserDashboard({cars,loading,savedIds,onRemove}:Props) {
  const {user}=useUser();
  const {openUserProfile}=useClerk();
  const isAdmin=useAdminAccess();
  const recent=useRecentlyViewedCars(cars);
  const savedCars=savedIds.map(id=>cars.find(car=>car.id===id)).filter((car):car is Car=>Boolean(car));
  const email=user?.primaryEmailAddress;
  const name=user?.firstName||user?.fullName||'collector';
  return <main className="mg-account" aria-labelledby="mg-account-title">
    <div className="mg-account__masthead"><span>MUSTANG GARAGE / YOUR PERSONAL FILE</span><span>THE COLLECTOR'S DESK</span></div>
    <header className="mg-account__header"><div><p className="mg-account__eyebrow">A PLACE FOR YOUR NEXT CHAPTER</p><h1 id="mg-account-title">Your garage.<br/><em>Welcome back, {name}.</em></h1><p>The machines you save. The stories you return to. Your own corner of the garage.</p></div><div className="mg-account__header-actions"><button type="button" onClick={()=>openUserProfile()}><Settings size={16} aria-hidden="true"/>Manage account</button><SignOutControl/></div></header>
    <div className="mg-account__layout">
      <aside className="mg-account__profile" aria-labelledby="mg-account-profile-title"><span className="mg-account__profile-mark" aria-hidden="true"><UserRound size={28} strokeWidth={1.2}/></span><p className="mg-account__eyebrow">THE PERSON BEHIND THE DRIVE</p><h2 id="mg-account-profile-title">{user?.fullName||user?.username||'Your account'}</h2><p className="mg-account__email">{email?.emailAddress||'No primary email address'}</p>{email&&<span className="mg-account__verification">{email.verification.status==='verified'?'Email verified':'Email verification pending'}</span>}<dl><div><dt>MEMBER SINCE</dt><dd>{user?.createdAt?new Intl.DateTimeFormat('en',{month:'long',year:'numeric'}).format(user.createdAt):'Not available'}</dd></div><div><dt>YOUR WISHLIST</dt><dd>{loading?'Loading...':`${savedCars.length} ${savedCars.length===1?'machine':'machines'}`}</dd></div></dl><p className="mg-account__session-note">Wishlist selections are kept for this browsing session.</p><button type="button" className="mg-account__profile-edit" onClick={()=>openUserProfile()}>Edit profile &amp; security<ArrowUpRight size={16} aria-hidden="true"/></button>{isAdmin&&<Link className="mg-account__admin" to="/admin"><ShieldCheck size={17} aria-hidden="true"/>Open admin workspace<ArrowUpRight size={16} aria-hidden="true"/></Link>}</aside>
      <div className="mg-account__content">
        <section aria-labelledby="mg-account-wishlist-title"><div className="mg-account__section-head"><div><p className="mg-account__eyebrow">01 / THE ONES THAT STAY WITH YOU</p><h2 id="mg-account-wishlist-title">Your <em>wishlist.</em></h2></div>{savedCars.length>0&&<Link to="/saved">View all<ArrowUpRight size={16} aria-hidden="true"/></Link>}</div>
          {loading?<p className="mg-account__empty" role="status">Loading your saved machines...</p>:savedCars.length?<div className="mg-account__cars">{savedCars.map(car=><article className="mg-account__car" key={car.id}><Link className="mg-account__car-image" to={`/inventory/${car.id}`}><img src={car.image} alt={`${car.year} ${car.make} ${car.model}`} loading="lazy"/><span>{car.year} / {car.make}</span></Link><div className="mg-account__car-copy"><h3><Link to={`/inventory/${car.id}`}>{car.model}</Link></h3><p>{car.trim}</p><strong>{price(car.price)}</strong><div><Link to={`/inventory/${car.id}`}>Machine file<ArrowUpRight size={15} aria-hidden="true"/></Link><button type="button" onClick={()=>onRemove(car.id)} aria-label={`Remove ${car.model} from your wishlist`}><Trash2 size={15} aria-hidden="true"/>Remove</button></div></div></article>)}</div>:<div className="mg-account__empty"><Heart size={27} strokeWidth={1.2} aria-hidden="true"/><h3>Leave room for a favourite.</h3><p>Save a machine from the collection and it will appear here.</p><Link to="/inventory">Explore the collection<ArrowUpRight size={16} aria-hidden="true"/></Link></div>}
        </section>
        <section className="mg-account__recent" aria-labelledby="mg-account-recent-title"><div className="mg-account__section-head"><div><p className="mg-account__eyebrow">02 / A SECOND LOOK</p><h2 id="mg-account-recent-title">Recently <em>viewed.</em></h2></div><History size={20} strokeWidth={1.3} aria-hidden="true"/></div>{loading?<p role="status">Loading browsing history...</p>:recent.length?<div className="mg-account__recent-list">{recent.map(car=><Link to={`/inventory/${car.id}`} key={car.id}><img src={car.image} alt="" loading="lazy"/><div><span>{car.year} / {car.make}</span><h3>{car.model}</h3></div><ArrowUpRight size={18} aria-hidden="true"/></Link>)}</div>:<p className="mg-account__history-empty">Open a machine file in the inventory to start your browsing history.</p>}</section>
        <section className="mg-account__next" aria-label="Explore the garage"><Link to="/journal"><BookOpen size={20} strokeWidth={1.3} aria-hidden="true"/><div><span>THE GARAGE JOURNAL</span><h3>A story for the road.</h3></div><ArrowUpRight size={18} aria-hidden="true"/></Link><Link to="/contact"><Mail size={20} strokeWidth={1.3} aria-hidden="true"/><div><span>START A CONVERSATION</span><h3>Speak with the garage.</h3></div><ArrowUpRight size={18} aria-hidden="true"/></Link></section>
      </div>
    </div>
  </main>;
}
