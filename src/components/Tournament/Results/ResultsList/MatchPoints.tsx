import { Badge, Bold } from "@tremor/react";
import { Standing } from "../../../../../types/tournament"

interface MatchPointsProps {
  standing: Standing;
}

export const MatchPoints = (props: MatchPointsProps) => {
  const numMatchPoints = props.standing.record.wins * 3 + props.standing.record.ties;
  const getColor = () => {
    if (numMatchPoints < 19) return 'slate';
    return numMatchPoints % 2 === 0 ? 'green' : 'sky';
  }

  return <Badge color={getColor()}><Bold>{numMatchPoints}</Bold></Badge>

  return <Bold>{numMatchPoints}</Bold>
}