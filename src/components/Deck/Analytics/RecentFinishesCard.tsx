import { Deck } from '../../../../types/tournament';
import { DeckClassification } from '../../../hooks/deckArchetypes';
import { CommonCard } from '../../common/CommonCard';
import { DeckFinishes } from './DeckFinishes';

export const RecentFinishesCard = ({
  deck,
  type,
}: {
  deck: Deck;
  type: DeckClassification;
}) => {
  return (
    <CommonCard header='Recent finishes' slug='finishes'>
      <DeckFinishes deck={deck} type={type} onlyShowRecent />
    </CommonCard>
  );
};
