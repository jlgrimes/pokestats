import { Badge, Bold } from "@tremor/react";
import { Standing } from "../../../../../types/tournament"

interface MatchPointsProps {
  standing: Standing;
}

export const MatchPoints = (props: MatchPointsProps) => {
  const numMatchPoints = props.standing.record.wins * 3 + props.standing.record.ties;
  const getColor = () => {
    return numMatchPoints % 4 === 0 ? 'fuchsia' : numMatchPoints % 4 === 1 ? 'green' : numMatchPoints % 4 === 2 ? 'sky' : 'amber';
  }

  return <Badge color={getColor()}><Bold>{numMatchPoints}</Bold></Badge>

  return <Bold>{numMatchPoints}</Bold>
}