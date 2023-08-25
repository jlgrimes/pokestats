import { Stack } from "@chakra-ui/react";
import { useMyLeaderboardStanding } from "../../hooks/leaderboards/useLeaderboard";
import { ComponentLoader } from "../common/ComponentLoader";
import { PlayerPointsCard } from "./PlayerPointsCard";

interface MyLeaderboardStandingProps {
  season: number;
}

export const MyLeaderboardStanding = (props: MyLeaderboardStandingProps) => {
  const { data: player, isLoading } = useMyLeaderboardStanding(props.season);

  if (isLoading) return <ComponentLoader />;
  if (!player) return null;

  return (
    <Stack>
      <PlayerPointsCard player={player} season={props.season} />
    </Stack>
  )
}