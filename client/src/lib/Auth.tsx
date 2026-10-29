import { ClerkProvider, RedirectToSignIn, SignIn, SignUp, SignOutButton, useAuth } from '@clerk/react';
import { ArrowLeft, ArrowUpRight, ShieldAlert, ShieldCheck, LogOut, LoaderCircle } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useAdminAccess from './useAdminAccess';
import { api } from './api';
import '../styles/AccountStates.css';

const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export function AuthProvider({children}:{children:ReactNode}) {
  return key
    ? <ClerkProvider publishableKey={key} signInUrl="/sign-in" signUpUrl="/sign-up" signInFallbackRedirectUrl="/account" signUpFallbackRedirectUrl="/account" afterSignOutUrl="/"><SyncClerkAccount/>{children}</ClerkProvider>
    : children;
}

function SyncClerkAccount(){
  const {isLoaded,isSignedIn,userId,getToken}=useAuth();
  const [retry,setRetry]=useState(0);
  const [error,setError]=useState<{userId:string;message:string}|null>(null);
  useEffect(()=>{const retrySync=()=>setRetry(value=>value+1);window.addEventListener('garage:account-sync-retry',retrySync);return()=>window.removeEventListener('garage:account-sync-retry',retrySync);},[]);
  useEffect(()=>{
    if(!isLoaded||!isSignedIn||!userId)return;
    let active=true;
    void getToken().then(token=>{if(!token)throw new Error('Clerk did not provide a session token. Sign out and sign in again.');return api('/auth/sync',{method:'POST'},token);}).then(()=>{if(active){setError(null);window.dispatchEvent(new Event('garage:account-synced'));}}).catch(error=>{if(active){const message=error instanceof Error?error.message:'Account sync failed.';console.error('Mustang Garage account sync failed:',message);setError({userId,message});}});
    return()=>{active=false;};
  },[isLoaded,isSignedIn,userId,getToken,retry]);
  if(!isSignedIn||!userId||!error||error.userId!==userId)return null;
  return <div role="alert" style={{position:'fixed',zIndex:9999,bottom:16,left:'50%',transform:'translateX(-50%)',width:'min(94vw,680px)',padding:'14px 18px',background:'#251e1b',color:'#fff',border:'1px solid #c89b65',boxShadow:'0 8px 30px #0005',fontSize:14}}><strong>Account not saved to MongoDB.</strong> {error.message} <button type="button" onClick={()=>{setError(null);setRetry(value=>value+1);}} style={{marginLeft:12,padding:'6px 10px',cursor:'pointer'}}>Retry sync</button></div>;
}

function Missing() {
  return <AccessScreen title="Sign-in is unavailable" message="Clerk is not configured for this site yet. Set the frontend publishable key and restart the client." />;
}

export function AuthPage({signup=false}:{signup?:boolean}) {
  if (!key) return <Missing/>;
  return <main className="mg-auth-screen">
    <Link className="mg-auth-back" to="/"><ArrowLeft size={15}/> Return to the garage</Link>
    <section className="mg-auth-card" aria-labelledby="mg-auth-title">
      <p className="mg-auth-kicker"><span/> MUSTANG GARAGE / ACCOUNT DESK</p>
      <h1 id="mg-auth-title">{signup ? <>JOIN THE<br/><em>garage.</em></> : <>BACK TO THE<br/><em>garage.</em></>}</h1>
      <p className="mg-auth-intro">{signup ? 'Create your personal garage to revisit the machines and stories that interest you.' : 'Sign in to your personal Mustang Garage dashboard.'}</p>
      <div className="mg-clerk-form">{signup ? <SignUp routing="path" path="/sign-up"/> : <SignIn routing="path" path="/sign-in"/>}</div>
      <div className="mg-auth-foot"><span>SECURE ACCOUNT ACCESS</span><span>MG / 01</span></div>
    </section>
  </main>;
}

