import { Skeleton, Stack } from '@chakra-ui/react';
import { memo } from 'react';
import { PlayerCard } from '../../Tournament/Home/PlayerCard/PlayerCard';
import {
  usePatchedTournaments,
  useTournaments,
} from '../../../hooks/tournaments';
import { TournamentCard } from '../../TournamentList/TournamentCard';
import { ComponentLoader } from '../../common/ComponentLoader';
import { LiveResultsWrapper } from './LiveResultsWrapper';
import { CombinedPlayerProfile } from '../../../../types/player';

interface CurrentTournamentResultsProps {
  user: CombinedPlayerProfile;
  isLoggedInUser: boolean;
}

export const CurrentTournamentResults = memo(
  (props: CurrentTournamentResultsProps) => {
    const { data: notPatchedTournaments, isLoading: tournamentsLoading } =
      useTournaments();
    const { data: tournaments, isLoading: patchedTournamentsLoading } =
      usePatchedTournaments(notPatchedTournaments ?? []);
    const currentlyRunningTournament = tournaments.find(
      tournament => tournament.tournamentStatus === 'running'
    );

    const loading = tournamentsLoading || patchedTournamentsLoading;

    return !loading && currentlyRunningTournament ? (
      <LiveResultsWrapper
        tournament={currentlyRunningTournament}
        user={props.user}
        isLoggedInUser={props.isLoggedInUser}
      />
    ) : null;
  }
);

CurrentTournamentResults.displayName = 'CurrentTournamentResults';
