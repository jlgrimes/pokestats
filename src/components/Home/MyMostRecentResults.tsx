import { Skeleton } from '@chakra-ui/react';
import { QueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { memo, useEffect, useState } from 'react';
import { Standing, Tournament } from '../../../types/tournament';
import { useFinalResults } from '../../hooks/finalResults';
import { fetchLiveResults } from '../../lib/fetch/fetchLiveResults';
import { parseUsername } from '../../lib/strings';
import { shortenTournamentName } from '../../lib/tournament';
import { CommonCard } from '../common/CommonCard';
import { PlayerMatchupStatus } from '../Tournament/Results/PlayerMatchupStatus';

const queryClient = new QueryClient();

export const MyMostRecentResults = memo(
  ({ tournaments }: { tournaments: Tournament[] }) => {
    const session = useSession();
    const [currentLiveStanding, setCurrentLiveStanding] =
      useState<Standing | null>(null);
    const sessionUserName = session.data?.user.name;
    const { data: userResults } = useFinalResults({
      playerName: sessionUserName,
    });
    const mostRecentFinalizedResult = userResults?.at(0);
    const resultToShow: Standing | undefined =
      currentLiveStanding ?? mostRecentFinalizedResult;
    const resultToShowTournament = tournaments.find(
      ({ id }) => id === resultToShow?.tournamentId
    );

    useEffect(() => {
      const fetchLiveTournament = async () => {
        const liveTournaments = tournaments.filter(
          ({ tournamentStatus }) => tournamentStatus === 'running'
        );

        for (const tournament of liveTournaments) {
          const { data: liveResults } = await fetchLiveResults(tournament.id, {
            prefetch: true,
            load: { allRoundData: true },
          });
          queryClient.setQueryData(
            [`live-results`, tournament.id, 'roundData', sessionUserName],
            () =>
              fetchLiveResults(tournament.id, {
                prefetch: true,
                load: { roundData: sessionUserName },
              })
          );

          const foundStanding = liveResults.find(
            ({ name }) => name === sessionUserName
          );
          if (foundStanding) {
            setCurrentLiveStanding({
              ...foundStanding,
              tournamentId: tournament.id,
            });
          }
        }
      };

      fetchLiveTournament();
    }, [sessionUserName, tournaments]);

    return session.data?.user && resultToShow && resultToShowTournament ? (
      <CommonCard
        header={shortenTournamentName(resultToShowTournament)}
        slug={`/tournaments/${resultToShowTournament.id}/${parseUsername(
          session.data.user.email
        )}`}
      >
        <PlayerMatchupStatus
          tournament={resultToShowTournament}
          user={session.data?.user}
        />
      </CommonCard>
    ) : (
      <Skeleton height={63.9} />
    );
  }
);

MyMostRecentResults.displayName = 'MyMostRecentResults';
