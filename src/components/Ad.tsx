import { Box } from '@chakra-ui/react';
import { Adsense } from '@ctrl/react-adsense';

export const Ad = ({ slot, height }: { slot?: string, height?: string }) => (
  <Box {...(height ? { style: { height } } : {})}>
    <Adsense client='ca-pub-3066736963130742' slot={slot ?? '5287940290'} {...(height ? { style: { height } } : {})} />
  </Box>
);
