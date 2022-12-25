// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import { Client } from 'twitter-api-sdk';
// Pass auth credentials to the library client
const twitterClient = new Client(process.env.TWITTER_BEARER_TOKEN as string);

type Data = {
  id: string;
  username: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const response = await twitterClient.users.findUserById(
      req.query.id as string
    );

    res.status(200).json({
      id: response.data?.id as string,
      username: response.data?.username as string,
    });
  } catch (err) {
    return res.status(500);
  } finally {
    res.end();
  }
}
