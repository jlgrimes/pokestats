import { ResponsivePie } from '@nivo/pie';
import { useDay2Decks } from '../../../hooks/day2decks';
import { getArchetypeGraphData } from './helpers';

const MyResponsivePie = ({
  data /* see data tab */,
}: {
  data: Record<string, any>[];
}) => (
  <ResponsivePie
    data={data}
    margin={{ top: 40, right: 0, bottom: 80, left: 0 }}
    innerRadius={0.5}
    padAngle={0.7}
    cornerRadius={3}
    activeOuterRadiusOffset={8}
    borderWidth={1}
    borderColor={{
      from: 'color',
      modifiers: [['darker', 0.2]],
    }}
    arcLabel={({ id, value }) => `${id}`}
    arcLabelsTextColor="#333333"
    arcLabelsSkipAngle={10}
    enableArcLinkLabels={false}
    arcLinkLabelsSkipAngle={10}
    sortByValue
  />
);

export const ArchetypeGraph = ({
  tournament,
}: {
  tournament: { id: string; name: string };
}) => {
  const { data: day2Decks } = useDay2Decks(tournament.id);
  return (
    <div style={{ height: '450px' }}>
      <MyResponsivePie data={getArchetypeGraphData(day2Decks)} />
    </div>
  );
};
