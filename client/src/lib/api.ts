export const API_URL=(import.meta.env.VITE_API_URL||'http://localhost:4000/api').replace(/\/$/,'');
export async function api<T>(path:string, options:RequestInit={}, token?:string|null):Promise<T>{
 let response:Response;
 try{response=await fetch(`${API_URL}${path}`,{...options,headers:{...(options.body instanceof FormData?{}:{'Content-Type':'application/json'}),...(token?{Authorization:`Bearer ${token}`} :{}),...options.headers}});}
 catch{throw new Error(`Cannot reach the Mustang Garage API at ${API_URL}. The backend may not be running; check its startup logs and database connection.`);}
 if(!response.ok){const data=await response.json().catch(()=>null);throw new Error(data?.error||`Request failed (${response.status}).`);}
 return response.json() as Promise<T>;
}
export async function allPages<T>(path:string,token?:string|null):Promise<T[]>{const items:T[]=[];let page=1;let total:number;do{const data=await api<{items:T[];total:number}>(`${path}${path.includes('?')?'&':'?'}limit=100&page=${page}`,{},token);items.push(...data.items);total=data.total;if(!data.items.length)break;page++;}while(items.length<total);return items;}
export function assetUrl(src:string){if(!src.startsWith('/media/'))return src;const optimized=src.replace(/\.png$/i,'.webp');return `${API_URL.replace(/\/api$/,'')}${optimized}`;}
