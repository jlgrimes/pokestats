import { useState } from "react";
import { EventCard } from "./EventCard";
import { MapCenter } from "./types";
import { useEvents } from "./useEvents";
import { Button } from "@tremor/react";

interface EventListProps {
  center: MapCenter;
  events: Record<any, any>[];
}

export const EventList = (props: EventListProps) => {
  const [shownEvents, setShownEvents] = useState(25);

  const handleExpandEvents = () => setShownEvents(shownEvents + 25);

  return (
    <div>
      {props.events?.slice(0, shownEvents).map((event) => <EventCard event={event} />)}
      <Button variant='light' onClick={handleExpandEvents}>Show more</Button>
    </div>
  )
}