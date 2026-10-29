import { createContext,useContext } from 'react';
import type { Car } from '../features/inventory/types';
import type { JournalStory } from '../features/journal/stories';
export type PublishedHeroSlide={image:string;imageAlt?:string;issue:string;label:string;kicker:string;title:string;accent:string;description:string;year:string;model:string};
export type PublishedPage={id:string;title:string;intro:string;hero?:{eyebrow?:string;title?:string;accent?:string;description?:string;image?:string;imageAlt?:string;slides?:PublishedHeroSlide[]};sections:{id:string;heading:string;body:string;image?:string;imageAlt?:string}[]};
export const PublicData=createContext<{cars:Car[];stories:JournalStory[];pages:Record<string,PublishedPage>;loading:boolean;error:string}>({cars:[],stories:[],pages:{},loading:true,error:''});
export const usePublicData=()=>useContext(PublicData);
