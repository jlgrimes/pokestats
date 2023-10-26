import { GetStaticPropsContext } from "next";
import { VgcStanding, fetchVgcStandings } from "../../../../../src/vgc/standings/useVgcStandings";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { Ad } from "../../../../../src/components/Ad";
import { VgcStandingList } from "../../../../../src/vgc/standings/VgcStandingList";
import { VgcTournament, fetchVgcTournament, fetchVgcTournaments } from "../../../../../src/vgc/tournaments/useVgcTournaments";
import { AgeDivision } from "../../../../../types/age-division";
import { AgeDivisionSelector } from "../../../../../src/components/Tournament/AgeDivisionSelector";
import { shortenTournamentName } from "../../../../../src/lib/tournament";
import { Tournament } from "../../../../../types/tournament";
import { Badge, Flex, Subtitle, Text } from "@tremor/react";
import { Switch } from "@chakra-ui/react";
import { useState } from "react";

export default function VgcStandings({ standings, tournament }: { standings: VgcStanding[], tournament: VgcTournament }) {
  const [shouldShowMatchPoints, setShouldShowMatchPoints] = useState(false);

  return (
    <div className="flex flex-col">
      <Ad key='3467044708' height='50px' />
      <h1 className="text-xl font-bold leading-snug text-slate-700 ml-1">
          {`${shortenTournamentName(tournament as unknown as Tournament)} Standings`}
          <Badge className="ml-2" color='pink'>VGC</Badge>
      </h1>
      <Subtitle className="mt-2">Standings are unofficial and may be inaccurate.</Subtitle>
      <Flex className='gap-2'>
        <div>
          <AgeDivisionSelector urlConstructor={(division) => `/vgc/tournaments/${tournament.id}/${division}`} />
        </div>
        <div className='flex gap-2'>
          <Text className='text-xs'>
            Match points
          </Text>
          <Switch onChange={e => setShouldShowMatchPoints(e.currentTarget.checked)} />
        </div>
      </Flex>
      <VgcStandingList standings={standings} shouldShowMatchPoints={shouldShowMatchPoints} />
    </div>
  );
}

export async function getStaticProps(ctx: GetStaticPropsContext<{ id: string, division: string }>) {
  if (!ctx.params?.id || !ctx.params?.division) {
    return {
      props: {
        standings: [],
        tournamentId: -1
      }
    }
  }

  const standings = await fetchVgcStandings(parseInt(ctx.params.id), ctx.params.division as AgeDivision);
  const tournament = await fetchVgcTournament(parseInt(ctx.params.id));
  const queryClient = new QueryClient();

  return {
    props: {
      standings,
      tournament,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const tournaments = await fetchVgcTournaments();
  const tournamentsWithDivisions = [
    ...tournaments.map((tournament) => ({
      params: {
        id: tournament.id.toString(),
        division: 'masters'
      }
    })),
    ...tournaments.map((tournament) => ({
      params: {
        id: tournament.id.toString(),
        division: 'seniors'
      }
    })),
    ...tournaments.map((tournament) => ({
      params: {
        id: tournament.id.toString(),
        division: 'juniors'
      }
    }))
  ]

  return {
    paths: tournamentsWithDivisions,
    fallback: true
  }
}