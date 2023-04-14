// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { FetchPairingsSchema } from '../../types/pairings';
import { cropPlayerName } from '../../src/lib/fetch/fetchLiveResults';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { tournamentId } = req.query;

    const response = await fetch(
      `https://pokedata.ovh/standings/${tournamentId}/masters/${tournamentId}_Masterstables.json`
    );

    if (!response.ok) return res.status(500);

    let data = await response.json();

    data = data.map(round => ({
      ...round,
      tables: round.tables.map(table => ({
        ...table,
        players: table.players.map(player => ({
          ...player,
          name: cropPlayerName(player.name),
        })),
      })),
    }));

    res.status(200).json(data);
  } catch (err) {
    console.error(err)
    return res.status(500);
  } finally {
    res.end();
  }
}
