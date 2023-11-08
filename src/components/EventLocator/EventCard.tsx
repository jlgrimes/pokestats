import { Card, Subtitle, Title } from "@tremor/react";
import { format, parseISO } from "date-fns";

interface EventCardProps {
  event: Record<any, any>;
}

export const EventCard = (props: EventCardProps) => {
  return (
    <Card className="py-2 mt-2">
      <Title>{props.event.name}</Title>
      <Subtitle>{format(parseISO(props.event.start_datetime), 'eeee MMM d, y')}</Subtitle>
    </Card>
  );
}