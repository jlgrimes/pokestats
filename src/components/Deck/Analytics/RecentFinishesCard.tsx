import { Card, CardBody, CardFooter, CardHeader, Heading } from '@chakra-ui/react';
import { Deck } from '../../../../types/tournament';
import { DeckFinishes } from './DeckFinishes';
import { SeeMoreButton } from './SeeMoreButton';

export const RecentFinishesCard = ({ deck }: { deck: Deck }) => {
  return (
    <Card>
      <CardHeader paddingX={4} paddingBottom={2}>
        <Heading color='gray.700' size='md' fontWeight={'semibold'}>
          Recent finishes
        </Heading>
      </CardHeader>
      <CardBody paddingX={4} paddingY={2}>
        <DeckFinishes deck={deck} onlyShowRecent />
      </CardBody>
      <CardFooter paddingLeft={2} paddingTop={0}>
        <SeeMoreButton slug='/finishes' />
      </CardFooter>
    </Card>
  );
};
