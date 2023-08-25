import { Heading, Icon, Stack, Text } from "@chakra-ui/react";
import { useMyLeaderboardStanding } from "../../hooks/leaderboards/useLeaderboard";
import { ComponentLoader } from "../common/ComponentLoader";
import { PlayerPointsCard } from "./PlayerPointsCard";
import { CommonCard } from "../common/CommonCard";
import { FaUser } from "react-icons/fa";

interface MyLeaderboardStandingProps {
  season: number;
}

export const MyLeaderboardStanding = (props: MyLeaderboardStandingProps) => {
  const { data: player, isLoading } = useMyLeaderboardStanding(props.season);

  if (isLoading) return <ComponentLoader />;
  if (!player) return null;

  return (
    <CommonCard ghost header='My standing' leftIcon={<Icon color='gray.500' as={FaUser} />}>
      <PlayerPointsCard player={player} season={props.season} />
    </CommonCard>
  )
}