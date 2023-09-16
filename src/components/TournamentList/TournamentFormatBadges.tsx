import { Badge, HStack } from '@chakra-ui/react';
import { TournamentStatusBadgeProps } from './TournamentStatusCallout';

export const TournamentFormatBadges = (props: TournamentStatusBadgeProps) => (
  <HStack paddingY={1}>
    <Badge fontSize={props.size}>
      {props.tournament.format.rotation} Block-on
    </Badge>
    {/* <Badge fontSize={props.size}>
      {props.tournament.format.format}
    </Badge> */}
  </HStack>
);
