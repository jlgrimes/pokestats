import { QueryClient, dehydrate } from "@tanstack/react-query";
import { VgcTournament, fetchVgcTournaments } from "../../src/vgc/tournaments/useVgcTournaments";
import { VgcTournamentList } from "../../src/vgc/tournaments/VgcTournamentList";
import { Ad } from "../../src/components/Ad";

export default function Home({ tournaments }: { tournaments: VgcTournament[] }) {
  return (
    <div className="flex flex-col gap-4">
      <Ad key='9764859740' />
      <VgcTournamentList tournaments={tournaments} />
    </div>
  );
}

export async function getStaticProps() {
  const tournaments = await fetchVgcTournaments();
  const queryClient = new QueryClient();

  return {
    props: {
      tournaments,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}
