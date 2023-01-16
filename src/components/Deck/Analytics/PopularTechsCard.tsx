import { Card, CardBody, CardHeader, Heading } from '@chakra-ui/react';
import { Deck } from '../../../../types/tournament';
import { CardCounts } from './CardCounts/CardCounts';

export const PopularTechsCard = ({ deck }: { deck: Deck }) => {
  return (
    <Card>
      <CardHeader paddingX={4} paddingBottom={2}>
        <Heading color='gray.700' size='md' fontWeight={'semibold'}>
          Popular inclusions
        </Heading>
      </CardHeader>
      <CardBody paddingX={4} paddingY={2}>
        <CardCounts deck={deck} onlyPopularTechs />
      </CardBody>
    </Card>
  );
};
