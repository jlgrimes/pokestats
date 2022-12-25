// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import { Client } from 'twitter-api-sdk';
// Pass auth credentials to the library client
const twitterClient = new Client(process.env.TWITTER_BEARER_TOKEN as string);

type Data = {
  id: string;
  username: string;
};

export const fetchTwitterProfile = async (query: { id?: string, username?: string }) => {
  let response;
  if (query.id) {
    response = await twitterClient.users.findUserById(
      query.id as string,
      {
        'user.fields': ['profile_image_url', 'description'],
      }
    );
  } else if (query.username) {
    response = await twitterClient.users.findUserByUsername(
      query.username as string,
      {
        'user.fields': ['profile_image_url', 'description'],
      }
    );
  }

  if (!response) return;

  return {
    ...response.data,
    profile_image_url: response.data?.profile_image_url?.replace('_normal', '')
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    let response = await fetchTwitterProfile(req.query)

    if (!response?.data) {
      return res.status(500);
    }

    res.status(200).json(response.data);
  } catch (err) {
    return res.status(500);
  } finally {
    res.end();
  }
}
