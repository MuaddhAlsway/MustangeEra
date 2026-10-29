import type { Car } from '../features/inventory/types';
export type AdminCar=Car&{status:'Listed'|'Draft'|'Archived'};
export type Article={id:string;title:string;slug:string;category:string;excerpt:string;body:string;image:string;status:'Draft'|'Published'};
export type MediaItem={id:string;name:string;src:string;alt:string;origin:string;references?:string[]};
export type Subscriber={id:string;name:string;email:string;status:'Subscribed'|'Unsubscribed'|'Bounced';consent?:{version:string;at:string}};
export type Reply={id?:string;recipient:string;subject:string;message:string;status?:string;sentAt?:string;providerId?:string;error?:string};
export type Inquiry={id:string;name:string;email:string;subject:string;message:string;status:'Unread'|'Read'|'Archived'|'Replied';received:string;reply?:Reply;replies?:Reply[]};
export type HeroSlideContent={image:string;imageAlt?:string;issue:string;label:string;kicker:string;title:string;accent:string;description:string;year:string;model:string};
export type PageContent={id:string;title:string;intro:string;status:'Draft'|'Published';hero?:{eyebrow?:string;title?:string;accent?:string;description?:string;image?:string;imageAlt?:string;slides?:HeroSlideContent[]};sections:{id:string;heading:string;body:string;image?:string;imageAlt?:string}[]};
export type Activity={id:string;text:string;time:string};
export type AdminState={cars:AdminCar[];articles:Article[];media:MediaItem[];subscribers:Subscriber[];inquiries:Inquiry[];pages:PageContent[];activity:Activity[];users?:{id:string;email:string;name?:string;role:string;lastLoginAt?:string}[]};
export type AdminAction=
 |{type:'car/save';car:AdminCar}|{type:'car/delete';id:number}
 |{type:'article/save';article:Article}|{type:'article/delete';id:string}
 |{type:'page/save';page:PageContent}|{type:'media/delete';id:string}
 |{type:'subscriber/status';id:string;status:Subscriber['status']}|{type:'subscriber/delete';id:string}
 |{type:'inquiry/read';id:string}|{type:'inquiry/status';id:string;status:'Read'|'Unread'|'Archived'}
 |{type:'inquiry/draft'|'inquiry/reply';id:string;reply:Reply};
export type AdminProps={state:AdminState;dispatch:(action:AdminAction)=>Promise<void>;notify:(message:string)=>void;mediaEnabled:boolean;emailEnabled:boolean;upload:(file:File,alt:string)=>Promise<void>;exportSubscribers:(q:string)=>Promise<void>};
export const uid=()=>crypto.randomUUID();
export const price=(amount:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(amount);
export const matches=(query:string,...values:string[])=>values.join(' ').toLowerCase().includes(query.trim().toLowerCase());
