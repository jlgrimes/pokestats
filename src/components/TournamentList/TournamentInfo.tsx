import { LinkOverlay } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Flex, Subtitle, Title } from '@tremor/react';
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
      <Flex className='gap-6 justify-start'>
         {countryCode ? <CountryFlag countryCode={countryCode} size={'sm'} /> : null}
        <Flex className='w-fit'>
          <Flex className='flex-col grow items-start'>
            <LinkOverlay as={NextLink} href={`/tournaments/${props.tournament.id}`}>
              <Title>
                {props.tournament.name}
              </Title>  
            </LinkOverlay>
          </Flex>

          <TournamentStatusBadges tournament={props.tournament} />
        </Flex>
      </Flex>
  );
};
