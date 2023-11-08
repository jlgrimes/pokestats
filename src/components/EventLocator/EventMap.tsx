import { GoogleApiWrapper, IProvidedProps, InfoWindow, Map, Marker } from 'google-maps-react';
import { Component } from 'react';

interface EventMapProps extends IProvidedProps {}

const EventMap = (props: EventMapProps) => {
  return (
    <Map
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