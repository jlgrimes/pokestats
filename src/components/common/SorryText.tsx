import { Flex, Heading } from '@chakra-ui/react';

export const SorryText = ({ children }: { children: string }) => (
  <Flex justifyContent={'center'} alignItems='center' padding='6'>
    <Heading size='md' color='gray.600'>
      {children}
    </Heading>
  </Flex>
);
