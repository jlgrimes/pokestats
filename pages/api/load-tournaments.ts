import { NextApiRequest, NextApiResponse } from 'next';
import { fetchPokedataTournaments, fetchTournaments } from '../../src/hooks/tournaments';
import supabase from '../../src/lib/supabase/client';
import { loadFinalResults } from '../../src/lib/supabase/finalResults';

type Data = {
  message: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const tournaments = await fetchPokedataTournaments({ prefetch: true });

    if (!tournaments || tournaments.length === 0) throw 'No tournaments.';
    const result = await supabase.from('Tournaments').upsert(
      tournaments.map(tournament => ({
        id: tournament.id,
        name: tournament.name,
        date: tournament.date,
        tournamentStatus: tournament.tournamentStatus,
        players: tournament.players,
        winners: tournament.winners,
        roundNumbers: tournament.roundNumbers,
        rk9link: tournament.rk9link,
        subStatus: tournament.subStatus
      }))
    );

    return res.status(200);
  } catch (err) {
    console.log(err);
    return res.status(500);
  } finally {
    res.end();
  }
}
