// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { tournamentId } = req.query;

    const response = await fetch(
      `https://pokedata.ovh/standings/${tournamentId}/masters/${tournamentId}_Masters.json`
    );
    const data = await response.json();
  
    res.status(200).json(data);
  } catch(err) {
    return res.status(500);
  } finally {
    res.end();
  }
}
