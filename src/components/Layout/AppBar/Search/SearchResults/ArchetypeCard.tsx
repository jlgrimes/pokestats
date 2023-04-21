import {
  Box,
  Card,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Stack,
  Tag,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { DeckTypeSchema } from '../../../../../hooks/deckArchetypes';
import { getDeckHref } from '../../../../common/DeckCompare/helpers';
import SpriteDisplay from '../../../../common/SpriteDisplay/SpriteDisplay';
import { FormatTag } from '../../../../Deck/Format/FormatTag';

interface ArchetypeCardProps {
  deck: DeckTypeSchema;
}

export const ArchetypeCard = (props: ArchetypeCardProps) => {
  return (
    <LinkBox>
      <Card key={props.deck.id + '-search-result'} paddingY={2} paddingX={4}>
        <HStack>
          <SpriteDisplay pokemonNames={props.deck.defined_pokemon} />
          <Stack spacing={1}>
            <LinkOverlay
              as={NextLink}
              href={getDeckHref(props.deck, props.deck.format?.id ?? 1) as any}
            >
              <Heading size='sm'>{props.deck.name}</Heading>
            </LinkOverlay>
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
    </LinkBox>
  );
};
