import { Box, Card, Heading, HStack, Stack, Tag } from '@chakra-ui/react';
import { DeckTypeSchema } from '../../../../../hooks/deckArchetypes';
import SpriteDisplay from '../../../../common/SpriteDisplay/SpriteDisplay';
import { FormatTag } from '../../../../Deck/Format/FormatTag';

interface ArchetypeCardProps {
  deck: DeckTypeSchema;
}

export const ArchetypeCard = (props: ArchetypeCardProps) => {
  return (
    <Card key={props.deck.id + '-search-result'} paddingY={2} paddingX={4}>
      <HStack>
        <SpriteDisplay pokemonNames={props.deck.defined_pokemon} />
        <Stack spacing={1}>
          <Heading size='sm'>{props.deck.name}</Heading>
          <HStack spacing={1}>
            {props.deck.type === 'archetype' && (
              <Box>
                <Tag>Deck</Tag>
              </Box>
            )}
            {props.deck.type === 'supertype' && (
              <Box>
                <Tag>Supertype</Tag>
              </Box>
            )}
            {props.deck.format && (
              <Box>
                <FormatTag removeSpacing format={props.deck.format} />
              </Box>
            )}
          </HStack>
        </Stack>
      </HStack>
    </Card>
  );
};
