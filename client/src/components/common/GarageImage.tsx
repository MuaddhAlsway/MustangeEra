import { useEffect, useRef, useState, type ImgHTMLAttributes, type SyntheticEvent } from 'react';

type ImageState={src:string;status:'loading'|'loaded'|'error'};
type GarageImageProps=ImgHTMLAttributes<HTMLImageElement>&{priority?:boolean};

export default function GarageImage({src='',className='',loading,fetchPriority,decoding,onLoad,onError,priority,...props}:GarageImageProps){
  const imageRef=useRef<HTMLImageElement>(null);
  const [state,setState]=useState<ImageState>({src,status:'loading'});
  const isPriority=priority??fetchPriority==='high';
  const imageState=state.src===src?state.status:'loading';

  useEffect(()=>{
    const image=imageRef.current;
    if(image?.complete)setState({src,status:image.naturalWidth?'loaded':'error'});
  },[src]);

  function handleLoad(event:SyntheticEvent<HTMLImageElement>){
    setState({src,status:'loaded'});
    onLoad?.(event);
  }

  function handleError(event:SyntheticEvent<HTMLImageElement>){
    setState({src,status:'error'});
    onError?.(event);
  }

  return <img ref={imageRef} {...props} src={src} className={`mg-image${className?` ${className}`:''}`} loading={loading??(isPriority?'eager':'lazy')} fetchPriority={fetchPriority??(isPriority?'high':'auto')} decoding={decoding??'async'} data-image-state={imageState} onLoad={handleLoad} onError={handleError}/>;
}
