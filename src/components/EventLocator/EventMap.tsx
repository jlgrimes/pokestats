import { GoogleApiWrapper } from 'google-maps-react';
import { Component } from 'react';

const EventMap = () => {
  return (
    <div>
      Events or something.
    </div>
  )
}

export class MapContainer extends Component {}
 
export default GoogleApiWrapper({
  apiKey: (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '')
})(EventMap);