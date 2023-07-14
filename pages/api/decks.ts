// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PostgrestError } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSpriteUrl } from '../../src/components/common/helpers';
import { fetchDecks } from '../../src/hooks/deckArchetypes';
import supabase from '../../src/lib/supabase/client';
import { Deck } from '../../types/tournament';

type Data = {
  archetypes: Deck[] | null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const dbRes = await supabase
      .from('Deck Archetypes')
      .select(
        `id,name,defined_pokemon,supertype,identifiable_cards,format`
      )
      .order('created_at', { ascending: false });

    if (dbRes.error) {
      return res.status(500);
    }

    res.status(200).json({
      archetypes: dbRes.data.map((deck) => ({
        ...deck,
        sprites: deck.defined_pokemon.map((pokemon) => getSpriteUrl(pokemon))
      }))
    });
  } catch(err) {
    return res.status(500);
  } finally {
    res.end();
  }
}
