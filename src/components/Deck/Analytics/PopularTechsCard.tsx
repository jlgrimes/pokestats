import { Deck } from '../../../../types/tournament';
import { CommonCard } from '../../common/CommonCard';
import { CardCounts } from './CardCounts/CardCounts';

export const PopularTechsCard = ({ deck }: { deck: Deck }) => {
  return (
    <CommonCard header='Popular inclusions' slug='/cards'>
      <CardCounts deck={deck} onlyPopularTechs />
    </CommonCard>
  );
};
