import { Card, Grid, HStack, Text } from "@chakra-ui/react";
import { PlayerOnLeaderboard } from "../../hooks/leaderboards/useLeaderboard"
import { CommonCard } from "../common/CommonCard";

interface PlayerPointsCardProps {
  player: PlayerOnLeaderboard;
}

export const PlayerPointsCard = (props: PlayerPointsCardProps) => {
  return (
    <CommonCard>
      <Grid>
        <Text fontSize='lg' fontWeight='semibold'>{props.player.name}</Text>
        <Text>{props.player.points} CP</Text>
      </Grid>
    </CommonCard>
  )
}