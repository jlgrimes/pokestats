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

  // .contains(
  //   `deck_list->pokemon`,
  //   JSON.stringify([{ name: 'Crobat VMAX' }])
  //     .replace('[', '(')
  //     .replace(']', ')')
  // );
  //.contains('deck_list->pokemon', ['pokemon->>name: Corviknight VMAX'])
  // .filter(
  //   'name',
  //   'in',
  //   JSON.stringify(verifiedUsers?.map(({ name }) => name as string) ?? [])
  //     .replace('[', '(')
  //     .replace(']', ')')
  // );
  //.not('deck_list', 'is', null);
  console.log(data);
};
