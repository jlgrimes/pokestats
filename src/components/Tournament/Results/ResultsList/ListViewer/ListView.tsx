import {
  Flex,
  GridItem,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useCodeToSetMap } from '../../../../../hooks/deckList';

export const ListView = ({ deckList }: { deckList: Record<string, any> }) => {
  const codeToSetMap = useCodeToSetMap();

  const getCardImageUrl = (card: {
    name: string;
    number: string;
    set: string;
  }) => {
    let set = codeToSetMap?.[card.set];
    if (!set) {
      return '';
    }

    if (card.number.includes('SWSH')) {
      set = 'swshp';
    } else if (card.number.includes('TG')) {
      set = set.replace('tg', '').concat('tg');
    }

    return `https://images.pokemontcg.io/${set}/${card?.number}.png`;
  };

  return (
    <Flex flexWrap={'wrap'} gap={0}>
      {['Pokemon', 'Trainer', 'Energy'].map((superclass, idx) =>
        deckList[superclass.toLowerCase()].map(
          (
            card: { name: string; number: string; set: string; count: number },
            idx: number
          ) => (
            <SimpleGrid key={idx} gridAutoFlow='column'>
              {[...Array(card.count)].map((_, idx) => (
                <GridItem key={idx} gridColumn={1} gridRow={1} paddingLeft={idx * 2}>
                  <Image
                    width={65}
                    height={195}
                    src={getCardImageUrl(card)}
                    alt={`${card.name} ${card.set}`}
                  />
                </GridItem>
              ))}
            </SimpleGrid>
          )
        )
      )}
    </Flex>
  );
};
