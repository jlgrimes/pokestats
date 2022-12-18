// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  data: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const response = await fetch(
      `https://pokedata.ovh/standings/${req.query.id}/masters/${req.query.id}_Masters.json`
    );
    let data = await response.text();
    data = data.replaceAll('"rounds"', ',"rounds"');
    let parsedData = JSON.parse(data);
    parsedData = parsedData.map(
      (player: {
        name: string;
        placing: number;
        record: { wins: number; losses: number; ties: number };
      }) => ({
        name: player.name,
        placing: player.placing,
        record: player.record,
        day2: (player.record.wins * 3 + player.record.ties) >= 19
      })
    );

    res.status(200).json({ data: parsedData });
  } catch (err) {
    console.error(err);
    return res.status(500);
  } finally {
    res.end();
  }
}
