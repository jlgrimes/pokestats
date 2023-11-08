import { Card, Title } from "@tremor/react";

interface EventCardProps {
  event: Record<any, any>;
}

export const EventCard = (props: EventCardProps) => {
  return (
    <Card>
      <Title>{props.event.name}</Title>
    </Card>
  );
}