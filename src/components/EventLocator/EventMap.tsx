import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Component, useEffect, useState } from 'react';
import { MapCenter } from './types';
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

interface EventMapProps {
  center: MapCenter;
  events: Record<any, any>[];
}

export const EventMap = (props: EventMapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
  })


  const [openMarker, setOpenMarker] = useState<string | null>(null);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{
        width: '100%',
        height: '25%'
      }}
      center={props.center}
      zoom={10}
    >
      {props.events?.map((event) => (
        <EventMarker event={event} openMarker={openMarker} setOpenMarker={setOpenMarker} />
      ))}
    </GoogleMap>
  ) : <></>
}