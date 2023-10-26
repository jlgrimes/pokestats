import { GetStaticPropsContext } from "next";
import { VgcStanding, fetchVgcStandings } from "../../../../src/vgc/standings/useVgcStandings";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { Ad } from "../../../../src/components/Ad";
import { VgcStandingList } from "../../../../src/vgc/standings/VgcStandingList";
import { fetchVgcTournaments } from "../../../../src/vgc/tournaments/useVgcTournaments";

export default function VgcStandings({ standings }: { standings: VgcStanding[] }) {
  return (
    <div className="flex flex-col gap-4">
      <Ad key='3467044708' />
      <VgcStandingList standings={standings} />
    </div>
  );
}

export async function getStaticProps(ctx: GetStaticPropsContext<{ id: string }>) {
  if (!ctx.params?.id) {
    return {
      props: {
        standings: []
      }
    }
  }

  const standings = await fetchVgcStandings(parseInt(ctx.params?.id));
  const queryClient = new QueryClient();

  return {
    props: {
      standings,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const tournaments = await fetchVgcTournaments();

  return {
    paths: tournaments?.map((tournament) => ({
      params: {
        id: tournament.id.toString()
      }
    })),
    fallback: true
  }
}