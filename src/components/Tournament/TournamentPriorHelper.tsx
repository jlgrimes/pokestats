import { Flex, Heading, Text } from '@chakra-ui/react';

export const TournamentPriorHelper = () => (
  <Flex justifyContent={'center'} alignItems='center' padding='2'>
    <Text fontSize={'xs'}>
      {`Tournaments prior to this are not currently available.`}
    </Text>
  </Flex>
);
