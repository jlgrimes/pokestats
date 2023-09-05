import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Divider, HStack, Link, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from "@chakra-ui/react"
import { formatDistanceStrict, parseISO } from "date-fns";
import { useCallback, useState } from "react"
import { useWhenLeaderboardUpdated } from "../../hooks/leaderboards/useLeaderboard";
import { Banner } from "../common/Banner";
import { CommonCard } from "../common/CommonCard"
import { MyLeaderboardStanding } from "../TopPlayers/MyLeaderboardStanding";
import { TopPlayersList } from "../TopPlayers/TopPlayersList"

const YEAR_TO_POKEMON_API_MAP: Record<number, number> = {
  46: 2023,
  52: 2024
};

export const seasonToReadableYear = (season: number) => YEAR_TO_POKEMON_API_MAP[season];

export const LeaderboardCard = () => {
  const [year, setYear] = useState(52);
  const [region, setRegion] = useState('global');
  const { data: whenUpdated } = useWhenLeaderboardUpdated(year);
  console.log(whenUpdated && formatDistanceStrict(parseISO(whenUpdated), new Date()))

  const YearSelect = useCallback(() => (
    <Menu isLazy>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {YEAR_TO_POKEMON_API_MAP[year]}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => setYear(52)}>2024</MenuItem>
        <MenuItem onClick={() => setYear(46)}>2023</MenuItem>
      </MenuList>
    </Menu>
  ), [year, setYear]);

  const RegionSelect = useCallback(() => (
    <Menu isLazy>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        Global
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => setRegion('global')}>Global</MenuItem>
      </MenuList>
    </Menu>
  ), []);

  return (
    <CommonCard header='Masters Leaderboard' ghost>
      <Stack>
        <HStack>
          <YearSelect />
          <RegionSelect />
        </HStack>
        <Banner>
          <Text>Last updated: {whenUpdated && formatDistanceStrict(parseISO(whenUpdated), new Date(), { addSuffix: true })}</Text>
        </Banner>
        <MyLeaderboardStanding season={year} />
        <TopPlayersList isCompact season={year} />
      </Stack>
    </CommonCard>
  )
}