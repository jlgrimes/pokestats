import { isSpecialCard } from '../components/Deck/ListViewer/helpers';
import supabase from '../lib/supabase/client';

export const fetchCards = async (name: string, set: string) => {
  const cardIsSpecial = isSpecialCard({ name, set });
  const setQuery = cardIsSpecial ? '[]' : JSON.stringify([{ set: set }]);

  let data;
  data = (
    await supabase
      .from('Final Results')
      .select(`name,tournament_id,deck_list,deck_archetype`)
      .contains('deck_list->pokemon', JSON.stringify([{ name: name }]))
      .contains('deck_list->pokemon', setQuery)
  ).data;

  if (data?.length === 0) {
    data = (
      await supabase
        .from('Final Results')
        .select(`name,tournament_id,deck_list,deck_archetype`)
        .contains('deck_list->trainer', JSON.stringify([{ name: name }]))
        .contains('deck_list->trainer', JSON.stringify([setQuery]))
    ).data;

    if (data?.length === 0) {
      data = (
        await supabase
          .from('Final Results')
          .select(`name,tournament_id,deck_list,deck_archetype`)
          .contains('deck_list->trainer', JSON.stringify([{ name: name }]))
          .contains('deck_list->trainer', JSON.stringify(setQuery))
      ).data;
    }
  }
};
