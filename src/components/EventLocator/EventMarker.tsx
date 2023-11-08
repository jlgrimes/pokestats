import { InfoWindow, InfoWindowF, Marker } from "@react-google-maps/api"
import { Subtitle, Title } from "@tremor/react";
import { format, parseISO } from "date-fns";
import { useState } from "react"

interface EventMarkerProps {
  event: Record<any, any>;
  openMarker: string | null;
  setOpenMarker: Function;
}

export const EventMarker = (props: EventMarkerProps) => {
  return (
    <Marker
      title={props.event.name}
      position={{lat: props.event.address.latitude, lng: props.event.address.longitude}}
      onClick={() => {
        if (props.openMarker === props.event.guid) {
          props.setOpenMarker(null);
        } else {
          props.setOpenMarker(props.event.guid)
        }
      }}  
    >
        {props.openMarker !== null && props.openMarker === props.event.guid && (
          <InfoWindowF>
            <div>
              <Title>{props.event.name}</Title>
              <Subtitle>{format(parseISO(props.event.start_datetime), 'mm dd yy')}</Subtitle>
              {JSON.stringify(props.event)}
            </div>
          </InfoWindowF>
        )}
    </Marker>
    )
  }
