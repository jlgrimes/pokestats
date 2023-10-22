import { LinkOverlay } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Badge, Flex, Grid, Subtitle, Title } from '@tremor/react';
import { Tournament } from '../../../types/tournament';
import { formatTournamentDate } from './helpers';
import { TournamentStatusBadges } from './TournamentStatusBadges';
import { CountryFlag } from '../Tournament/Home/CountryFlag';
import { useCountryCode } from '../../hooks/tournamentMetadata';
import { StatusOnlineIcon } from '@heroicons/react/outline';

interface TournamentInfoProps {
  tournament: Tournament;
}

export const TournamentInfo = (props: TournamentInfoProps) => {
  const countryCode = useCountryCode(props.tournament.id);

  return (
    <Flex>
      <div>
      <LinkOverlay as={NextLink} href={`/tournaments/${props.tournament.id}`}>
        <Title>{props.tournament.name}</Title>
      </LinkOverlay>
        <div className='flex gap-2'>
          <Subtitle>{formatTournamentDate(props.tournament)}</Subtitle>
          {props.tournament.tournamentStatus === 'running' && (
            <Badge size='xs' icon={StatusOnlineIcon}>Live</Badge>
          )}
        </div>
      </div>
      {countryCode ? <CountryFlag countryCode={countryCode} size={'sm'} /> : null}
    </Flex>
  )
};
