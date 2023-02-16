// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { FetchPairingsSchema } from '../../types/pairings';

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

    const data: FetchPairingsSchema = await response.json();

    res.status(200).json(data);
  } catch (err) {
    return res.status(500);
  } finally {
    res.end();
  }
}
