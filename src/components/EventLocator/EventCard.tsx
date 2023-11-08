import { LinkBox, LinkOverlay } from "@chakra-ui/react";
import { MapIcon } from "@heroicons/react/outline";
import { IconMapPin } from "@tabler/icons-react";
import { Bold, Card, Flex, Icon, Subtitle, Text, Title } from "@tremor/react";
import { format, parseISO } from "date-fns";
import { FaCoffee, FaRoute } from "react-icons/fa";
import { capitalizeEveryPhrase } from "../../lib/strings";

interface EventCardProps {
  event: Record<any, any>;
}

export const EventCard = (props: EventCardProps) => {
  const isChallenge = props.event.tags.includes("league_challenge");
  const isCup = props.event.tags.includes("league_cup");

  return (
    <LinkBox>
      <Card className="px-4 py-2 mt-2" decoration={isCup ? 'left' : undefined} decorationColor="rose">
        <LinkOverlay isExternal href={props.event.pokemon_url}>
          <Bold className="font-semibold text-slate-700">{props.event.name}</Bold>
        </LinkOverlay>
        <Flex>
          <div className="flex items-center">
            <Icon icon={IconMapPin} size='sm' variant='simple' color="slate" />
            <Text>{`${capitalizeEveryPhrase(props.event.address.city)} ${props.event.address.state} - ${props.event.distance.toFixed(0)} mi`}</Text>
          </div>
        </Flex>
      </Card>
    </LinkBox>
  );
}