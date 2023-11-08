import { LinkBox, LinkOverlay } from "@chakra-ui/react";
import { Card, Subtitle, Title } from "@tremor/react";
import { format, parseISO } from "date-fns";

interface EventCardProps {
  event: Record<any, any>;
}

export const EventCard = (props: EventCardProps) => {
  return (
    <LinkBox>
      <Card className="py-2 mt-2">
        <LinkOverlay isExternal href={props.event.pokemon_url}>
          <Title>{props.event.name}</Title>
        </LinkOverlay>
        <Subtitle>{format(parseISO(props.event.start_datetime), 'eeee MMM d, y')}</Subtitle>
      </Card>
    </LinkBox>
  );
}