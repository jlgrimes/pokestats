import { LinkOverlay } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Badge, Flex, Grid, Subtitle, Title } from '@tremor/react';
import { Tournament } from '../../../types/tournament';
import { formatTournamentDate } from './helpers';
import { TournamentStatusBadges } from './TournamentStatusBadges';
import { CountryFlag } from '../Tournament/Home/CountryFlag';
import { useCountryCode } from '../../hooks/tournamentMetadata';
import { trackEvent } from '../../lib/track';

interface TournamentInfoProps {
  tournament: Tournament;
}

export const TournamentInfo = (props: TournamentInfoProps) => {
  const countryCode = useCountryCode(props.tournament);

  return (
    <Flex>
      <div className='flex flex-col gap-1'>
      <LinkOverlay as={NextLink} href={`/tournaments/${props.tournament.id}`} onClick={() => trackEvent('Tournament card clicked', { tournament: props.tournament.name })}>
        <Title>{props.tournament.name}</Title>
      </LinkOverlay>
        <div className='flex gap-2'>
          <Subtitle>{formatTournamentDate(props.tournament)}</Subtitle>
          <TournamentStatusBadges tournament={props.tournament} />
        </div>
      </div>
      {countryCode ? <CountryFlag countryCode={countryCode} size={'sm'} /> : null}
    </Flex>
  )
};
