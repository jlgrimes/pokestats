import { TournamentList } from '../../src/components/TournamentList/TournamentList';
import {
  fetchTournaments,
  usePatchedTournaments,
} from '../../src/hooks/tournaments';
import { Tournament } from '../../types/tournament';

export default function TournamentPage({
  tournaments,
}: {
  tournaments: Tournament[];
}) {
  const { data: patchedTournaments } = usePatchedTournaments(tournaments);

  return <TournamentList tournaments={patchedTournaments ?? tournaments} />;
}

export async function getStaticProps() {
  const tournaments = await fetchTournaments({ prefetch: true, excludeUpcoming: true });

  return {
    props: {
      tournaments,
    },
    revalidate: 60,
  };
}