function AccessScreen({title,message,unauthorized=false,error=false,loading=false,children}:{title:string;message:string;unauthorized?:boolean;error?:boolean;loading?:boolean;children?:ReactNode}) {
  const Icon = loading ? LoaderCircle : (unauthorized||error) ? ShieldAlert : ShieldCheck;
  return <main className="mg-access-screen">
    <section className="mg-access-card" aria-labelledby="mg-access-title" aria-busy={loading}>
      <Link className="mg-access-brand" to="/" aria-label="Mustang Garage home"><span className="mg-access-mark">M</span><span>MUSTANG <i>GARAGE / CONTROL DESK</i></span></Link>
      <div className={`mg-access-icon${(unauthorized||error)?' is-alert':loading?' is-loading':''}`}><Icon size={24} strokeWidth={1.6} aria-hidden="true"/></div>
      <p className="mg-access-kicker">{unauthorized ? 'RESTRICTED AREA / 403' : error?'ACCOUNT ACCESS / ACTION REQUIRED':'ACCOUNT CHECK / MUSTANG GARAGE'}</p>
      <h1 id="mg-access-title">{title}</h1>
      <p className="mg-access-message" role={error?'alert':'status'}>{message}</p>
      {children}
      <div className="mg-access-foot"><span>AUTHENTICATED WORKSPACE</span><span>MG / ADMIN</span></div>
    </section>
  </main>;
}

function Authorized({children}:{children:ReactNode}) {
  const {isLoaded,isSignedIn,getToken}=useAuth();
  const [state,setState]=useState({loading:true,error:''});
  useEffect(()=>{
    if(!isLoaded||!isSignedIn)return;
    let active=true;
    getToken().then(token=>api('/admin/me',{},token)).then(()=>{
      if(active)setState({loading:false,error:''});
    }).catch(error=>{
      if(active)setState({loading:false,error:error instanceof Error?error.message:'Admin access could not be verified.'});
    });
    return()=>{active=false;};
  },[isLoaded,isSignedIn,getToken]);

  if(!isLoaded)return <AccessScreen loading title="Checking your account" message="Connecting securely to the garage deskÃ¢â‚¬Â¦"/>;
  if(!isSignedIn)return <RedirectToSignIn/>;
  if(state.loading)return <AccessScreen loading title="Verifying access" message="Checking your account with the garage serverÃ¢â‚¬Â¦"/>;
  if(state.error){
    const unauthorized=/not authorized|unauthorized|forbidden/i.test(state.error);
    const authFailed=/sign in to continue|session could not be verified/i.test(state.error);
    const message=unauthorized
      ? 'This signed-in account is not on the serverÃ¢â‚¬â„¢s administrator allowlist. Ask the garage owner to add your verified email to ADMIN_EMAILS.'
      : authFailed
        ? 'The server could not verify this Clerk session. Sign out and sign in again; if this continues, check the Clerk server key configuration.'
        : state.error;
    return <AccessScreen error title={unauthorized?'Administrator access required':'Access could not be verified'} message={message} unauthorized={unauthorized}>
      <div className="mg-access-actions"><SignOutControl/><Link to="/" className="mg-access-link">Return to the garage <ArrowUpRight size={15}/></Link></div>
      {!unauthorized&&<Link className="mg-access-retry" to="/sign-in">Sign in with another account</Link>}
    </AccessScreen>;
  }
  return children;
}

export function AdminGuard({children}:{children:ReactNode}) {
  return key ? <Authorized>{children}</Authorized> : <Missing/>;
}

export function SignOutControl({className='',onClick}:{className?:string;onClick?:()=>void}) {
  return <SignOutButton><button type="button" className={`mg-signout ${className}`.trim()} onClick={onClick}><LogOut size={15} strokeWidth={1.6} aria-hidden="true"/><span>Sign out</span></button></SignOutButton>;
}

export function AccountControl({onNavigate}:{onNavigate?:()=>void}) {
  return key ? <SignedAccount onNavigate={onNavigate}/> : <Link to="/sign-in" onClick={onNavigate}>Sign in</Link>;
}

function SignedAccount({onNavigate}:{onNavigate?:()=>void}) {
  const {isLoaded,isSignedIn}=useAuth();
  const isAdmin=useAdminAccess();
  if(!isLoaded)return <span className="mg-account-pending" role="status">Accountâ€¦</span>;
  return isSignedIn ? <>{isAdmin?<NavLink to="/admin" onClick={onNavigate}>Admin</NavLink>:<NavLink to="/account" onClick={onNavigate}>My garage</NavLink>}<SignOutControl className="mg-signout--nav" onClick={onNavigate}/></> : <Link to="/sign-in" onClick={onNavigate}>Sign in</Link>;
}

function SignedInGuard({children}:{children:ReactNode}) {
  const {isLoaded,isSignedIn}=useAuth();
  if(!isLoaded)return <AccessScreen loading title="Opening your garage" message="Checking your account..."/>;
  if(!isSignedIn)return <RedirectToSignIn/>;
  return children;
}

export function UserGuard({children}:{children:ReactNode}) {
  return key?<SignedInGuard>{children}</SignedInGuard>:<Missing/>;
}
