import { NextApiRequest, NextApiResponse } from 'next';
import { fetchFormats } from '../../src/hooks/formats/formats';
import { fetchTournaments } from '../../src/hooks/tournaments';
import { loadDeckResults } from '../../src/lib/supabase/deckResults';

type Data = {
  message: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const tournaments = await fetchTournaments({ prefetch: true });

    for await (const tournament of tournaments) {
      console.log('Loading deck results for', tournament.name, '...');
      const { error } = await loadDeckResults(tournament);
      if (error) {
        console.log(error);
        return res.status(500);
      }
    }
    return res.status(200);
  } catch (err) {
    console.log(err);
    return res.status(500);
  } finally {
    res.end();
  }
}
