import { NextApiRequest, NextApiResponse } from 'next';
import { fetchFormats } from '../../src/hooks/formats/formats';
import { getTournamentFormat } from '../../src/hooks/formats/helpers';
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
    const formats = await fetchFormats();

    for await (const tournament of tournaments) {
      console.log('Loading results for', tournament.name, '...');
      const currentFormat = await getTournamentFormat(
        formats ?? [],
        tournament
      );

      const { error } = await loadFinalResults(tournament.id, true, currentFormat);
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
