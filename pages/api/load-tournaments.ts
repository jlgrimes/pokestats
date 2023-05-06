import { NextApiRequest, NextApiResponse } from 'next';
import { fetchFormats } from '../../src/hooks/formats/formats';
import { getTournamentFormat } from '../../src/hooks/formats/helpers';
import {
  fetchPokedataTournaments,
  fetchTournaments,
} from '../../src/hooks/tournaments';
import supabase from '../../src/lib/supabase/client';
import { loadFinalResults } from '../../src/lib/supabase/finalResults';

type Data = {
  message: any;
};

// Outdated/incorrect tournaments that shouldn't exist
const TOURNAMENTS_DISABLED_LIST = ['0000051', '0000052'];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const tournaments = await fetchPokedataTournaments({ prefetch: true });
    const formats = await fetchFormats();

    if (!tournaments || tournaments.length === 0) throw 'No tournaments.';
    const result = await supabase.from('Tournaments').upsert(
      tournaments
        .filter(
          tournament => !TOURNAMENTS_DISABLED_LIST.includes(tournament.id)
        )
        .map(tournament => ({
          id: tournament.id,
          name: tournament.name,
          date: tournament.date,
          tournamentStatus: tournament.tournamentStatus,
          players: tournament.players,
          winners: tournament.winners,
          roundNumbers: tournament.roundNumbers,
          rk9link: tournament.rk9link,
          subStatus: tournament.subStatus,
          format: formats
            ? getTournamentFormat(formats, tournament)?.id ?? null
            : null,
        }))
    );
    if (result.error) throw result.error;

    return res.status(result.status);
  } catch (err) {
    console.log(err);
    return res.status(500);
  } finally {
    res.end();
  }
}
