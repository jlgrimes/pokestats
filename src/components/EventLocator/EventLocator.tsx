import { useState } from 'react';
import { EventMap } from './EventMap';
import { EventGame, MapCenter } from './types';
import { EventList } from './EventList';
import { EventGameFilter } from './EventGameFilter';
import { useEvents } from './useEvents';
import { LocationSearch } from './LocationSearch';
import { ComponentLoader } from '../common/ComponentLoader';

export const EventLocator = () => {
  const [center, setCenter] = useState<MapCenter>({
    lat: 43.0859087,
    lng: -89.3723290
  });
  const [filteredGame, setFilteredGame] = useState<EventGame>('tcg');
  const { data: events, isLoading } = useEvents(center, false, filteredGame);

  return (
    <div className='w-full h-full'>
      <LocationSearch setCenter={setCenter} />
      {/* <EventMap events={events} center={center} /> */}
      <EventGameFilter game={filteredGame} setGame={setFilteredGame} />
      {events && <EventList events={events} center={center} />}
      {isLoading && <ComponentLoader />}
    </div>
  )
}