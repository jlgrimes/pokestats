import { useQuery } from "@tanstack/react-query"
import supabase from "../../../lib/supabase/client"
import { AgeDivision } from "../../../../types/age-division";
import { Tournament } from "../../../../types/tournament";
import { capitalize } from "../../../lib/strings";

const placements = [1024, 512, 256, 128, 64, 32, 16, 8];

const fetchPlacementCutoffs = async (tournamentId: string, ageDivision: AgeDivision) => {
  const res = await supabase.from('match_point_cutoffs').select('match_points,cutoff_placing').eq('tournament_id', parseInt(tournamentId)).eq('age_division', capitalize(ageDivision)).order('cutoff_placing', { ascending: false });

  if (!res.data) return;
  console.log(res.data)

  let placementIdx = 0, placementDividedCutoffs = [];

  for (const cutoff of res.data) {
    if (placementIdx >= placements.length) break;

    if (cutoff.cutoff_placing < placements[placementIdx]) {
      placementDividedCutoffs.push({
        placmentTier: placements[placementIdx],
        matchPoints: cutoff.match_points - 1
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
  console.log(placementDividedCutoffs)

  return null;
}