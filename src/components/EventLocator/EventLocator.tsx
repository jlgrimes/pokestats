import { useState } from 'react';
import { EventMap } from './EventMap';
import { EventGame, MapCenter } from './types';
import { EventList } from './EventList';
import { EventGameFilter } from './EventGameFilter';
import { useEvents } from './useEvents';

export const EventLocator = () => {
  const [center, setCenter] = useState<MapCenter>({
    lat: 43.0859087,
    lng: -89.3723290
  });
  const [filteredGame, setFilteredGame] = useState<EventGame>('tcg');
  const { data: events } = useEvents(center, false, filteredGame);
  console.log(events)

  if (!events) return null;
  
  return (
    <div className='w-full h-full'>
      {/* <EventMap events={events} center={center} /> */}
      <EventGameFilter game={filteredGame} setGame={setFilteredGame} />
      <EventList events={events} center={center} />
    </div>
  )
}