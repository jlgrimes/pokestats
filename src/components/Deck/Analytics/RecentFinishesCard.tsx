import { Card, CardBody, CardHeader, Heading } from '@chakra-ui/react';
import { Deck } from '../../../../types/tournament';
import { DeckFinishes } from './DeckFinishes';

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
    </Card>
  );
};
