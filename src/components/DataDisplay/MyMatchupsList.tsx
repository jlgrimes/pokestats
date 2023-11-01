import { Standing, Tournament } from '../../../types/tournament';
import { memo } from 'react';
import { RoundsList } from './Rounds/RoundsList';
import { CombinedPlayerProfile } from '../../../types/player';
import { useUserIsBanned } from '../../hooks/user';

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
    const userIsBanned = useUserIsBanned(user);

    return myStanding?.rounds ? (
      <RoundsList
        player={myStanding}
        tournament={tournament}
        canEditDecks={isLoggedInUser && !userIsBanned}
      />
    ) : null;
  }
);

MyMatchupsList.displayName = 'MyMatchupsList';
