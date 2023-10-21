import {
  Badge,
  Box,
  Button,
  HStack,
  Stack,
  Text,
  Icon,
} from '@chakra-ui/react';
import { FaBed, FaGlobeAmericas, FaMoon } from 'react-icons/fa';
import { IoMdMoon } from 'react-icons/io';
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
import { Bold, Callout, Flex } from '@tremor/react';

interface TournamentStatusBannerProps {
  tournament: Tournament;
  location?: LocationDataSchema;
}

export const TournamentStatusBanner = (props: TournamentStatusBannerProps) => {
  const utcOffset = useUtcOffset(props.tournament.id);

  const shouldShowLocalTime =
    props.tournament.tournamentStatus === 'running' &&
    props.location &&
    !isInSameTimeZone(props.location.utc_offset_minutes);

  if (props.tournament.tournamentStatus === 'finished') return <Box />;

  return (
    <Callout title={formatTournamentStatus(props.tournament, utcOffset)} color='purple'>
      {shouldShowLocalTime && (
        <HStack>
          <Icon as={FaGlobeAmericas} />
          <Text className='font-semibold'>{`${getLocalTime(
            props.location!.utc_offset_minutes
          )} local`}</Text>
        </HStack>
      )}
    </Callout>
  )

  return (
    <Button
      width='100%'
      borderRadius={{ base: 0, sm: '3xl' }}
      {...getTournamentStatusBadgeProps(props.tournament)}
      size={shouldShowLocalTime ? 'lg' : 'md'}
    >
      <Stack spacing={1} alignItems='center'>
        <HStack>
          <StatsHeading>
            {formatTournamentStatus(props.tournament, utcOffset)}
          </StatsHeading>
          {props.tournament.subStatus === 'after-day-one' && (
            <Icon as={FaBed} />
          )}
        </HStack>
        {shouldShowLocalTime && (
          <StatsHeading headingProps={{ fontSize: 13, fontWeight: 'bold' }}>
            <HStack>
              <Icon as={FaGlobeAmericas} />
              <Text>{`${getLocalTime(
                props.location!.utc_offset_minutes
              )}`}</Text>
            </HStack>
          </StatsHeading>
        )}
      </Stack>
    </Button>
  );
};
