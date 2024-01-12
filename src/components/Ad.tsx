import { Box } from '@chakra-ui/react';
import { Adsense } from '@ctrl/react-adsense';
import { useShouldRemoveAds } from '../hooks/ads';

export const Ad = ({ slot, height }: { slot?: string, height?: string }) => {
  const shouldDisableAds = useShouldRemoveAds();

  if (shouldDisableAds) return null;

  return (
    <Adsense client='ca-pub-3066736963130742' slot={slot ?? '5287940290'} {...(height ? { style: { display: 'block', height, width: '100%' }, format: ''} : {})} />
  );
};
