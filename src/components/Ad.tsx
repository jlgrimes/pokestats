import { Box } from '@chakra-ui/react';
import { Adsense } from '@ctrl/react-adsense';

export const Ad = ({ slot, height }: { slot?: string, height?: string }) => (
  <Adsense client='ca-pub-3066736963130742' slot={slot ?? '5287940290'} {...(height ? { style: { display: 'block', height: '40px', width: '100%' }, format: ''} : {})} />
);
