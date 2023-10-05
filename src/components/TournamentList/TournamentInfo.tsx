import { LinkOverlay } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Flex, Grid, Subtitle, Title } from '@tremor/react';
import { Tournament } from '../../../types/tournament';
import { formatTournamentDate } from './helpers';
import { TournamentStatusBadges } from './TournamentStatusBadges';
import { CountryFlag } from '../Tournament/Home/CountryFlag';
import { useCountryCode } from '../../hooks/tournamentMetadata';

interface TournamentInfoProps {
  tournament: Tournament;
}

export const TournamentInfo = (props: TournamentInfoProps) => {
  const countryCode = useCountryCode(props.tournament.id);

  return (
      <Grid className='grid-cols-[auto_1fr] gap-4'>
         {countryCode ? <CountryFlag countryCode={countryCode} size={'sm'} /> : null}
        <Flex className='w-fit'>
          <Flex className='flex-col grow items-start'>
            <LinkOverlay as={NextLink} href={`/tournaments/${props.tournament.id}/masters`}>
              <Title>
                {props.tournament.name}
              </Title>
              <Subtitle>
                {formatTournamentDate(props.tournament)}
              </Subtitle>
            </LinkOverlay>
          </Flex>

          <TournamentStatusBadges tournament={props.tournament} />
        </Flex>
      </Grid>
  );
};
