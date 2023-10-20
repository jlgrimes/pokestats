import { memo } from 'react';
import {
  Stack,
} from '@chakra-ui/react';
import { Deck } from '../../../../types/tournament';
import { DeckVariants } from './DeckVariants';
import { PageTitle } from '../../common/new/PageTitle';
import { Flex } from '@tremor/react';
import SpriteDisplay from '../../common/SpriteDisplay/SpriteDisplay';

export const DeckHeader = memo(
  ({ deck }: { deck: Deck }) => {
    return (
      <Stack paddingX={6}>
        <Flex>
          <PageTitle>{deck.name}</PageTitle>
          <SpriteDisplay pokemonNames={deck.defined_pokemon} />
        </Flex>
        <DeckVariants deck={deck} />
      </Stack>
    );
  }
);

DeckHeader.displayName = 'DeckHeader';
