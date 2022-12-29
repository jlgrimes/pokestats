import {
  Flex,
  GridItem,
  SimpleGrid,
  Image
} from '@chakra-ui/react';
import { useCodeToSetMap } from '../../../hooks/deckList';

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
    } else if (card.number.includes('SV')) {
      set = set.replace('sv', '').concat('sv');
    }

    return `https://images.pokemontcg.io/${set}/${card?.number}.png`;
  };

  const heightWidthRatio = 1.396;
  const width = 92;

  return (
    <Flex flexWrap={'wrap'} gap={0} marginLeft='8' marginTop='55px' padding={2}>
      {['Pokemon', 'Trainer', 'Energy'].map((superclass, idx) =>
        deckList[superclass.toLowerCase()].map(
          (
            card: { name: string; number: string; set: string; count: number },
            idx: number
          ) => (
            <SimpleGrid key={idx} gridAutoFlow='column' marginLeft={'-8'} marginTop='-55px'>
              {[...Array(card.count)].map((_, idx) => (
                <GridItem key={idx} gridColumn={1} gridRow={1} paddingLeft={idx * 3}>
                  <Image
                    background='black'
                    outline='3px solid'
                    width={`${width}px`}
                    height={`${heightWidthRatio * width}px`}
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
