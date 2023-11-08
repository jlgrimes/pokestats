import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Component, useEffect, useState } from 'react';
import { EventMapProps, MapCenter } from './types';
import { useEvents } from './useEvents';
import { IMapProps } from 'google-maps-react';
import { EventMarker } from './EventMarker';

const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};


export const EventMap = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
  })

  const [center, setCenter] = useState<MapCenter>({
    lat: 43.0859087,
    lng: -89.3723290
  });
  const [openMarker, setOpenMarker] = useState<string | null>(null);
  const { data: events } = useEvents(center);
  console.log(events)

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{
        width: '100%',
        height: '50%'
      }}
      center={center}
      zoom={10}
    >
      {events?.map((event) => (
        <EventMarker event={event} openMarker={openMarker} setOpenMarker={setOpenMarker} />
      ))}
    </GoogleMap>
  ) : <></>
}