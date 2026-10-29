import { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import type { AdminProps, Article } from './adminState';
import { matches, uid } from './adminState';
import { Badge, Confirm, Empty, RecordEditor, SearchBox } from './AdminUI';
import type { EditorField } from './AdminUI';
import { assetUrl } from '../lib/api';

export default function JournalPanel({ state, dispatch, notify }: AdminProps) {
  const [query,setQuery]=useState('');
  const [status,setStatus]=useState('All statuses');
  const [editing,setEditing]=useState<Article|'new'|null>(null);
  const [removing,setRemoving]=useState<Article|null>(null);
  const articles=state.articles.filter(article=>matches(query,article.title,article.category,article.slug)&&(status==='All statuses'||status===article.status));
  const fields: EditorField[]=[{name:'title',label:'Article title',required:true},{name:'slug',label:'Slug (lowercase words separated by hyphens)',required:true},{name:'category',label:'Category',required:true},{name:'status',label:'Editorial status',type:'select',options:['Draft','Published'].map(value=>({value,label:value}))},{name:'image',label:'Cover image',type:'select',options:[{value:'',label:'No image selected'},...state.media.map(item=>({value:item.src,label:item.name})),...(editing&&editing!=='new'&&editing.image&&!state.media.some(item=>item.src===editing.image)?[{value:editing.image,label:'Current image (outside library)'}]:[])]},{name:'excerpt',label:'Excerpt',type:'textarea',required:true},{name:'body',label:'Article body (plain text)',type:'textarea',required:true}];
  const initial=editing&&editing!=='new'?Object.fromEntries(Object.entries(editing)):{status:'Draft',image:state.media[0]?.src??''};
  return <><div className="mg-admin-section-top"><div><h2>The editorial desk</h2><p>Published articles appear in the public journal. Drafts stay private.</p></div><button type="button" className="mg-admin-primary" onClick={()=>setEditing('new')}><Plus size={16} aria-hidden="true" /> Add article</button></div><div className="mg-admin-toolbar"><SearchBox value={query} onChange={setQuery} label="Search articles" /><select aria-label="Article status" value={status} onChange={event=>setStatus(event.target.value)}>{['All statuses','Draft','Published'].map(value=><option key={value}>{value}</option>)}</select></div>{!articles.length?<Empty title="No stories on the desk.">Adjust the search or add a article.</Empty>:<div className="mg-admin-article-grid">{articles.map(article=><article className="mg-admin-panel" key={article.id}>{article.image?<img src={assetUrl(article.image)} alt="" className="mg-admin-cover" />:<div className="mg-admin-cover mg-admin-image-placeholder">NO COVER</div>}<div className="mg-admin-panel-heading"><span className="mg-admin-kicker">{article.category}</span><Badge>{article.status}</Badge></div><h3>{article.title}</h3><p className="mg-admin-muted">{article.excerpt}</p><p className="mg-admin-slug">/journal/{article.slug}</p><div className="mg-admin-row-actions"><button type="button" onClick={()=>setEditing(article)}><Edit3 size={15} aria-hidden="true" /> Edit article</button><button type="button" aria-label={`Delete article ${article.title}`} onClick={()=>setRemoving(article)}><Trash2 size={15} aria-hidden="true" /></button></div></article>)}</div>}
    {editing&&<RecordEditor title={editing==='new'?'Add a article':'Edit article'} initial={initial} fields={fields} onClose={()=>setEditing(null)} onSave={async values=>{
      if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug))return 'Use lowercase letters, numbers, and single hyphens for the slug.';
      if(state.articles.some(article=>article.slug===values.slug&&(editing==='new'||article.id!==editing.id)))return 'That slug already exists in this journal.';
      await dispatch({type:'article/save',article:{id:editing==='new'?uid():editing.id,title:values.title,slug:values.slug,category:values.category,excerpt:values.excerpt,body:values.body,image:values.image,status:values.status as Article['status']}});setEditing(null);notify('Article saved.');
    }} />}
    {removing&&<Confirm title="Delete article?" description={`Remove “${removing.title}” from the database?`} onCancel={()=>setRemoving(null)} onConfirm={async()=>{await dispatch({type:'article/delete',id:removing.id});setRemoving(null);notify('Article deleted.');}} />}
  </>;
}

