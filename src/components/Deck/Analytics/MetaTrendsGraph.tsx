import { AreaChart, Card, Subtitle, Title } from "@tremor/react"
import { Deck } from "../../../../types/tournament";
import { useDeckMetaShare } from "../../../hooks/finalResults/useStoredDecks";
import { useMemo } from "react";
import { format, parseISO } from "date-fns";

interface MetaTrendsGraph {
  deck: Deck;
}


export const MetaTrendsGraph = (props: MetaTrendsGraph) => {
  const { data: metaShare } = useDeckMetaShare(props.deck.id, 'masters');

  const totalDecks = useMemo(() => metaShare?.reduce((acc, share) => acc + (share.count ?? 0), 0) ?? 0, [metaShare]);
  const totalDay2Decks = useMemo(() => metaShare?.reduce((acc, share) => acc + (share.day_two_count ?? 0), 0) ?? 0, [metaShare]);

  const chartData = metaShare?.map((share) => ({
    date: share.tournament_date?.end ? format(parseISO(share.tournament_date?.end), 'LLL d') : 'Jan 1',
    'Day 1 share': (share.count ?? 0) / totalDecks,
    'Day 2 share': (share.day_two_count) ? (share.day_two_count / totalDay2Decks) : 0,
    'Day 2 conversion': (share.count && share.day_two_count) ? (share.day_two_count / share.count) : 0,
  }));

  const valueFormatter = (number: number) => `${(number * 100).toFixed(0)}%`;

  if (!chartData) return null;

  return (
    <Card>
      <Title>Metagame analysis</Title>
      <Subtitle>{props.deck.name}</Subtitle>
      <AreaChart
        className="h-72 mt-4"
        data={chartData}
        index="date"
        categories={["Day 1 share", "Day 2 share", "Day 2 conversion"]}
        colors={["indigo", "cyan", "rose"]}
        valueFormatter={valueFormatter}
      />
    </Card>
  )
}