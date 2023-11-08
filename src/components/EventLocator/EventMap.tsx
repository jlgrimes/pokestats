import { GoogleApiWrapper, IMapProps, IProvidedProps, InfoWindow, Map, Marker } from 'google-maps-react';
import { Component, useEffect, useState } from 'react';

interface EventMapProps extends IProvidedProps {}

interface MapCenter {
  lng: number;
  lat: number;
}

const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

const EventMap = (props: EventMapProps) => {
  const [center, setCenter] = useState<MapCenter>({
    lat: 40.854885,
    lng: -88.081807
  });

  useEffect(() => {
    console.log(center)
  }, [center]);

  return (
    <Map
      onBoundsChanged={debounce((mapProps: IMapProps, map: any) => {
        setCenter({ lng: map.center.lng(), lat: map.center.lat() });
      }, 1000)}
      containerStyle={{
        width: '100%',
        height: '50%'
      }}
      google={props.google}
      initialCenter={center}
    />
  )
}

export class MapContainer extends Component {}
 
export default GoogleApiWrapper({
  apiKey: (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '')
})(EventMap);