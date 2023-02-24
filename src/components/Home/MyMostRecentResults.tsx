import { CardBody, Skeleton } from '@chakra-ui/react';
import { QueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { memo, useEffect, useState } from 'react';
import { Standing, Tournament } from '../../../types/tournament';
import { useFinalResults } from '../../hooks/finalResults/finalResults';
import { fetchLiveResults } from '../../lib/fetch/fetchLiveResults';
import { parseUsername } from '../../lib/strings';
import { CommonCard } from '../common/CommonCard';
import { PlayerMatchupStatus } from '../Tournament/Results/PlayerMatchupStatus';
import { StoredPlayerProfile } from '../../../types/player';

const queryClient = new QueryClient();

export const MyMostRecentResults = memo(
  ({ tournaments }: { tournaments: Tournament[] }) => {
    const session = useSession();
    const [currentLiveStanding, setCurrentLiveStanding] =
      useState<Standing | null>(null);
    const sessionUserName = session.data?.user?.name;
    const { data: userResults } = useFinalResults({
      playerName: sessionUserName ?? undefined,
    });
    const mostRecentFinalizedResult = userResults?.at(0);
    const resultToShow: Standing | undefined =
      currentLiveStanding ?? mostRecentFinalizedResult;
    const resultToShowTournament = tournaments.find(
      ({ id }) => id === resultToShow?.tournamentId
    );
    const loaded = session.data?.user && resultToShow && resultToShowTournament;

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
            [`live-results`, tournament.id, 'allRoundData', true],
            () =>
              fetchLiveResults(tournament.id, {
                prefetch: true,
                load: { allRoundData: true },
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

    return (
      <CommonCard
        loading={!loaded}
        header={loaded ? resultToShowTournament.name : 'loading'}
        slug={
          loaded
            ? `/tournaments/${resultToShowTournament.id}/${parseUsername(
                session.data.user?.email ?? ''
              )}`
            : '/'
        }
      >
        <CardBody padding={0}>
          {loaded ? (
            <PlayerMatchupStatus
              tournament={resultToShowTournament}
              user={session.data.user as StoredPlayerProfile}
            />
          ) : (
            <Skeleton height={63.9} />
          )}
        </CardBody>
      </CommonCard>
    );
  }
);

MyMostRecentResults.displayName = 'MyMostRecentResults';
