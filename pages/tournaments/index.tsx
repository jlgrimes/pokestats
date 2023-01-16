import { TournamentList } from '../../src/components/TournamentList/TournamentList';
import { fetchTournaments } from '../../src/hooks/tournaments';
import { Tournament } from '../../types/tournament';

export default function TournamentPage({
  tournaments,
}: {
  tournaments: Tournament[];
}) {
  return <TournamentList tournaments={tournaments} />;
}

export async function getStaticProps() {
  const tournaments = await fetchTournaments({ prefetch: true });

  return {
    props: {
      tournaments,
    },
    revalidate: 60,
  };
}
