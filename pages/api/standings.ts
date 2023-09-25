// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { cropPlayerName, getPlayerRegion } from '../../src/lib/fetch/fetchLiveResults';
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { tournamentId } = req.query;

    if (typeof tournamentId !== 'string') return res.status(500);
    if (!process.env['AWS_ACCESS_KEY']) throw('AWS_ACCESS_KEY not defined')
    if (!process.env['AWS_SECRET_KEY']) throw('AWS_SECRET_KEY not defined')

    const client = new S3Client({credentials: {
      accessKeyId: process.env['AWS_ACCESS_KEY'],
      secretAccessKey: process.env['AWS_SECRET_KEY']
    }})
    const command = new GetObjectCommand({
      Bucket: "pokescraper",
      Key: `masters_${tournamentId}.json`
    });
    const response = await client.send(command);

    if (!response.Body) throw('no body');
    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    const str = await response.Body.transformToString();
    const data = JSON.parse(str);

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
