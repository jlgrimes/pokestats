import { useState } from 'react';
import { EventMap } from './EventMap';
import { MapCenter } from './types';

export const EventLocator = () => {
  const [center, setCenter] = useState<MapCenter>({
    lat: 43.0859087,
    lng: -89.3723290
  });
  
  return (
    <div className='w-full h-full'>
      <EventMap center={center} />
    </div>
  )
}