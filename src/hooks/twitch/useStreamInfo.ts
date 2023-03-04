import { useQuery } from '@tanstack/react-query';

const streamIdMap: Record<string, number> = {
  pokemontcg: 109828129,
  limitless_tcg: 147518900,
};

export const fetchStreamInfo = async (streamUrl: string) => {
  if (!streamUrl.includes('https://www.twitch.tv/')) return null;

  const channel: string = streamUrl.split('https://www.twitch.tv/')[1];
  const streamId = streamIdMap[channel];

  if (!streamId) return null;

  const res = await fetch(
    `https://api.twitch.tv/helix/streams?user_id=${streamId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TWITCH_ACCESS_TOKEN}`,
        'Client-ID': process.env.NEXT_PUBLIC_TWITCH_API_KEY ?? '',
      },
    }
  );
  const data: Record<string, any> = await res.json();

  return data.data?.at(0) ?? null;
};

/**
 * Hook to return stream info.
 *
 * @param streamUrl ex https://www.twitch.tv/pokemontcg
 * @returns
 */
export const useStreamInfo = (streamUrl: string) => {
  return useQuery({
    queryKey: ['twitch-stream-info', streamUrl],
    queryFn: () => fetchStreamInfo(streamUrl),
  });
};
