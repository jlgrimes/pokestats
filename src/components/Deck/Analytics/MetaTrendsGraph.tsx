import { AreaChart, Card, Flex, Icon, Subtitle, Title } from "@tremor/react"
import { Deck } from "../../../../types/tournament";
import { useDeckMetaShare } from "../../../hooks/finalResults/useStoredDecks";
import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { DeckTypeSchema } from "../../../hooks/deckArchetypes";
import { ClockIcon } from "@heroicons/react/outline";

interface MetaTrendsGraph {
  deck: Deck;
}


export const MetaTrendsGraph = (props: MetaTrendsGraph) => {
  const { data: metaShare } = useDeckMetaShare('masters');

  const chartData = metaShare?.filter((share) => share.id === props.deck.id)?.map((share) => {
    const totalDecks = metaShare.reduce((acc, curr: DeckTypeSchema) => {
      if (!curr.tournament_id || !curr.count || curr.tournament_id !== share.tournament_id) return acc;
      return acc + curr.count;
    }, 0);

    const totalDay2Decks = metaShare.reduce((acc, curr: DeckTypeSchema) => {
      if (!curr.tournament_id || !curr.day_two_count || curr.tournament_id !== share.tournament_id) return acc;
      return acc + curr.day_two_count;
    }, 0);

    return {
      date: share.tournament_date?.end ? format(parseISO(share.tournament_date?.end), 'LLL d') : 'Jan 1',
      'Day 1 usage': (share.count ?? 0) / totalDecks,
      'Day 2 usage': (share.day_two_count) ? (share.day_two_count / totalDay2Decks) : 0,
      'Day 2 conversion': (share.count && share.day_two_count) ? (share.day_two_count / share.count) : 0,
    }
  });

  const valueFormatter = (number: number) => `${(number * 100).toFixed(0)}%`;

  if (!chartData) return null;

  return (
    <Card>
      <Flex>
        <div>
          <Title>Metagame History</Title>
          <Subtitle>{props.deck.name}</Subtitle>
        </div>
        <Icon icon={ClockIcon} color='neutral' variant="solid" size="sm" />
      </Flex>
      <AreaChart
        className="h-72 mt-4"
        data={chartData}
        index="date"
        categories={["Day 1 usage", "Day 2 usage", "Day 2 conversion"]}
        colors={["indigo", "cyan", "rose"]}
        valueFormatter={valueFormatter}
      />
    </Card>
  )
}