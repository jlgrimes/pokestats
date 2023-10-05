import { Flex, GridItem, SimpleGrid, Image } from '@chakra-ui/react';
import { useMemo } from 'react';
import { DeckCard, DeckList } from '../../../../types/tournament';
import { useCodeToSetMap } from '../../../hooks/deckList';
import { getCardImageUrl, getCompressedList } from './helpers';

export const ListView = ({
  deckList,
  containerHeight,
}: {
  deckList: DeckList;
  containerHeight: number;
}) => {
  const codeToSetMap = useCodeToSetMap();
  const flatDeckList = useMemo(() => getCompressedList(deckList, true), [deckList]);

  const heightWidthRatio = 1.396;
  const width = 92;
  const height = width * heightWidthRatio;

  const numberOfColumns = 4;
  const numberOfRows = Math.ceil(flatDeckList.length / numberOfColumns);
  const rowStackMargin =
    (height * numberOfRows - containerHeight) / (numberOfRows - 1);

  return (
    <SimpleGrid
      id='list-grid-view'
      gridTemplateColumns={`repeat(${numberOfColumns}, 1fr)`}
      gap={0}
      marginLeft='12'
      marginTop={`${rowStackMargin}px`}
      height='100%'
    >
      {flatDeckList.map((card: DeckCard, idx: number) => (
        <SimpleGrid
          cursor={'pointer'}
          key={idx}
          gridAutoFlow='column'
          marginLeft={'-12'}
          marginTop={`-${rowStackMargin}px`}
        >
          {[...Array(card.count)].map((_, idx) => (
            <GridItem
              key={idx}
              gridColumn={1}
              gridRow={1}
              paddingLeft={idx * 3}
            >
              <Image
                background='black'
                outline='3px solid'
                width={`${width}px`}
                height={`${height}px`}
                src={getCardImageUrl(card, codeToSetMap)}
                alt={`${card.name} ${card.set}`}
              />
            </GridItem>
          ))}
        </SimpleGrid>
      ))}
    </SimpleGrid>
  );
};
