import { GetStaticPropsContext } from "next";
import { VgcStanding, fetchVgcStandings } from "../../../../../src/vgc/standings/useVgcStandings";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { Ad } from "../../../../../src/components/Ad";
import { VgcStandingList } from "../../../../../src/vgc/standings/VgcStandingList";
import { VgcTournament, fetchVgcTournament, fetchVgcTournaments } from "../../../../../src/vgc/tournaments/useVgcTournaments";
import { AgeDivision } from "../../../../../types/age-division";
import { AgeDivisionSelector } from "../../../../../src/components/Tournament/AgeDivisionSelector";
import { Tournament } from "../../../../../types/tournament";
import { Badge, Flex, Subtitle, Text } from "@tremor/react";
import { Switch } from "@chakra-ui/react";
import { useState } from "react";

const shortenTournamentName = (tournament: VgcTournament) => {
  const nameSplit = tournament.name.split(' ');
  const numRegex = new RegExp(/^[0-9]*$/);
  return nameSplit.filter((phrase) => !(phrase === 'Pokémon' || phrase === 'VGC' || numRegex.test(phrase))).join(' ')
};

export default function VgcStandings({ standings, tournament }: { standings: VgcStanding[], tournament: VgcTournament | null }) {
  const [shouldShowMatchPoints, setShouldShowMatchPoints] = useState(false);

  if (!tournament) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <Ad key='3467044708' height='50px' />
      <h1 className="text-xl font-bold leading-snug text-slate-700 ml-1">
          {`${shortenTournamentName(tournament)} Standings`}
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
      {tournament.tournamentStatus === 'not-started' ? (
        <Text className="mt-4">
          Tournament has not started yet. Come back later!
        </Text>
      ) : <VgcStandingList standings={standings} shouldShowMatchPoints={shouldShowMatchPoints} />}
    </div>
  );
}

export async function getStaticProps({ params }: { params: { id: string, division: string } }) {
  const standings = await fetchVgcStandings(parseInt(params.id), params.division as AgeDivision);
  const tournament = await fetchVgcTournament(parseInt(params.id));
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
    ...tournaments.filter((tournament) => tournament.tournamentStatus !== 'finished' || tournament.players.masters > 0).map((tournament) => ({
      params: {
        id: tournament.id.toString(),
        division: 'masters'
      }
    })),
    ...tournaments.filter((tournament) => tournament.tournamentStatus !== 'finished' || tournament.players.seniors > 0).map((tournament) => ({
      params: {
        id: tournament.id.toString(),
        division: 'seniors'
      }
    })),
    ...tournaments.filter((tournament) => tournament.tournamentStatus !== 'finished' || tournament.players.juniors > 0).map((tournament) => ({
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