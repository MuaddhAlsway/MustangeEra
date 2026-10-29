import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Search, X, AlertTriangle } from 'lucide-react';

export function SearchBox({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) {
  return <label className="mg-admin-search"><Search size={17} aria-hidden="true" /><input type="search" aria-label={label} placeholder={label} value={value} onChange={event => onChange(event.target.value)} /></label>;
}

export function Badge({ children }: { children: ReactNode }) { return <span className="mg-admin-badge">{children}</span>; }
export function Empty({ title, children }: { title: string; children: ReactNode }) { return <div className="mg-admin-empty"><span>THE GARAGE DESK / NO RECORDS</span><h3>{title}</h3><p>{children}</p></div>; }

export function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previous = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = previous; };
  }, []);
  return <dialog ref={ref} className="mg-admin-dialog" aria-labelledby={titleId} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}><div className="mg-admin-dialog-head"><div><span>MUSTANG GARAGE / EDITOR</span><h2 id={titleId}>{title}</h2></div><button type="button" className="mg-admin-icon" aria-label="Close dialog" onClick={onClose}><X size={19} aria-hidden="true" /></button></div>{children}</dialog>;
}

export function Confirm({ title, description, onCancel, onConfirm }: { title: string; description: string; onCancel: () => void; onConfirm: () => void | Promise<void> }) {
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  async function confirm(){setBusy(true);try{await onConfirm();}catch(error){setError(error instanceof Error?error.message:'Action failed.');}finally{setBusy(false);}}
  return <Dialog title={title} onClose={()=>{if(!busy)onCancel();}}> <div className="mg-admin-confirm"><AlertTriangle size={26} aria-hidden="true" /><p>{description}</p><p className="mg-admin-muted">This changes saved server records. Review the action before confirming.</p></div>{error&&<p role="alert" className="mg-admin-error">{error}</p>}<div className="mg-admin-dialog-actions"><button type="button" disabled={busy} onClick={onCancel} autoFocus>Cancel</button><button type="button" className="mg-admin-danger" disabled={busy} onClick={()=>void confirm()}>{busy?'Working…':'Confirm action'}</button></div></Dialog>;
}

export type EditorField = { name: string; label: string; type?: 'text' | 'email' | 'number' | 'textarea' | 'select'; required?: boolean; min?: number; max?: number; step?: string; options?: { value: string; label: string }[] };

export function RecordEditor({ title, initial, fields, onClose, onSave }: { title: string; initial: Record<string, string>; fields: EditorField[]; onClose: () => void; onSave: (values: Record<string, string>) => string | undefined | Promise<string | undefined> }) {
  const [error, setError] = useState('');
  const [busy,setBusy]=useState(false);
  const prefix = useId();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(fields.map(field => [field.name, String(data.get(field.name) ?? '').trim()]));
    const missing = fields.find(field => field.required && !values[field.name]);
    if (missing) { setError(`Enter ${missing.label.toLowerCase()}.`); return; }
    setBusy(true);try{const result=await onSave(values);if(result)setError(result);}catch(error){setError(error instanceof Error?error.message:'Save failed. Your entries are preserved.');}finally{setBusy(false);}
  }
  return <Dialog title={title} onClose={onClose}><form onSubmit={submit} className="mg-admin-editor"><p className="mg-admin-muted">Required fields are marked *. Changes are saved to the server. Listed cars and published stories are public.</p><div className="mg-admin-form-grid">{fields.map(field => <div className={`mg-admin-field${field.type === 'textarea' ? ' mg-admin-field--wide' : ''}`} key={field.name}><label htmlFor={`${prefix}-${field.name}`}>{field.label}{field.required ? ' *' : ''}</label>{field.type === 'textarea' ? <textarea id={`${prefix}-${field.name}`} name={field.name} rows={5} maxLength={30000} defaultValue={initial[field.name] ?? ''} required={field.required} /> : field.type === 'select' ? <select id={`${prefix}-${field.name}`} name={field.name} defaultValue={initial[field.name] ?? ''} required={field.required}>{field.options?.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : <input id={`${prefix}-${field.name}`} name={field.name} type={field.type ?? 'text'} defaultValue={initial[field.name] ?? ''} required={field.required} min={field.min} max={field.max} step={field.step} maxLength={500} />}</div>)}</div>{error && <p className="mg-admin-error" role="alert">{error}</p>}<div className="mg-admin-dialog-actions"><button type="button" onClick={onClose}>Cancel</button><button type="submit" className="mg-admin-primary" disabled={busy}>{busy?'Saving…':'Save changes'}</button></div></form></Dialog>;
}
