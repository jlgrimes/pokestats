// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { cropPlayerName, getPlayerRegion } from '../../src/lib/fetch/fetchLiveResults';
import supabase from '../../src/lib/supabase/client';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { tournamentId } = req.query;

    if (typeof tournamentId !== 'string') return res.status(500);

    const response = await supabase.from('live_standings').select('*');
    const data = response.data;

    if (!data) throw 'Data is null';

    data.forEach((player, idx) => {
      data[idx].region = getPlayerRegion(player.name)?.at(1);
      data[idx].name = cropPlayerName(player.name);

      Object.entries(data[idx].rounds).forEach(([roundNumber, round]) => {
        data[idx].rounds[roundNumber].name = cropPlayerName(
          (round as Record<string, any>).name
        );
      });
    });

    res.status(200).json(data);
  } catch (err) {
    console.error(err)
    return res.status(500);
  } finally {
    res.end();
  }
}
