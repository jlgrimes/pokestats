import { Heading, Highlight, Stack, Text } from '@chakra-ui/react';

export const ComingSoonPage = () => {
  return (
    <Stack padding={6} justifyContent='center' spacing={12}>
      <Heading color='gray.700' letterSpacing={'normal'}>
        <Highlight
          query='live them.'
          styles={{ px: '2', py: '1', rounded: 'full', bg: 'red.100' }}
        >
          {`You've watched Regionals. Now, prepare to live them.`}
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
        <Text fontSize='xl'>Coming this tournament season.</Text>
      </Stack>
    </Stack>
  );
};
