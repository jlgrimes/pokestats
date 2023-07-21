import { Stack, Text } from "@chakra-ui/react";
import { useLeaderboard } from "../../hooks/leaderboards/useLeaderboard";
import { PlayerPointsCard } from "./PlayerPointsCard";

interface TopPlayersList {
  season: number;
  isCompact: boolean;
}

export const TopPlayersList = (props: TopPlayersList) => {
  const { data: topPlayers } = useLeaderboard(props.season, props.isCompact);
  console.log(topPlayers)

  return (
    <Stack>
      {topPlayers?.map((player) => <PlayerPointsCard key={player.name + player.points} player={player} />)}
    </Stack>
  )
}