import { useQuery } from "@tanstack/react-query"
import supabase from "../../../../lib/supabase/client"
import { AgeDivision } from "../../../../../types/age-division";
import { Tournament } from "../../../../../types/tournament";
import { capitalize } from "../../../../lib/strings";
import { Card, CategoryBar, Flex, Text } from "@tremor/react";
import { getTournamentRoundSchema } from "../../../../lib/tournament";

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

    if (cutoff.cutoff_placing === placements[placementIdx]) {
      placementDividedCutoffs.push({
        placementTier: placements[placementIdx],
        matchPoints: cutoff.match_points,
        placementIdx,
        cleanCut: true
      });
      placementIdx += 1
    } else if (cutoff.cutoff_placing < placements[placementIdx]) {
      placementDividedCutoffs.push({
        placementTier: placements[placementIdx],
        matchPoints: cutoff.match_points - 1,
        placementIdx,
        cleanCut: false
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
  let { data: placementDividedCutoffs } = usePlacementCutoffs(props.tournament.id, props.ageDivision)
  console.log(placementDividedCutoffs)
  placementDividedCutoffs = placementDividedCutoffs?.map((thing, idx) => idx === 3 ? ({...thing, cleanCut: true }) : thing)

  const getSpaceForTremorBars = (placementIdx: number) => {
    const lowestPlacement = placementIdx
    
    const onTheBubbleLength = 0;
    const placementTierCutoffValue = 0;
  }

  return (
    <Card>
      {placementDividedCutoffs?.toReversed().map(({ placementTier, placementIdx, matchPoints, cleanCut }) => (
        <div key={Math.random()} className='mb-8'>
          <Flex className="mb-4">
            <Text>Top {placementTier}</Text>
            <Text>{`${humanizeMatchPoints(matchPoints, props.tournament, props.ageDivision)} (${matchPoints})`}</Text>
          </Flex>
          <Flex className="mb-2">
            <Text>{matchPoints - 1}</Text>
            <Text>{matchPoints}</Text>
            {!cleanCut && <Text>{matchPoints + 1}</Text>}
          </Flex>
          <CategoryBar
            className="[&>.tremor-CategoryBar-labels]:hidden"
            values={cleanCut ? [50, 50] : [20, 60, 20]}
            colors={cleanCut ? ['rose', 'emerald'] : ["rose", "yellow", "emerald"]}
          />
        </div>
      ))}
    </Card>
  );
}