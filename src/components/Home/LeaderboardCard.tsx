import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Divider, HStack, Link, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from "@chakra-ui/react"
import { useCallback, useState } from "react"
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
        <MyLeaderboardStanding season={year} />
        <TopPlayersList isCompact season={year} />
        <Banner>
          <Text>Data sourced from <Link href='https://www.pokemon.com/us/play-pokemon/leaderboards/tcg-masters/' isExternal color='blue.500'>pokemon.com</Link>. Check them out for the most up-to-date standings.</Text>
        </Banner>
      </Stack>
    </CommonCard>
  )
}