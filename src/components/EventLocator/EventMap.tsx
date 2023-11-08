import { GoogleApiWrapper, IProvidedProps, InfoWindow, Map, Marker } from 'google-maps-react';
import { Component, useEffect, useState } from 'react';

interface EventMapProps extends IProvidedProps {}

interface Coords {
  lo: number;
  hi: number;
}

interface MapBounds {
  lng: Coords;
  lat: Coords;
}

const EventMap = (props: EventMapProps) => {
  const [bounds, setBounds] = useState<MapBounds>();

  useEffect(() => {
    console.log(bounds)
  }, [bounds]);

  return (
    <Map
      onBoundsChanged={(mapProps, map, event) => {
        const { Ga: lng, Ua: lat } = map.getBounds();
        setBounds({ lng, lat });
      }}
      containerStyle={{
        width: '100%',
        height: '50%'
      }}
      google={props.google}
      initialCenter={{
        lat: 40.854885,
        lng: -88.081807
      }}
    />
  )
}

export class MapContainer extends Component {}
 
export default GoogleApiWrapper({
  apiKey: (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '')
})(EventMap);