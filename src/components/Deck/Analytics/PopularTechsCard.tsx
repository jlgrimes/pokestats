import { Deck } from '../../../../types/tournament';
import { DeckClassification } from '../../../hooks/deckArchetypes';
import { CommonCard } from '../../common/CommonCard';
import { CardCounts } from './CardCounts/CardCounts';

export const PopularTechsCard = ({
  deck,
  type,
}: {
  deck: Deck;
  type: DeckClassification;
}) => {
  return (
    <CommonCard
      header='Popular inclusions'
      subheader='Cards that made it to day 2'
      slug='cards'
    >
      <CardCounts deck={deck} type={type} onlyPopularTechs />
    </CommonCard>
  );
};
