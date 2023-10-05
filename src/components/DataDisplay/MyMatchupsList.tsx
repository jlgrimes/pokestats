import { PlayerLiveResultsSchema, usePlayerLiveResults } from '../../hooks/tournamentResults';
import { Standing, Tournament } from '../../../types/tournament';
import { memo } from 'react';
import { RoundsList } from './Rounds/RoundsList';
import { CombinedPlayerProfile } from '../../../types/player';
import { getShouldHideDecks } from '../../hooks/tournaments';

export const MyMatchupsList = memo(
  ({
    tournament,
    user,
    isLoggedInUser,
    myStanding,
  }: {
    tournament: Tournament;
    user: CombinedPlayerProfile;
    isLoggedInUser: boolean;
    myStanding: Standing | null | undefined;
  }) => {
    return myStanding?.rounds ? (
      <RoundsList
        player={myStanding}
        tournament={tournament}
        canEditDecks={isLoggedInUser}
      />
    ) : null;
  }
);

MyMatchupsList.displayName = 'MyMatchupsList';
