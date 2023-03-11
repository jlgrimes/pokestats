import {
  Card,
  CardBody,
  Divider,
  Grid,
  GridItem,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackItem,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Fragment, useEffect, useState } from 'react';
import {
  MatchResult,
  Standing,
  Tournament,
} from '../../../../../types/tournament';
import { useUserIsAdmin } from '../../../../hooks/administrators';
import { useLiveTournamentResults } from '../../../../hooks/tournamentResults';
import { useUserMatchesLoggedInUser } from '../../../../hooks/user';
import { cropPlayerName } from '../../../../lib/fetch/fetchLiveResults';
import { PlayerCard } from '../../../Tournament/Home/PlayerCard/PlayerCard';
import { RoundsList } from '../../RoundsList';
import { StandingsRow } from '../StandingsRow';

export const OpponentRoundListContent = ({
  tournament,
  player,
}: {
  tournament: Tournament;
  player: Standing;
}) => {
  // We set the load - allRoundData flag to true because this component will only
  // get rendered if opponent round data is loaded. So we can just tap into that
  // without triggering a long load time for refetching the tournament.
  const { data: liveResults } = useLiveTournamentResults(tournament.id, {
    load: { allRoundData: true },
  });
  const { data: userIsAdmin } = useUserIsAdmin();
  const userMatchesLoggedInUser = useUserMatchesLoggedInUser(player.name);

  const opponents: { name: string; result: MatchResult }[] | undefined =
    player.rounds;

  const rounds = opponents
    ?.slice(0)
    .reverse()
    .map(({ name, result }) => {
      const standing = liveResults?.data.find(
        standing => standing.name === cropPlayerName(name)
      );
      return {
        opponent: standing,
        name,
        result,
      };
    });

  return rounds ? (
    <RoundsList
      rounds={rounds}
      tournament={tournament}
      shouldHideDecks={!!liveResults?.shouldHideDecks}
    />
  ) : null;
};
