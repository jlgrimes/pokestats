import { Box, Button, Card, Flex, Grid, Heading, HStack, Stack, Text, Tooltip, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaHiking, FaMountain, FaRegUser, FaRoute } from "react-icons/fa";
import { PlayerOnLeaderboard } from "../../hooks/leaderboards/useLeaderboard"
import { CountryFlag } from "../Tournament/Home/CountryFlag";
import { PlayerJourneyModal } from "./PlayerJourneyModal";

interface PlayerPointsCardProps {
  player: PlayerOnLeaderboard;
}

export const PlayerPointsCard = (props: PlayerPointsCardProps) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      {props.player.profile && <PlayerJourneyModal  player={props.player} isOpen={isOpen} onClose={onClose} />}
      <Grid gridTemplateColumns={`1.5rem 2.6rem 1fr auto auto`} gap={4} alignItems='center'>
        <Heading size='md' textAlign='right'>{props.player.placing}</Heading>
        <CountryFlag countryCode={props.player.country_code} size={'sm'} />
        <Stack spacing={0} onClick={() => props.player.profile && router.push(`/player/${props.player.profile?.username}`)} cursor={props.player.profile ? 'pointer' : 'auto'}>
          <Text fontSize='lg' fontWeight='semibold'>{props.player.profile?.name ?? props.player.name}</Text>
          <Text fontWeight='semibold' color='gray.500'>{props.player.points} CP</Text>
        </Stack>
        <Tooltip label={props.player.profile ? null : `${props.player.name} is not on pokestats :(`}>
            <Button leftIcon={<FaRoute />} size={{ base: 'sm', sm: 'md' }} isDisabled={!props.player.profile} onClick={onOpen}>
              Season
            </Button>
        </Tooltip>
      </Grid>
    </Box>
  )
}