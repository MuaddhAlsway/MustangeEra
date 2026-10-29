import { useState } from 'react';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import type { AdminCar, AdminProps } from './adminState';
import { matches, price } from './adminState';
import { Badge, Confirm, Empty, RecordEditor, SearchBox } from './AdminUI';
import type { EditorField } from './AdminUI';
import { assetUrl } from '../lib/api';
import GarageImage from '../components/common/GarageImage';

export default function CarsPanel({ state, dispatch, notify }: AdminProps) {
  const [query,setQuery] = useState('');
  const [status,setStatus] = useState('All statuses');
  const [make,setMake] = useState('All marques');
  const [editing,setEditing] = useState<AdminCar | 'new' | null>(null);
  const [removing,setRemoving] = useState<AdminCar | null>(null);
  const [sort,setSort] = useState('Curated');
  const cars = state.cars.filter(car => matches(query,car.make,car.model,String(car.year),car.location) && (status === 'All statuses' || status === car.status) && (make === 'All marques' || car.make === make));
  if (sort === 'Price ascending') cars.sort((a,b) => a.price-b.price);
  if (sort === 'Newest first') cars.sort((a,b) => b.year-a.year);
  const fields: EditorField[] = [
    {name:'year',label:'Year',type:'number',required:true,min:1886,max:2100,step:'1'},
    {name:'make',label:'Make',required:true},{name:'model',label:'Model',required:true},
    {name:'price',label:'Asking price (USD)',type:'number',required:true,min:0,step:'0.01'},
    {name:'trim',label:'Configuration / trim',required:true},{name:'power',label:'Power',required:true},
    {name:'miles',label:'Mileage',required:true},{name:'color',label:'Exterior color',required:true},
    {name:'type',label:'Vehicle type',required:true},{name:'location',label:'Location',required:true},
    {name:'tag',label:'Inventory tag',required:true},
    {name:'status',label:'Publication status',type:'select',options:['Draft','Listed','Archived'].map(value=>({value,label:value}))},
    {name:'image',label:'Library image',type:'select',options:[{value:'',label:'No image selected'},...state.media.map(item=>({value:item.src,label:item.name})),...(editing&&editing!=='new'&&editing.image&&!state.media.some(item=>item.src===editing.image)?[{value:editing.image,label:'Current image (outside library)'}]:[])]},
    {name:'description',label:'Description',type:'textarea',required:true},
  ];
  const initial = editing && editing !== 'new' ? Object.fromEntries(Object.entries(editing).map(([key,value])=>[key,String(value)])) : {year:'1969',status:'Draft',image:state.media[0]?.src ?? ''};
  return <><div className="mg-admin-section-top"><div><h2>Inventory files</h2><p>Listed cars appear in the public collection. Drafts and archived cars stay private.</p></div><button className="mg-admin-primary" type="button" onClick={()=>setEditing('new')}><Plus size={16} aria-hidden="true" /> Add car</button></div><div className="mg-admin-toolbar"><SearchBox value={query} onChange={setQuery} label="Search cars" /><select aria-label="Car status" value={status} onChange={event=>setStatus(event.target.value)}>{['All statuses','Draft','Listed','Archived'].map(value=><option key={value}>{value}</option>)}</select><select aria-label="Car make" value={make} onChange={event=>setMake(event.target.value)}>{['All marques',...new Set(state.cars.map(car=>car.make))].map(value=><option key={value}>{value}</option>)}</select><select aria-label="Sort cars" value={sort} onChange={event=>setSort(event.target.value)}>{['Curated','Price ascending','Newest first'].map(value=><option key={value}>{value}</option>)}</select></div><p className="mg-admin-count" role="status">{cars.length} machines in view</p>{!cars.length ? <Empty title="No machines on this route.">Change the filters or add a car.</Empty> : <div className="mg-admin-table-wrap"><table><caption className="mg-admin-sr">Inventory</caption><thead><tr><th scope="col">Machine</th><th scope="col">Year / make</th><th scope="col">Price</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead><tbody>{cars.map(car=><tr key={car.id}><td><div className="mg-admin-machine">{car.image ? <GarageImage src={assetUrl(car.image)} alt="" /> : <span className="mg-admin-image-placeholder">MG</span>}<div><strong>{car.model}</strong><small>FILE / {String(car.id).padStart(3,'0')}</small></div></div></td><td>{car.year}<br /><small>{car.make}</small></td><td>{price(car.price)}</td><td><Badge>{car.status}</Badge></td><td><div className="mg-admin-row-actions"><button type="button" aria-label={`Edit ${car.model}`} onClick={()=>setEditing(car)}><Edit3 size={15} aria-hidden="true" /> Edit</button><button type="button" aria-label={`Delete ${car.model}`} onClick={()=>setRemoving(car)}><Trash2 size={15} aria-hidden="true" /></button></div></td></tr>)}</tbody></table></div>}
    {editing && <RecordEditor title={editing==='new'?'Add a machine':'Edit machine'} initial={initial} fields={fields} onClose={()=>setEditing(null)} onSave={async values=>{
      const year=Number(values.year), amount=Number(values.price);
      if (!Number.isInteger(year) || year<1886 || year>2100 || !Number.isFinite(amount) || amount<0) return 'Enter a valid year and non-negative price.';
      if (!/^[\d,]+(?:\.\d+)?$/.test(values.miles)) return 'Mileage should contain numbers, commas, or a decimal point.';
      await dispatch({type:'car/save',car:{id:editing==='new'?Math.max(0,...state.cars.map(car=>car.id))+1:editing.id,year,price:amount,make:values.make,model:values.model,trim:values.trim,power:values.power,miles:values.miles,color:values.color,type:values.type,location:values.location,tag:values.tag,image:values.image,description:values.description,status:values.status as AdminCar['status']}});
      setEditing(null);notify('Car saved to the garage database.');
    }} />}
    {removing && <Confirm title="Delete car?" description={`Remove ${removing.model} from the garage database?`} onCancel={()=>setRemoving(null)} onConfirm={async()=>{await dispatch({type:'car/delete',id:removing.id});setRemoving(null);notify('Car deleted.');}} />}
  </>;
}

