import { useEffect, useState } from 'react';
import { EventMap } from './EventMap';
import { EventGame, MapCenter } from './types';
import { EventList } from './EventList';
import { EventGameFilter } from './EventGameFilter';
import { useEvents } from './useEvents';
import { LocationSearch } from './LocationSearch';
import { ComponentLoader } from '../common/ComponentLoader';
import { Flex, Text } from '@tremor/react';
import { Link } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { EVENT_DISTANCE_SLIDER_COOKIE_KEY, EVENT_QUERY_COOKIE_KEY } from './constants';
import { DistanceFilter } from './DistanceFilter';

export const EventLocator = () => {
  const [center, setCenter] = useState<MapCenter | undefined>();
  const [filteredGame, setFilteredGame] = useState<EventGame>('tcg');
  const [maxDistance, setMaxDistance] = useState<number>(250);
  const { data: events, isLoading } = useEvents(center, false, filteredGame, maxDistance);

  useEffect(() => {
    const cookie = Cookies.get(EVENT_QUERY_COOKIE_KEY);
    if (cookie) {
      setCenter(JSON.parse(cookie));
    }

    const sliderCookies = Cookies.get(EVENT_DISTANCE_SLIDER_COOKIE_KEY);
    if (sliderCookies) {
      setMaxDistance(parseInt(sliderCookies));
    }
  }, []);

  return (
    <div className='w-full h-full'>
      <LocationSearch setCenter={setCenter} />
      {/* <EventMap events={events} center={center} /> */}
      <Flex>
        {center && <EventGameFilter game={filteredGame} setGame={setFilteredGame} />}
        {center && <DistanceFilter maxDistance={maxDistance} setMaxDistance={setMaxDistance} />}
      </Flex>
      {center && events && <EventList events={events} center={center} />}
      {isLoading && <ComponentLoader />}
      {!center && !isLoading && (
        <div className='px-4 py-8 flex flex-col gap-1'>
          <Text>Enter a location to find tournaments near you.</Text>
          <Text>Refer to the <Link href='https://events.pokemon.com/en-us/events' isExternal color='blue.500'>official event locator</Link> for the most up-to-date information.</Text>
        </div>
      )}
    </div>
  )
}