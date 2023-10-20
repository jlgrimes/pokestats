import { dehydrate, QueryClient, useQueryClient } from '@tanstack/react-query';
import { formatDistance, isBefore } from 'date-fns';
import { ComingSoonPage } from '../src/components/ComingSoonPage';
import { HomePage } from '../src/components/Home/HomePage';
import { fetchTournamentMetadata } from '../src/hooks/tournamentMetadata';
import {
  fetchTournaments,
} from '../src/hooks/tournaments';
import { SHOULD_SHOW_COMING_SOON } from '../src/lib/coming-soon';
import { Tournament } from '../types/tournament';
import { fetchChampions } from '../src/hooks/newStandings';

export default function Home({ tournaments }: { tournaments: Tournament[] }) {
  if (
    SHOULD_SHOW_COMING_SOON &&
    isBefore(new Date(), new Date('2023-03-10T14:00:00-0500'))
  ) {
    return <ComingSoonPage />;
  }

  return (
    <>
      {/* <Script src='https://platform.twitter.com/widgets.js' /> */}
      <HomePage tournaments={tournaments} />
    </>
  );
}

export async function getServerSideProps() {
  const tournaments = await fetchTournaments({ prefetch: true });

  // const mostRecentFinishedTournament =
  //   getMostRecentFinishedTournament(tournaments);

  // await queryClient.prefetchQuery({
  //   queryKey: ['decks-with-lists', mostRecentFinishedTournament.id, false],
  //   queryFn: () => fetchDecksWithLists(mostRecentFinishedTournament.id),
  // });

  return {
    props: {
      tournaments,
    },
  };
}
