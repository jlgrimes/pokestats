import { NextApiRequest, NextApiResponse } from 'next';
import { fetchTournaments } from '../../src/hooks/tournaments';
import {
  getPokedata,
  updatePlayerProfilesWithTournament,
} from '../../src/lib/fetch/fetchLiveResults';

type Data = {
  message: String;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const tournaments = await fetchTournaments({ prefetch: true });
    for await (const tournament of tournaments) {
      const data = await getPokedata(tournament.id, true);
      const { error } = await updatePlayerProfilesWithTournament(
        data,
        tournament.id
      );
      if (error) return res.status(500);
    }
    return res.status(200);
  } catch (err) {
    return res.status(500);
  } finally {
    res.end();
  }
}
