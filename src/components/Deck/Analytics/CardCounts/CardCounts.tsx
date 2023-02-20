import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Grid,
  GridItem,
  StackItem,
  Stat,
  StatNumber,
} from '@chakra-ui/react';
import { Fragment } from 'react';
import { Deck } from '../../../../../types/tournament';
import { useCardCounts } from '../../../../hooks/finalResults';
import { fixPercentage } from '../../ListViewer/CardViewer.tsx/helpers';
import { SingleCardCountDisplay } from './SingleCardCountDisplay';

export const CardCounts = ({
  deck,
  onlyPopularTechs,
}: {
  deck: Deck;
  onlyPopularTechs?: boolean;
}) => {
  let cardCounts = useCardCounts(deck);
  // This is assuming each archetype unanimously runs a card.
  // If this isn't the case, you need to redefine what the archetype is.
  const numberOfDecks = cardCounts[0]?.count;

  // The maximum number of deck instances a card can be in before it stops being a tech
  const techCardDeckInstanceMax = 3;

  const shouldGroup = (count: number) =>
    count === numberOfDecks || count <= techCardDeckInstanceMax;
  // Don't call any cards outside of this "techs"
  const popularTechBound = [0, 0.95];

  const cardsInAllDecks = cardCounts.filter(
    cardCount => cardCount.count === numberOfDecks
  );
  cardCounts = cardCounts.filter(
    cardCount => cardCount.count !== numberOfDecks
  );

  return (
    <Fragment>
      {!onlyPopularTechs && (
        <Accordion allowToggle paddingY={2}>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  <Stat>
                    <StatNumber fontSize={'md'}>
                      See cards 100% of decks run
                    </StatNumber>
                  </Stat>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Grid
                gridTemplateColumns={`repeat(${onlyPopularTechs ? 3 : 4}, 1fr)`}
              >
                {cardsInAllDecks.map(({ card }) => (
                  <SingleCardCountDisplay
                    key={card.name}
                    card={card}
                    count={numberOfDecks}
                    numberOfDecks={numberOfDecks}
                    hideStat
                  />
                ))}
              </Grid>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      )}

      <Grid gridTemplateColumns={`repeat(${onlyPopularTechs ? 3 : 4}, 1fr)`}>
        {cardCounts
          .filter(card =>
            onlyPopularTechs
              ? !shouldGroup(card.count) &&
                card.count / numberOfDecks < popularTechBound[1]
              : true
          )
          .slice(0, onlyPopularTechs ? 6 : undefined)
          .map(({ card, count }, idx) => {
            const isInGroup =
              (count === numberOfDecks || count <= techCardDeckInstanceMax) &&
              (cardCounts.at(idx + 1)?.count === count ||
                cardCounts.at(idx - 1)?.count === count);
            const firstInGroup =
              (count === numberOfDecks || count <= techCardDeckInstanceMax) &&
              cardCounts.at(idx + 1)?.count === count &&
              cardCounts.at(idx - 1)?.count !== count;

            if (firstInGroup) {
              return (
                <Fragment key={`${card.name}-${card.set}`}>
                  <StackItem gridColumn={'1/-1'} paddingY={4}>
                    <Stat>
                      <StatNumber>
                        {count > techCardDeckInstanceMax
                          ? `${fixPercentage(
                              (count * 100) / numberOfDecks
                            )}% of decks ran`
                          : `${count} ${count > 1 ? 'decks' : 'deck'} ran`}
                      </StatNumber>
                    </Stat>
                  </StackItem>
                  <SingleCardCountDisplay
                    card={card}
                    count={count}
                    numberOfDecks={numberOfDecks}
                    hideStat
                  />
                </Fragment>
              );
            }

            const firstInGroupWithNoStat =
              cardCounts.at(idx - 1)?.count === numberOfDecks &&
              cardCounts.at(idx - 1)?.count !== count;

            if (firstInGroupWithNoStat && !onlyPopularTechs) {
              return (
                <Fragment key={`${card.name}-${card.set}`}>
                  <GridItem gridColumn={'1/-1'} paddingY={4} />
                  <SingleCardCountDisplay
                    card={card}
                    count={count}
                    numberOfDecks={numberOfDecks}
                    hideStat={isInGroup}
                  />
                </Fragment>
              );
            }

            return (
              <SingleCardCountDisplay
                key={`${card.name}-${card.set}`}
                card={card}
                count={count}
                numberOfDecks={numberOfDecks}
                hideStat={isInGroup}
              />
            );
          })}
      </Grid>
    </Fragment>
  );
};
