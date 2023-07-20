import { NextApiRequest, NextApiResponse } from 'next';
import { getLeaderboardApiUrl } from '../../src/hooks/leaderboards/helpers';
import supabase from '../../src/lib/supabase/client';

type Data = {
  message: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    // 2023. Idk why
    const qualificationPeriod = 46;

    const initialPage = await fetch(getLeaderboardApiUrl(qualificationPeriod)).then((res) => res.json());
    const numPages = initialPage._metadata.page_count;

    for await (const pageNum of [...Array(numPages).keys()]) {
      const realNum = pageNum + 1;
      let pageData;

      if (realNum === 1) {
        pageData = initialPage;
      } else {
        pageData = await fetch(getLeaderboardApiUrl(pageNum)).then((res) => res.json());
      }

      const upsertedEntries = pageData.leaderboard.records.map((record) => ({
        name: record.screen_name,
        country_code: record.country,
        points: record.score,
        qualification_period: qualificationPeriod
      }))
      
      const upsertRes = await supabase.from('Masters Leaderboard').upsert(upsertedEntries, { onConflict: 'name' });
      if (upsertRes.error) {
        console.error(upsertRes.error);
        return res.status(500);
      }
    }

    return res.status(200);
  } catch (err) {
    console.log(err);
    return res.status(500);
  } finally {
    res.end();
  }
}
