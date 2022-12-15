// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  url: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${req.query.name}`);
    const data = await response.json();
    const sprite = data.sprites.front_default;
    if (!sprite) throw('no sprite');
  
    res.status(200).json({ url: sprite });
  } catch(err) {
    return res.status(500);
  } finally {
    res.end();
  }
}
