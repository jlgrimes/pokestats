import { Card, Grid, HStack, Stack, Text } from "@chakra-ui/react";
import { PlayerOnLeaderboard } from "../../hooks/leaderboards/useLeaderboard"
import { CommonCard } from "../common/CommonCard";
import { CountryFlag } from "../Tournament/Home/CountryFlag";

interface PlayerPointsCardProps {
  player: PlayerOnLeaderboard;
}

export const PlayerPointsCard = (props: PlayerPointsCardProps) => {
  return (
    <CommonCard>
      <Grid gridTemplateColumns={`3.4rem auto`}>
        <CountryFlag countryCode={props.player.country_code} size={'sm'} />
        <Stack>
        <Text fontSize='lg' fontWeight='semibold'>{props.player.name}</Text>
          <Text>{props.player.points} CP</Text>
        </Stack>
      </Grid>
    </CommonCard>
  )
}