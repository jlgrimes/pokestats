import { Badge, HStack } from '@chakra-ui/react';
import { TournamentStatusBadgeProps } from './TournamentStatusBadge';

export const TournamentFormatBadges = (props: TournamentStatusBadgeProps) => (
  <HStack paddingY={1}>
    <Badge variant='outline' fontSize={props.size}>
      {props.tournament.format.rotation} Block-on
    </Badge>
    <Badge variant='outline' fontSize={props.size}>
      {props.tournament.format.format}
    </Badge>
  </HStack>
);
