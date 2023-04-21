import { Box, Button, Stack, StackItem, Switch, Text } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { DateRangeSlider } from '../../src/components/Deck/Analytics/Filter/DateRangeSlider';
import { TournamentSlider } from '../../src/components/Deck/Analytics/Filter/TournamentSlider';
import { MetaGameShareList } from '../../src/components/Deck/Analytics/MetaGameShare/MetaGameShareList';
import { fixPercentage } from '../../src/components/Deck/ListViewer/CardViewer.tsx/helpers';
import {
  fetchTournaments,
  getMostRecentFinishedTournament,
} from '../../src/hooks/tournaments';
import { Tournament } from '../../types/tournament';
import { fetchArchetypes } from '../../src/hooks/deckArchetypes';
import { getMostRecentCompletedTournamentIdx } from '../../src/lib/tournament';
import { useRouter } from 'next/router';
import { CommonCard } from '../../src/components/common/CommonCard';
import { findTournament } from '../../src/components/Deck/Analytics/Filter/helpers';
import { formatTournamentDate } from '../../src/components/TournamentList/helpers';
import { TournamentSelector } from '../../src/components/Deck/TournamentSelector';

export default function DecksPage({
  defaultTournamentRange,
  tournaments,
}: {
  defaultTournamentRange: number[];
  tournaments: Tournament[] | undefined;
}) {
  const mostRecentCompletedTournament = parseInt(
    getMostRecentFinishedTournament(tournaments ?? []).id ?? 0
  );
  const [tournamentRange, setTournamentRange] = useState([
    mostRecentCompletedTournament,
    mostRecentCompletedTournament,
  ]);
  const [sortByMoves, setSortByMoves] = useState(false);
  const [showRange, setShowRange] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.query.tournament) {
      const tournamentId = parseInt(
        Array.isArray(router.query.tournament)
          ? router.query.tournament[0]
          : router.query.tournament
      );
      setTournamentRange([tournamentId, tournamentId]);
    }
  }, [router.query.tournament]);

  useEffect(() => {
    router.replace({
      query: {
        ...router.query,
        tournament: `${tournamentRange[0]}`.padStart(7, '0'),
      },
    });
  }, [tournamentRange]);

  //   <Heading size='lg' noOfLines={3} color='gray.700'>
  //   {
  //     (findTournament(tournamentFilter, tournaments) as Tournament)
  //       .name
  //   }
  // </Heading>
  // <Heading size='md' noOfLines={1} color='gray.500'>
  //   {formatTournamentDate(
  //     findTournament(tournamentFilter, tournaments) as Tournament
  //   )}
  // </Heading>

  const tournament = findTournament(tournamentRange[0], tournaments);

  return (
    <>
      {/* <StackItem>
        <Switch
          checked={sortByMoves}
          onChange={() => setSortByMoves(!sortByMoves)}
        >
          Sort by biggest moves
        </Switch>
        {showRange ? (
          <DateRangeSlider
            tournamentFilter={tournamentRange}
            setTournamentFilter={setTournamentRange}
            defaultTournamentRange={defaultTournamentRange}
            tournaments={tournaments}
          />
        ) : (
          <TournamentSlider
            tournamentFilter={tournamentRange[0]}
            setTournamentFilter={num => setTournamentRange([num, num])}
            defaultTournamentRange={defaultTournamentRange}
            tournaments={tournaments}
          />
        )}
      </StackItem> */}
      {/* <OptionsMenu>
        <Switch></Switch>
      </OptionsMenu> */}
      <Stack>
        <TournamentSelector
          tournaments={tournaments}
          currentTournament={tournament}
          setTournament={tournament =>
            setTournamentRange([
              parseInt(tournament.id),
              parseInt(tournament.id),
            ])
          }
        />
        {tournament && (
          <MetaGameShareList
            tournament={tournament}
            sortByMoves={sortByMoves}
            shouldHideSlug
          />
        )}
        <Box paddingX={4} paddingTop={4}>
          Includes all reported and RK9 confirmed decks for day two of the
          tournament. Reported decks may be inaccurate.
        </Box>
      </Stack>
    </>
  );
}

export async function getStaticProps() {
  const tournaments = await fetchTournaments({
    prefetch: true,
    onlyFinished: true,
  });

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['deck-archetypes'],
    queryFn: () => fetchArchetypes(),
  });

  return {
    props: {
      defaultTournamentRange: [
        parseInt(tournaments[tournaments.length - 1].id),
        parseInt(tournaments[0].id),
      ],
      tournaments,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}
