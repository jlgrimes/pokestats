import {
  Badge,
  Box,
  Button,
  ButtonProps,
  Heading,
  HeadingProps,
  HStack,
  Stack,
  Text,
  Icon,
} from '@chakra-ui/react';
import { FaBroadcastTower, FaGlobe, FaGlobeAmericas, FaRegClock } from 'react-icons/fa';
import { Tournament } from '../../../types/tournament';
import {
  LocationDataSchema,
  useUtcOffset,
} from '../../hooks/tournamentMetadata';
import { StatsHeading } from '../common/StatsHeading';
import { getLocalTime, isInSameTimeZone } from '../Tournament/Home/helpers';
import {
  formatTournamentStatus,
  getTournamentStatusBadgeProps,
} from './helpers';

interface TournamentStatusBannerProps {
  tournament: Tournament;
  location?: LocationDataSchema;
}

export const TournamentStatusBanner = (props: TournamentStatusBannerProps) => {
  const utcOffset = useUtcOffset(props.tournament.id);

  const getButtonProps = (): Partial<ButtonProps> => {
    if (props.tournament.tournamentStatus === 'running') {
      return {
        variant: 'solid',
        colorScheme: 'green',
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

  const shouldShowLocalTime =
    props.location && !isInSameTimeZone(props.location.utc_offset_minutes);

  return (
    <Button
      width='100%'
      borderRadius={0}
      {...getButtonProps()}
      size={shouldShowLocalTime ? 'lg' : 'md'}
    >
      <Stack spacing={1} alignItems='center'>
        <HStack>
          <Icon as={FaBroadcastTower} />
          <StatsHeading>
            {formatTournamentStatus(props.tournament, utcOffset)}
          </StatsHeading>
        </HStack>
        <StatsHeading headingProps={{ fontSize: 13, fontWeight: 'bold' }}>
          {shouldShowLocalTime && (
            <HStack>
              <Icon as={FaGlobeAmericas} />
              <Text>{`${getLocalTime(
                props.location!.utc_offset_minutes
              )}`}</Text>
            </HStack>
          )}
        </StatsHeading>
      </Stack>
    </Button>
  );
};
