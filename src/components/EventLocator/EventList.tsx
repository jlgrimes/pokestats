import { useState } from "react";
import { EventCard } from "./EventCard";
import { MapCenter } from "./types";
import { useEvents } from "./useEvents";
import { Button } from "@tremor/react";

interface EventListProps {
  center: MapCenter;
}

export const EventList = (props: EventListProps) => {
  const [shownEvents, setShownEvents] = useState(10);
  const [shouldShowLocals, setShouldShowLocals] = useState(false); // TODO: Add ablity to show leagues. Maybe. Or maybe not.

  const { data: events } = useEvents(props.center, shouldShowLocals);

  const handleExpandEvents = () => setShownEvents(shownEvents + 10);

  return (
    <div>
      {events?.map((event) => <EventCard event={event} />)}
      <Button variant='light' onClick={handleExpandEvents}>Show more</Button>
    </div>
  )
}