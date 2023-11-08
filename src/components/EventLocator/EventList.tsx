import { useState } from "react";
import { EventCard } from "./EventCard";
import { MapCenter } from "./types";
import { useEvents } from "./useEvents";
import { Bold, Button, Subtitle, Text, Title } from "@tremor/react";
import { format, getDate, parseISO } from "date-fns";

interface EventListProps {
  center: MapCenter;
  events: Record<any, any>[];
}

export const EventList = (props: EventListProps) => {
  const [shownEvents, setShownEvents] = useState(25);
  const renderedEvents = props.events;

  const handleExpandEvents = () => setShownEvents(shownEvents + 25);
  return (
    <div>
      {renderedEvents.map((event, idx) => (
        <div key={'container-' + event.guid}>
          {(idx === 0 || getDate(parseISO(event.start_datetime)) !== getDate(parseISO(renderedEvents[idx - 1].start_datetime))) && (
            <div key={format(parseISO(event.start_datetime), 'eeee MMM d, y') + '-tournaments'} className="pt-6 pl-2">
              <Subtitle>{format(parseISO(event.start_datetime), 'eeee MMM d, y')}</Subtitle>
            </div>
          )}
          <EventCard key={event.guid} event={event} />
        </div>
      ))}
      {/* <Button variant='light' onClick={handleExpandEvents}>Show more</Button> */}
    </div>
  )
}