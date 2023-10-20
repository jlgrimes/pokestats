import { dehydrate, QueryClient } from '@tanstack/react-query';
import { TournamentHomeView } from '../../../src/components/Tournament/Home/TournamentHomeView';
import { fetchOneTournamentMetadata } from '../../../src/hooks/tournamentMetadata';
import {
  fetchTournaments,
} from '../../../src/hooks/tournaments';
import { Tournament } from '../../../types/tournament';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { fetchPlayerProfile } from '../../../src/hooks/user';
import { fetchPlayerStandings } from '../../../src/hooks/newStandings';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

interface TournamentPageProps {
  tournament: Tournament;
}

export default function TournamentPage(props: TournamentPageProps) {
  return <TournamentHomeView tournament={props.tournament} />;
}

export async function getServerSideProps(ctx: GetServerSidePropsContext<{ id: string }>) {
  const queryClient = new QueryClient();

  
  const [tournament] = await fetchTournaments({
    tournamentId: ctx.params?.id,
    prefetch: true,
  });

  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const smartProfs = await fetchPlayerProfile({ email: session?.user.email });

  if (smartProfs) {
    await queryClient.setQueryData(['smart-player-profiles', { email: session?.user.email }], () => smartProfs);
    await queryClient.setQueryData(['smart-player-profiles', { name: session?.user.user_metadata.name }], () => smartProfs);

    await queryClient.prefetchQuery({
      queryKey: ['player-standings', smartProfs[0].id, tournament.id, true],
      queryFn: () => fetchPlayerStandings(smartProfs[0], { tournament: tournament, shouldLoadOpponentRounds: true })
    })
  }

  await queryClient.prefetchQuery({
    queryKey: ['tournament-metadata', tournament.id],
    queryFn: () => fetchOneTournamentMetadata(tournament.id),
  });

  return {
    props: {
      tournament,
      dehydratedState: dehydrate(queryClient),
    },
  };
}