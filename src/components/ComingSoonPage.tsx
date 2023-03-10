import { Heading, Highlight, Stack, Text } from '@chakra-ui/react';
import { formatDistanceStrict } from 'date-fns';

export const ComingSoonPage = () => {
  const distance = formatDistanceStrict(
    new Date(),
    new Date('2023-03-10T14:00:00-0500')
  );
  const liveText = `Live in ${distance}`;

  return (
    <Stack padding={6} justifyContent='center' spacing={12}>
      <Heading color='gray.700' letterSpacing={'normal'}>
        <Highlight
          query={liveText}
          styles={{ px: '2', py: '1', rounded: 'full', bg: 'green.100' }}
        >
          {`You've been waiting long enough. ${liveText}`}
        </Highlight>
      </Heading>
      <Stack spacing={6}>
        <Text fontSize='xl'>
          PokéStats is getting a new coat of paint. Master the playing field and
          cheer on your favorite players with real-time, interactive tournament
          analysis.
        </Text>
        <Text fontSize='xl'>
          Find your next favorite deck along with the spice tech with post-game
          tournament statistics and metagame progression trends.
        </Text>
      </Stack>
    </Stack>
  );
};
