import {
  Grid,
  Heading,
  HStack,
  LinkOverlay,
  Stack,
  useColorMode,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Tournament } from '../../../types/tournament';
import { useCurrentFormat } from '../../hooks/formats/formats';
import { FormatTag } from '../Deck/Format/FormatTag';
import { formatTournamentDate } from './helpers';

interface TournamentInfoProps {
  tournament: Tournament;
}

export const TournamentInfo = (props: TournamentInfoProps) => {
  const { colorMode } = useColorMode();
  const live = props.tournament.tournamentStatus === 'running';

  return (
    <Stack spacing={1}>
      <Heading
        size={'sm'}
        color={colorMode === 'dark' ? 'gray.100' : 'gray.700'}
      >
        {props.tournament.name}
      </Heading>
      {!live && (
        <Heading size={'xs'} color='gray.500' fontWeight={'semibold'}>
          {formatTournamentDate(props.tournament)}
        </Heading>
      )}
    </Stack>
  );
};
