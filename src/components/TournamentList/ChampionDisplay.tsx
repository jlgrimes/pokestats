import {
  Box,
  Heading,
  HStack,
  Stack,
  useColorMode,
} from '@chakra-ui/react';
import { Standing } from '../../../types/tournament';
import { Icon } from '@chakra-ui/react';
import { FaChessKing, FaCrown } from 'react-icons/fa';
import SpriteDisplay from '../common/SpriteDisplay/SpriteDisplay';
import { FinalResultsSchema } from '../../../types/final-results';
import { Flex, Grid, Text } from '@tremor/react';

interface ChampionDisplayProps {
  champion: Standing;
}

export const ChampionDisplay = (props: ChampionDisplayProps) => {
  const { colorMode } = useColorMode();

  return (
    <SpriteDisplay pokemonNames={props.champion.deck?.defined_pokemon} />
  );
};
