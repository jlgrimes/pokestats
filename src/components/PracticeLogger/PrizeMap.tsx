import { LineChart, Text } from "@tremor/react"
import { GameLog } from "./useGameLogs"
import { useMemo } from "react";
import { GameTurn, getCurrentNumPrizes, getTurnNumber } from "./helpers";

interface PrizeMapProps {
  gameLog: GameLog;
}

interface PrizeMapChartDataPoint {
  turnNumber: number;
  'You': number;
  'Opponent': number;
}

export const PrizeMap = (props: PrizeMapProps) => {
  const chartdata = useMemo(() => {
    return props.gameLog.log.reduce((acc: PrizeMapChartDataPoint[], curr: GameTurn, idx) => {
      if (curr.whoseTurn === 'nobodys-turn') return acc;

      const turnNumber = getTurnNumber(curr) ?? 0;

      return [
        ...acc,
        {
          turnNumber,
          'You': curr.prizesTaken.you + (acc.length > 0 ? acc[acc.length - 1].You : 0),
          'Opponent': curr.prizesTaken.opp + (acc.length > 0 ? acc[acc.length - 1].Opponent : 0)
        }
      ]
    }, []);
  }, [props.gameLog.log]);

  return (
    <div>
      <Text className="font-bold">Prizes taken over turns</Text>
      <LineChart
        className="h-48 mt-2"
        data={chartdata}
        index="turnNumber"
        yAxisWidth={30}
        categories={['You', 'Opponent']}
        colors={['blue', 'red']}
        maxValue={6}
        showAnimation
        curveType='step'
      />
    </div>
  )
}