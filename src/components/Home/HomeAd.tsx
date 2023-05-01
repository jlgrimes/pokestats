import { Box } from '@chakra-ui/react';
import { Adsense } from '@ctrl/react-adsense';

export const HomeAd = ({ slot }: { slot?: string }) => (
  <Box>
    <Adsense client='ca-pub-3066736963130742' slot={slot ?? '5287940290'} />
  </Box>
);
