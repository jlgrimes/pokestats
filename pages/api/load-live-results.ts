import { NextApiRequest, NextApiResponse } from 'next';
import { fetchTournaments } from '../../src/hooks/tournaments';
import supabase from '../../src/lib/supabase/client';
import { loadLiveResults } from '../../src/lib/supabase/liveResults';
import { Tournament } from '../../types/tournament';

type Data = {
  message: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const tournamentRes = await supabase
      .from('Tournaments')
      .select(
        'id,tournamentStatus'
      ).returns<Tournament[]>();
    const tournaments = tournamentRes.data;

    // Return error if error with the call
    if (tournaments === null) {
      return res.status(200);
    }

    if (tournaments.every((tournament) => tournament.tournamentStatus !== 'running')) {
      console.log('No tournaments to update.');
      return res.status(500);
    }

    const liveTournaments = tournaments.filter((tournament) => tournament.tournamentStatus === 'running');

    for await (const tournament of liveTournaments) {
      console.log('Loading live results for', tournament.name, '...');
      const { error } = await loadLiveResults(tournament.id, tournament.tournamentStatus);
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
