import { useMemo, useState } from 'react';
import { Eye, ImagePlus, Trash2 } from 'lucide-react';
import type { AdminProps, MediaItem } from './adminState';
import { matches } from './adminState';
import { assetUrl } from '../lib/api';
import { Badge, Confirm, Dialog, Empty, SearchBox } from './AdminUI';
import GarageImage from '../components/common/GarageImage';

export default function MediaPanel({state,dispatch,notify,upload,mediaEnabled}:AdminProps) {
  const [file,setFile]=useState<File|null>(null);
  const [alt,setAlt]=useState('');
  const [query,setQuery]=useState('');
  const [preview,setPreview]=useState<MediaItem|null>(null);
  const [removing,setRemoving]=useState<MediaItem|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const localPreview=useMemo(()=>file?URL.createObjectURL(file):'', [file]);
  const media=state.media.filter(item=>matches(query,item.name,item.alt,item.origin));

  async function saveImage(){
    if(!file)return;
    setBusy(true);setError('');
    try{await upload(file,alt.trim());setFile(null);setAlt('');notify('Image uploaded to persistent MongoDB media storage.');}
    catch(error){setError(error instanceof Error?error.message:'Image upload failed.');}
    finally{setBusy(false);}
  }

  return <>
    <div className="mg-admin-section-top"><div><h2>Project image library</h2><p>Existing project assets and uploads stored in MongoDB GridFS.</p></div><label className="mg-admin-file-button"><ImagePlus size={16} aria-hidden="true"/>Choose image<input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" disabled={!mediaEnabled||busy} onChange={event=>{const selected=event.target.files?.[0]??null;setError('');setFile(selected);setAlt('');}}/></label></div>
    <p className="mg-admin-muted">Uploads are stored persistently in this project’s MongoDB database (8 MB maximum). Existing bundled images remain in the project’s media folder.</p>
    {!mediaEnabled&&<p className="mg-admin-warning">MongoDB media storage is unavailable. Start the backend with a working database connection before uploading.</p>}
    {file&&<div className="mg-admin-upload-preview"><GarageImage src={localPreview} alt={alt||'Selected image preview'}/><div><Badge>Local preview / not yet saved</Badge><h3>{file.name}</h3><label className="mg-admin-field">Image description *<input value={alt} maxLength={250} onChange={event=>setAlt(event.target.value)} required/></label><div className="mg-admin-row-actions"><button className="mg-admin-primary" type="button" disabled={!alt.trim()||busy||!mediaEnabled} onClick={()=>void saveImage()}>{busy?'Saving to MongoDB…':'Upload image'}</button><button type="button" disabled={busy} onClick={()=>{setFile(null);setAlt('');}}>Cancel</button></div></div></div>}
    {error&&<p className="mg-admin-error" role="alert">{error}</p>}
    <div className="mg-admin-toolbar"><SearchBox value={query} onChange={setQuery} label="Search media"/><Badge>{media.length} images</Badge></div>
    {!media.length?<Empty title="No images match.">Existing application assets and uploaded media appear here.</Empty>:<div className="mg-admin-media-grid">{media.map(item=><article className="mg-admin-media" key={item.id}><button type="button" className="mg-admin-media-image" aria-label={`Preview ${item.name}`} onClick={()=>setPreview(item)}><GarageImage src={assetUrl(item.src)} alt={item.alt}/><span><Eye size={20} aria-hidden="true"/></span></button><div><Badge>{item.origin}</Badge><h3>{item.name}</h3><p>{item.alt}</p>{item.references?.map(reference=><small key={reference}>{reference}</small>)}{item.origin==='MongoDB GridFS'&&<button type="button" disabled={Boolean(item.references?.length)} onClick={()=>setRemoving(item)} aria-label={`Delete image ${item.name}`}><Trash2 size={14} aria-hidden="true"/>Delete image</button>}</div></article>)}</div>}
    {preview&&<Dialog title={preview.name} onClose={()=>setPreview(null)}><figure className="mg-admin-media-full"><GarageImage src={assetUrl(preview.src)} alt={preview.alt}/><figcaption>{preview.alt} / {preview.origin}</figcaption></figure></Dialog>}
    {removing&&<Confirm title="Delete uploaded image?" description={`Remove ${removing.name} from MongoDB? Images referenced by published content cannot be deleted.`} onCancel={()=>setRemoving(null)} onConfirm={async()=>{await dispatch({type:'media/delete',id:removing.id});setRemoving(null);notify('Uploaded image deleted.');}}/>}
  </>;
}
