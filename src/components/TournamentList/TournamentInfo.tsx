import { LinkOverlay } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Badge, Flex, Grid, Subtitle, Title } from '@tremor/react';
import { Tournament } from '../../../types/tournament';
import { formatTournamentDate } from './helpers';
import { TournamentStatusBadges } from './TournamentStatusBadges';
import { CountryFlag } from '../Tournament/Home/CountryFlag';
import { useCountryCode } from '../../hooks/tournamentMetadata';
import { trackEvent } from '../../lib/track';
import { useUserIsAdmin } from '../../hooks/administrators';
import { OpenEditTournamentInfo } from '../Admin/EditTournamentInfo/OpenEditTournamentInfo';

interface TournamentInfoProps {
  tournament: Tournament;
}

const TournamentTitle = (props: TournamentInfoProps) => {
  const countryCode = useCountryCode(props.tournament);
  const { data: userIsAdmin } = useUserIsAdmin();

  return (
    <Flex className='gap-1'>
      <Title>{props.tournament.name}</Title>
      {countryCode ? <CountryFlag countryCode={countryCode} size={'xs'} /> : null}
      {(!countryCode && userIsAdmin) && <OpenEditTournamentInfo tournament={props.tournament} />}
    </Flex>
  );
}

export const TournamentInfo = (props: TournamentInfoProps) => {
  return (
    <div>
      <div className='flex flex-col'>
        {
          props.tournament.tournamentStatus === 'not-started' ? (
            <TournamentTitle {...props} />
          ) : (
            <LinkOverlay as={NextLink} href={`/tournaments/${props.tournament.id}`} onClick={() => trackEvent('Tournament card clicked', { tournament: props.tournament.name })}>
              <TournamentTitle {...props} />
            </LinkOverlay>
          )
        }
        <div className='flex gap-2'>
          <Subtitle>{formatTournamentDate(props.tournament)}</Subtitle>
          <TournamentStatusBadges tournament={props.tournament} />
        </div>
      </div>  
    </div>
  )
};
