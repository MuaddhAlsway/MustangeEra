import { useAuth } from '@clerk/react';
import { useCallback, useEffect, useState } from 'react';
import { allPages, api, API_URL } from '../lib/api';
import type { AdminState, AdminAction, Reply } from './adminState';
const initial:AdminState={cars:[],articles:[],media:[],subscribers:[],inquiries:[],pages:[],activity:[],users:[]};
const defaults=['home','inventory','about','journal','contact','privacy','terms'].map(id=>({id,title:id[0].toUpperCase()+id.slice(1),intro:'Add approved page introduction.',status:'Draft' as const,hero:{eyebrow:'',title:'',accent:'',description:'',image:'',imageAlt:''},sections:[{id:'intro',heading:'Introduction',body:'Add approved page copy before publishing.',image:'',imageAlt:''}]}));
export default function useAdminData(){const {getToken}=useAuth();const [state,setState]=useState(initial);const [loading,setLoading]=useState(true);const [error,setError]=useState('');const [capabilities,setCapabilities]=useState({mediaEnabled:false,emailEnabled:false});
  const reload=useCallback(async()=>{const token=await getToken();const [cars,articles,media,subscribers,inquiries,pages,activity,users,config]=await Promise.all([allPages<AdminState['cars'][number]>('/admin/cars',token),allPages<AdminState['articles'][number]>('/admin/articles',token),allPages<AdminState['media'][number]>('/admin/media',token),allPages<AdminState['subscribers'][number]>('/admin/subscribers',token),allPages<AdminState['inquiries'][number]>('/admin/inquiries',token),allPages<AdminState['pages'][number]>('/admin/pages',token),allPages<AdminState['activity'][number]>('/admin/activity',token),allPages<NonNullable<AdminState['users']>[number]>('/admin/users',token),api<typeof capabilities>('/admin/me',{},token)]);setState({cars,articles,media,subscribers,inquiries,pages:defaults.map(item=>pages.find(p=>p.id===item.id)??item),activity,users});setCapabilities(config);setError('');},[getToken]);
  useEffect(()=>{let active=true;Promise.resolve().then(reload).catch(error=>{if(active)setError(error.message);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[reload]);
  useEffect(()=>{const sync=()=>{void reload().catch(()=>undefined);};window.addEventListener('garage:account-synced',sync);return()=>window.removeEventListener('garage:account-synced',sync);},[reload]);
 async function request(path:string,method:string,data?:unknown){return api(path,{method,...(data?{body:JSON.stringify(data)}:{})},await getToken());}
 async function dispatch(action:AdminAction){try{switch(action.type){
  case 'car/save':{const exists=state.cars.some(c=>c.id===action.car.id);await request(`/admin/cars${exists?`/${action.car.id}`:''}`,exists?'PUT':'POST',action.car);break;}
  case 'car/delete':await request(`/admin/cars/${action.id}`,'DELETE');break;
  case 'article/save':{const exists=state.articles.some(a=>a.id===action.article.id);await request(`/admin/articles${exists?`/${action.article.id}`:''}`,exists?'PUT':'POST',action.article);break;}
  case 'article/delete':await request(`/admin/articles/${action.id}`,'DELETE');break;
  case 'page/save':await request(`/admin/pages/${action.page.id}`,'PUT',action.page);break;
  case 'media/delete':await request(`/admin/media/${action.id}`,'DELETE');break;
  case 'subscriber/status':await request(`/admin/subscribers/${action.id}`,'PATCH',{status:action.status});break;
  case 'subscriber/delete':await request(`/admin/subscribers/${action.id}`,'DELETE');break;
  case 'inquiry/read':await request(`/admin/inquiries/${action.id}`,'PATCH',{status:'Read'});break;
  case 'inquiry/status':await request(`/admin/inquiries/${action.id}`,'PATCH',{status:action.status});break;
  case 'inquiry/draft':case 'inquiry/reply':{const draft=await api<Reply>(`/admin/inquiries/${action.id}/drafts`,{method:'POST',body:JSON.stringify(action.reply)},await getToken());if(action.type==='inquiry/reply')await request(`/admin/replies/${draft.id}/send`,'POST');break;}
 }await reload();window.dispatchEvent(new Event('garage:content-changed'));}catch(error){await reload().catch(()=>undefined);throw error;}}
  async function upload(file:File,alt:string){const form=new FormData();form.set('image',file);form.set('alt',alt);await api('/admin/media',{method:'POST',body:form},await getToken());await reload();}
  async function exportSubscribers(q:string){const token=await getToken();const response=await fetch(`${API_URL}/admin/subscribers/export?q=${encodeURIComponent(q)}`,{headers:{Authorization:`Bearer ${token}`}});if(!response.ok)throw new Error('Export failed. Please try again.');const blob=await response.blob();const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='mustang-garage-subscribers.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
   return {state,loading,error,reload,dispatch,upload,exportSubscribers,...capabilities};
}
