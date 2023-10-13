import { useQuery } from "@tanstack/react-query"
import supabase from "../../../lib/supabase/client"
import { AgeDivision } from "../../../../types/age-division";
import { Tournament } from "../../../../types/tournament";
import { capitalize } from "../../../lib/strings";
import { Card, CategoryBar, Flex, Text } from "@tremor/react";
import { getTournamentRoundSchema } from "../../../lib/tournament";

const humanizeMatchPoints = (points: number, tournament: Tournament, ageDivision: AgeDivision) => {
  const roundSchema = getTournamentRoundSchema(tournament, ageDivision);

  let totalRounds = 0;
  // TODO: FIX FOR SENIORS AND JUNIORS
  if (ageDivision !== 'masters' || points < 19) {
    totalRounds = roundSchema?.rounds.dayOneSwissRounds ?? 0;
  } else {
    totalRounds = (roundSchema?.rounds.dayOneSwissRounds ?? 0) + (roundSchema?.rounds.dayTwoSwissRounds ?? 0);
  }

  const wins = Math.floor(points / 3);
  const ties = points % 3;
  const losses = totalRounds - wins - ties;

  return `${wins}-${losses}-${ties}`;
}

const placements = [1024, 512, 256, 128, 64, 32, 16, 8];

const fetchPlacementCutoffs = async (tournamentId: string, ageDivision: AgeDivision) => {
  const res = await supabase.from('match_point_cutoffs').select('match_points,cutoff_placing').eq('tournament_id', parseInt(tournamentId)).eq('age_division', capitalize(ageDivision)).order('cutoff_placing', { ascending: false });

  if (!res.data) return;

  let placementIdx = 0, placementDividedCutoffs = [];

  for (const cutoff of res.data) {
    if (placementIdx >= placements.length) break;

    if (cutoff.cutoff_placing < placements[placementIdx]) {
      placementDividedCutoffs.push({
        placementTier: placements[placementIdx],
        matchPoints: cutoff.match_points - 1,
        placementIdx
      });
      placementIdx += 1
    }
  }

  return placementDividedCutoffs;
}

const usePlacementCutoffs = (tournamentId: string, ageDivision: AgeDivision) => {
  return useQuery({
    queryKey: ['placement-cutoffs'],
    queryFn: () => fetchPlacementCutoffs(tournamentId, ageDivision)
  })
}

interface MatchPointsStatsProps {
  tournament: Tournament,
  ageDivision: AgeDivision;
}

export const MatchPointsStats = (props: MatchPointsStatsProps) => {
  const { data: placementDividedCutoffs } = usePlacementCutoffs(props.tournament.id, props.ageDivision)

  return (
    <Card>
      {placementDividedCutoffs?.toReversed().map(({ placementTier, matchPoints }) => (
        <div key={Math.random()}>
          <Flex>
            <Text>Top {placementTier}</Text>
            <Text>{`${humanizeMatchPoints(matchPoints, props.tournament, props.ageDivision)} (${matchPoints})`}</Text>
          </Flex>
          <CategoryBar
            values={[matchPoints - 1, matchPoints, 1]}
            colors={["orange", "yellow", "emerald"]}
            markerValue={matchPoints}
            className="mt-3"
          />
        </div>
      ))}
    </Card>
  );
}