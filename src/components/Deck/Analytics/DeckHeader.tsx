import { memo, useContext, useMemo } from 'react';
import {
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Tag,
  useColorMode,
} from '@chakra-ui/react';
import Image from 'next/image';
import { getCardImageUrl } from '../ListViewer/helpers';
import { DeckCard, Deck } from '../../../../types/tournament';
import { useCodeToSetMap } from '../../../hooks/deckList';
import SpriteDisplay from '../../common/SpriteDisplay/SpriteDisplay';
import { FaChevronLeft } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { StickyHeader } from '../../common/Layout/StickyHeader';
import { DeckVariants } from './DeckVariants';
import { BackToDecksButton } from './BackToDecksButton';
import { FormatContext } from './DeckAnalyticsContainer';
import { FormatTag } from '../Format/FormatTag';
import { useDeckStandings } from '../../../hooks/newStandings';

export const DeckHeader = memo(
  ({ deck, compact }: { deck: Deck; compact?: boolean }) => {
    const { colorMode } = useColorMode();
    const format = useContext(FormatContext);

    const { data: deckStandings } = useDeckStandings(deck);
    const codeToSetMap = useCodeToSetMap();
    const router = useRouter();

    const identifiableCards = useMemo(
      () =>
        deck.identifiable_cards
          ?.map(cardName => {
            return deckStandings
              ?.find(standing => !!standing.decklist)
              ?.decklist?.pokemon.find(({ name, set }) => {
                // Hard code to get the right Inteleon
                if (
                  name === 'Inteleon' &&
                  deckStandings?.[0].decklist?.pokemon.find(
                    ({ name, set }) => name === 'Inteleon' && set === 'SSH'
                  ) &&
                  set !== 'SSH'
                ) {
                  return false;
                }
                return name === cardName;
              });
          })
          .filter(card => card),
      [deck.identifiable_cards, deckStandings]
    );

    const heightWidthRatio = 1.396;
    const width = 125;
    const height = width * heightWidthRatio;

    if (compact) {
      return (
        <StickyHeader id='compact-deck-header'>
          <div>
            <Button
              variant={'ghost'}
              size='sm'
              leftIcon={<FaChevronLeft />}
              onClick={() => router.back()}
              paddingLeft={4}
              justifyContent='start'
            >
              <HStack>
                <Heading
                  color={colorMode === 'dark' ? 'gray.100' : 'gray.700'}
                  size='md'
                  letterSpacing={'wide'}
                >
                  {deck.name}
                </Heading>
                <SpriteDisplay pokemonNames={deck.defined_pokemon} />
              </HStack>
            </Button>
          </div>
        </StickyHeader>
      );
    }

    return (
      <Stack paddingX={6}>
        <BackToDecksButton />
        <HStack spacing={0}>
          {identifiableCards?.map(card => (
            <Image
              key={`${card?.name} ${card?.set}`}
              width={width}
              height={height}
              src={card ? getCardImageUrl(card, codeToSetMap, {
                highRes: true,
              }) : ''}
              alt={`${card?.name} ${card?.set}`}
            />
          ))}
        </HStack>
        <Heading color={colorMode === 'dark' ? 'gray.100' : 'gray.700'}>
          {deck.name}
          {format && <FormatTag format={format} />}
        </Heading>
        <DeckVariants deck={deck} />
      </Stack>
    );
  }
);

DeckHeader.displayName = 'DeckHeader';
