import { useQuery } from '@tanstack/react-query';
import supabase from '../../../../lib/supabase/client';
import { AgeDivision } from '../../../../../types/age-division';
import { Tournament } from '../../../../../types/tournament';
import { capitalize } from '../../../../lib/strings';
import { Card, CategoryBar, Flex, Icon, Legend, Subtitle, Text, Title } from '@tremor/react';
import { getTournamentRoundSchema } from '../../../../lib/tournament';
import {
  getPropsForMatchPointCutoffVisualization,
  MatchPointVizReturnType,
} from './helpers';
import { Box } from '@chakra-ui/react';
import { CalculatorIcon } from '@heroicons/react/outline';

const humanizeMatchPoints = (
  points: number,
  tournament: Tournament,
  ageDivision: AgeDivision
) => {
  const roundSchema = getTournamentRoundSchema(tournament, ageDivision);

  let totalRounds = 0;
  // TODO: FIX FOR SENIORS AND JUNIORS
  if (ageDivision !== 'masters' || points < 19) {
    totalRounds = roundSchema?.rounds.dayOneSwissRounds ?? 0;
  } else {
    totalRounds =
      (roundSchema?.rounds.dayOneSwissRounds ?? 0) +
      (roundSchema?.rounds.dayTwoSwissRounds ?? 0);
  }

  const wins = Math.floor(points / 3);
  const ties = points % 3;
  const losses = totalRounds - wins - ties;

  return `${wins}-${losses}-${ties}`;
};

const fetchPlacementCutoffs = async (
  tournamentId: string,
  ageDivision: AgeDivision
) => {
  const res = await supabase
    .from('match_point_cutoffs')
    .select('match_points,cutoff_placing')
    .eq('tournament_id', parseInt(tournamentId))
    .eq('age_division', capitalize(ageDivision))
    .order('cutoff_placing', { ascending: false });

  if (!res.data) return;

  return res.data;
};

const usePlacementCutoffs = (
  tournamentId: string,
  ageDivision: AgeDivision
) => {
  return useQuery({
    queryKey: ['placement-cutoffs'],
    queryFn: () => fetchPlacementCutoffs(tournamentId, ageDivision),
  });
};

interface MatchPointsStatsProps {
  tournament: Tournament;
  ageDivision: AgeDivision;
}

const getWidthRatios = ({
  onTheBubble,
  onTheBubbleMatchPoints,
  safe,
  safeMatchPoints,
}: MatchPointVizReturnType) => {
  if (onTheBubble === null) return [0.5, 0.5];

  const shrinkRatio =
    Math.min(0.9, (onTheBubble[1] - onTheBubble[0]) / (safe[1] - onTheBubble[0]));
  return [0.2, shrinkRatio, 1 - shrinkRatio];
};

const convertMatchPointThingToTremor = ({
  onTheBubble,
  onTheBubbleMatchPoints,
  safe,
  safeMatchPoints,
}: MatchPointVizReturnType) => {
  if (onTheBubble === null) return [50, 50];
  const shrinkRatio =
    (onTheBubble[1] - onTheBubble[0]) / (safe[1] - onTheBubble[0]);
  return [20, shrinkRatio * 80, 80 - shrinkRatio * 80];
};

const convertMatchPointThingToTremorBarVal = (
  {
    onTheBubble,
    onTheBubbleMatchPoints,
    safe,
    safeMatchPoints,
  }: MatchPointVizReturnType,
  placementTier: number
) => {
  if (!onTheBubble) return 50;
  const shrinkRatio =
    (placementTier - onTheBubble[0]) / (safe[1] - onTheBubble[0]);
  return 20 + shrinkRatio * 80;
};

export const MatchPointsStats = (props: MatchPointsStatsProps) => {
  const { data: placementDividedCutoffs } = usePlacementCutoffs(
    props.tournament.id,
    props.ageDivision
  );
  let parsed = placementDividedCutoffs
    ? getPropsForMatchPointCutoffVisualization(placementDividedCutoffs)
    : {};
  const shouldHide1k = !props.tournament.name
    .toLowerCase()
    .includes('international');

  return (
    <Card>
      <Flex>
        <div>
          <Title>Match Point Breakdown</Title>
          <Subtitle className='mb-4'>{props.tournament.name}</Subtitle>
        </div>
        <Icon variant="solid" icon={CalculatorIcon} color={'neutral'} />
      </Flex>
      {Object.entries(parsed)
        .slice(0, shouldHide1k ? Object.entries(parsed).length - 1 : -1)
        .map(
          ([
            placementTier,
            { onTheBubble, onTheBubbleMatchPoints, safe, safeMatchPoints },
          ]) => (
            <Flex key={Math.random()} className='mb-6 flex'>
              <Text className='w-1/4'>Top {placementTier}</Text>
              <div className='w-3/4'>
                <div className='mb-2 flex flex-1 w-full text-center'>
                  {onTheBubble && onTheBubbleMatchPoints ? (
                    <>
                      <Box width={'20%'}>
                        <Text>{onTheBubbleMatchPoints - 1}</Text>
                      </Box>
                      <Box
                        width={`${(
                          getWidthRatios({
                            onTheBubble,
                            onTheBubbleMatchPoints,
                            safe,
                            safeMatchPoints,
                          })[1] * 100
                        ).toFixed(2)}%`}
                      >
                        <Text>{onTheBubbleMatchPoints}</Text>
                      </Box>
                      {onTheBubble[1] !== safe[1] && (
                        <Box
                          width={`${(
                            getWidthRatios({
                              onTheBubble,
                              onTheBubbleMatchPoints,
                              safe,
                              safeMatchPoints,
                            })[2] * 100
                          ).toFixed(2)}%`}
                        >
                          <Text>{safeMatchPoints}</Text>
                        </Box>
                      )}
                    </>
                  ) : (
                    <>
                      <Flex className='w-1/2 flex-col'>
                        <Text className='w-1/2'>{safeMatchPoints - 1}</Text>
                        <Text className='w-1/2 text-xs text-slate-400'>
                          {humanizeMatchPoints(
                            safeMatchPoints - 1,
                            props.tournament,
                            props.ageDivision
                          )}
                        </Text>
                      </Flex>
                      <Text className='w-1/2'>{safeMatchPoints}</Text>
                    </>
                  )}
                </div>
                <CategoryBar
                  className='[&>.tremor-CategoryBar-labels]:hidden'
                  values={
                    !onTheBubble
                      ? [50, 50]
                      : convertMatchPointThingToTremor({
                          onTheBubble,
                          onTheBubbleMatchPoints,
                          safe,
                          safeMatchPoints,
                        })
                  }
                  colors={
                    !onTheBubble
                      ? ['rose', 'emerald']
                      : ['rose', 'yellow', 'emerald']
                  }
                  markerValue={
                    onTheBubble
                      ? convertMatchPointThingToTremorBarVal(
                          {
                            onTheBubble,
                            onTheBubbleMatchPoints,
                            safe,
                            safeMatchPoints,
                          },
                          parseInt(placementTier)
                        )
                      : 51
                  }
                />
              </div>
            </Flex>
          )
        )}
    <Legend
        className="mt-3"
        categories={["Out", "On the bubble", "Safe"]}
        colors={["red", "amber", "green"]}
      />
    </Card>
  );
};
