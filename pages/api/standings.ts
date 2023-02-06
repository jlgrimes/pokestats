// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getPokedataStandingsUrl } from '../../src/lib/url';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { tournamentId } = req.query;

    if (typeof tournamentId !== 'string') return res.status(500);

    const response = await fetch(getPokedataStandingsUrl(tournamentId));
    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    return res.status(500);
  } finally {
    res.end();
  }
}
