import { dehydrate, QueryClient } from '@tanstack/react-query';
import TournamentView from '../../../src/components/Tournament/TournamentView';
import { TournamentPageLayout } from '../../../src/components/Tournament/TournamentPageLayout';
import { fetchLiveResults } from '../../../src/lib/fetch/fetchLiveResults';
import { fetchPokedex } from '../../../src/hooks/images';
import { fetchTournaments } from '../../../src/hooks/tournaments';
import { Tournament } from '../../../types/tournament';
import { fetchArchetypes } from '../../../src/hooks/deckArchetypes';
import { getPatchedTournament } from '../../../src/lib/patches';
import { fetchTournamentMetadata } from '../../../src/hooks/tournamentMetadata';

export default function TournamentPage({
  tournament,
}: {
  tournament: Tournament;
}) {
  return (
    <TournamentPageLayout tournament={tournament}>
      <TournamentView tournament={tournament} />
    </TournamentPageLayout>
  );
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const [tournament] = await fetchTournaments({
    tournamentId: params.id,
    prefetch: true,
  });

  return {
    props: {
      tournament,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const tournaments = await fetchTournaments({
    prefetch: true,
    excludeUpcoming: true,
  });
  const paths = tournaments?.map(tournament => {
    return {
      params: {
        id: tournament.id,
        displayName: tournament.name,
      },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
}
