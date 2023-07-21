import { Stack, Text } from "@chakra-ui/react";
import { useLeaderboard } from "../../hooks/leaderboards/useLeaderboard";

interface TopPlayersList {
  isCompact: boolean;
}

export const TopPlayersList = (props: TopPlayersList) => {
  const { data: topPlayers } = useLeaderboard(46, props.isCompact);

  return (
    <Stack>
      {topPlayers?.map((player) => <Text>{player.name}</Text>)}
    </Stack>
  )
}