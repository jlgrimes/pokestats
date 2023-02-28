import {
  Badge,
  Button,
  ButtonProps,
  Heading,
  HeadingProps,
  HStack,
  Text,
} from '@chakra-ui/react';
import { FaBroadcastTower } from 'react-icons/fa';
import { Tournament } from '../../../types/tournament';
import { useUtcOffset } from '../../hooks/tournamentMetadata';
import { StatsHeading } from '../common/StatsHeading';
import {
  formatTournamentStatus,
  getTournamentStatusBadgeProps,
} from './helpers';

interface TournamentStatusBannerProps {
  tournament: Tournament;
}

export const TournamentStatusBanner = (props: TournamentStatusBannerProps) => {
  const utcOffset = useUtcOffset(props.tournament.id);

  const getButtonProps = (): Partial<ButtonProps> => {
    if (props.tournament.tournamentStatus === 'running') {
      return {
        variant: 'solid',
        colorScheme: 'green',
        leftIcon: <FaBroadcastTower />,
      };
    }

    if (props.tournament.tournamentStatus === 'not-started') {
      return {
        variant: 'solid',
        colorScheme: 'purple',
      };
    }

    if (props.tournament.tournamentStatus === 'finished') {
      return {
        variant: 'solid',
        colorScheme: 'blackAlpha',
      };
    }

    return {};
  };

  return (
    <Button width='100%' borderRadius={0} {...getButtonProps()}>
      <StatsHeading>
        {formatTournamentStatus(props.tournament, utcOffset)}
      </StatsHeading>
    </Button>
  );
};
