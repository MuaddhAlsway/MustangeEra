import { useAuth } from '@clerk/react';
import { useEffect, useState } from 'react';
import { api } from './api';

// Only the protected server endpoint can grant this UI permission.
export default function useAdminAccess() {
  const {isLoaded,isSignedIn,userId,sessionId,getToken}=useAuth();
  const [result,setResult]=useState<{userId:string;sessionId:string;authorized:boolean}|null>(null);
  useEffect(()=>{
    if(!isLoaded||!isSignedIn||!userId||!sessionId)return;
    let active=true;
    let requestNumber=0;
    async function verify(){
      const request=++requestNumber;
      try {
        const token=await getToken();
        if(!token)throw new Error('Session token unavailable.');
        const response=await api<{authorized:boolean}>('/admin/me',{},token);
        if(active&&request===requestNumber)setResult({userId:userId!,sessionId:sessionId!,authorized:response.authorized===true});
      }catch{
        if(active&&request===requestNumber)setResult({userId:userId!,sessionId:sessionId!,authorized:false});
      }
    }
    const refresh=()=>{setResult(null);void verify();};
    void verify();
    window.addEventListener('focus',refresh);
    window.addEventListener('garage:account-synced',refresh);
    return()=>{active=false;window.removeEventListener('focus',refresh);window.removeEventListener('garage:account-synced',refresh);};
  },[isLoaded,isSignedIn,userId,sessionId,getToken]);
  return Boolean(isLoaded&&isSignedIn&&userId&&sessionId&&result?.userId===userId&&result.sessionId===sessionId&&result.authorized);
}
