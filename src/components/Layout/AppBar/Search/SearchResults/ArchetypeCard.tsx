import { Box, Card, Heading, HStack, Stack } from '@chakra-ui/react';
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
          {props.deck.format && (
            <Box>
              <FormatTag removeSpacing format={props.deck.format} />
            </Box>
          )}
        </Stack>
      </HStack>
    </Card>
  );
};
