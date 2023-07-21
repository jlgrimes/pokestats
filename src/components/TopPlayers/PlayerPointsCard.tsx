import { Box, Button, Card, Flex, Grid, Heading, HStack, Stack, Text, Tooltip } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaHiking, FaMountain, FaRegUser, FaRoute } from "react-icons/fa";
import { PlayerOnLeaderboard } from "../../hooks/leaderboards/useLeaderboard"
import { CommonCard } from "../common/CommonCard";
import { CountryFlag } from "../Tournament/Home/CountryFlag";

interface PlayerPointsCardProps {
  player: PlayerOnLeaderboard;
}

export const PlayerPointsCard = (props: PlayerPointsCardProps) => {
  const router = useRouter();

  return (
    <Box>
      <Grid gridTemplateColumns={`1.5rem 2.6rem 1fr auto auto`} gap={4} alignItems='center'>
        <Heading size='md' color='gray.800' textAlign='right'>{props.player.placing}</Heading>
        <CountryFlag countryCode={props.player.country_code} size={'sm'} />
        <Stack spacing={0}>
          <Text fontSize='lg' fontWeight='semibold'>{props.player.name}</Text>
          <Text>{props.player.points} CP</Text>
        </Stack>
        <Tooltip label={props.player.profile ? null : `${props.player.name} is not on pokestats :(`}>
          <Stack direction={{ base: 'column', sm: 'row' }}>
            <Button leftIcon={<FaRoute />} size={{ base: 'sm', sm: 'md' }} isDisabled={!props.player.profile}>
              Season
            </Button>
            <Button leftIcon={<FaRegUser />} size={{ base: 'sm', sm: 'md' }} isDisabled={!props.player.profile} onClick={() => router.push(`/player/${props.player.profile?.username}`)}>
              Profile
            </Button>
          </Stack>
        </Tooltip>
      </Grid>
    </Box>
  )
}