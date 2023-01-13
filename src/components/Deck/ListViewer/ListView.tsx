import { Flex, GridItem, SimpleGrid, Image } from '@chakra-ui/react';
import { Card } from '../../../../types/tournament';
import { useCodeToSetMap } from '../../../hooks/deckList';
import { getCardImageUrl } from './helpers';

export const ListView = ({
  deckList,
  containerHeight,
  handleCardClick,
}: {
  deckList: Record<string, any>;
  containerHeight: number;
  handleCardClick: (card: Card) => void;
}) => {
  const codeToSetMap = useCodeToSetMap();

  const heightWidthRatio = 1.396;
  const width = 92;
  const height = width * heightWidthRatio;

  const flattenOutEnergies = (card: Card) => {
    const numPiles = Math.ceil(card.count / 4);
    const lastPileCount = card.count % 4 === 0 ? 4 : card.count % 4;

    return [...Array(numPiles)].map((_, idx) => ({
      ...card,
      count: idx === numPiles - 1 ? lastPileCount : 4,
    }));
  };

  const flatDeckList = ['pokemon', 'trainer', 'energy'].reduce(
    (acc: Card[], superclass) => [
      ...acc,
      ...deckList[superclass].reduce((acc: Card[], card: Card) => {
        if (card.count > 4) {
          return [...acc, ...flattenOutEnergies(card)];
        }

        const sameCardIdx = acc.findIndex(
          pushedCard =>
            pushedCard.name === card.name && pushedCard.set === card.set
        );
        if (sameCardIdx >= 0) {
          acc[sameCardIdx] = {
            ...acc[sameCardIdx],
            count: acc[sameCardIdx].count + card.count,
          };
          return acc;
        }

        return [...acc, card];
      }, []),
    ],
    []
  );
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
      {flatDeckList.map((card: Card, idx: number) => (
        <SimpleGrid
          cursor={'pointer'}
          onClick={() => handleCardClick(card)}
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
