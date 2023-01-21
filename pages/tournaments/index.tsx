import { useEffect, useState } from 'react';
import { TournamentList } from '../../src/components/TournamentList/TournamentList';
import { fetchTournaments } from '../../src/hooks/tournaments';
import { patchTournamentsClient } from '../../src/lib/patches';
import { Tournament } from '../../types/tournament';

export default function TournamentPage({
  tournaments,
}: {
  tournaments: Tournament[];
}) {
  const [patchedTournaments, setPatchedTournaments] = useState(tournaments);

  useEffect(() => {
    patchTournamentsClient(patchedTournaments, (tournies: Tournament[]) =>
      setPatchedTournaments(tournies)
    );
  }, []);

  return <TournamentList tournaments={patchedTournaments} />;
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
