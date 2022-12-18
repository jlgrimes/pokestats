import { useQuery } from "react-query";
import supabase from "../lib/supabase/client";

export const useArchetypes = () => {
  const fetchArchetypes = async () => {
    const res = await supabase
      .from('Deck Archetypes')
      .select('name,defined_pokemon');
    return res.data;
  };

  return useQuery('deck-archetypes', fetchArchetypes);
}