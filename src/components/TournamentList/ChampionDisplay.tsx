import { Box, Grid, Heading, HStack, Stack } from '@chakra-ui/react';
import { Standing } from '../../../types/tournament';
import { Icon, Text } from '@chakra-ui/react';
import { FaChessKing } from 'react-icons/fa';
import SpriteDisplay from '../common/SpriteDisplay/SpriteDisplay';
import { FinalResultsSchema } from '../../../types/final-results';

interface ChampionDisplayProps {
  champion: Standing;
}

export const ChampionDisplay = (props: ChampionDisplayProps) => {
  return (
    <Grid gridTemplateColumns={'18px auto'} alignItems='center' gap={1}>
      <Icon as={FaChessKing} color='yellow.500' />
      <Heading size={'xs'} color='gray.700' fontWeight={'semibold'}>
        {props.champion.name}
      </Heading>
      <Box />
      <SpriteDisplay
        pokemonNames={props.champion.deck?.defined_pokemon}
      />
    </Grid>
  );
};
