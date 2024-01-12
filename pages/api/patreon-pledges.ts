// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const CAMPAIGN_ID = '10816823';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const accessToken = process.env.NEXT_PUBLIC_PATREON_ACCESS_TOKEN;
    const response = await fetch(`https://www.patreon.com/api/oauth2/api/campaigns/${CAMPAIGN_ID}/pledges?include=patron.null`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const data = await response.json();

    if (response.ok) {
      return res.status(200).json(data);
    }

    return res.status(500).json({
      code: response.status,
      message: response.statusText
    })
  } catch (err) {
    console.error(err)
    return res.status(500);
  } finally {
    res.end();
  }
}
