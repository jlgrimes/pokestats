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
import { useColor } from '../../hooks/useColor';
import { FormatTag } from '../Deck/Format/FormatTag';
import { formatTournamentDate } from './helpers';

interface TournamentInfoProps {
  tournament: Tournament;
}

export const TournamentInfo = (props: TournamentInfoProps) => {
  const { header, subheader } = useColor();
  const live = props.tournament.tournamentStatus === 'running';

  return (
    <Stack spacing={1}>
      <Heading size={live ? 'md' : 'sm'} color={header}>
        {props.tournament.name}
      </Heading>
      {!live && (
        <Heading size={'xs'} color={subheader} fontWeight={'semibold'}>
          {formatTournamentDate(props.tournament)}
        </Heading>
      )}
    </Stack>
  );
};
