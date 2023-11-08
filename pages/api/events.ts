// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { lat, lng } = req.query;

    const response = await fetch(
      `https://op-core.pokemon.com/api/v2/event_locator/search/?latitude=${lat}&longitude=${lng}&distance=250&format=json`
    );

    if (!response.ok) return res.status(500);

    let data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err)
    return res.status(500);
  } finally {
    res.end();
  }
}
