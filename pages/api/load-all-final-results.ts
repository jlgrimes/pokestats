import { NextApiRequest, NextApiResponse } from 'next';
import { fetchTournaments } from '../../src/hooks/tournaments';
import { loadFinalResults } from '../../src/lib/supabase/finalResults';

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
      console.log('Loading results for', tournament.name, '...');
      const { error } = await loadFinalResults(tournament.id);
      if (error) return res.status(500);
    }
    return res.status(200);
  } catch (err) {
    console.log(err)
    return res.status(500);
  } finally {
    res.end();
  }
}
