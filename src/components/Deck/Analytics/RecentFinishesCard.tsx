import { Deck } from '../../../../types/tournament';
import { CommonCard } from '../../common/CommonCard';
import { DeckFinishes } from './DeckFinishes';

export const RecentFinishesCard = ({ deck }: { deck: Deck }) => {
  return (
    <CommonCard slug='finishes'>
      <DeckFinishes deck={deck} onlyShowRecent />
    </CommonCard>
  );
};
