import { Heading } from '@chakra-ui/react';

export const Username = ({ children }: { children: string }) => {
  return (
    <Heading
      size='lg'
      color='gray.500'
      fontWeight='semibold'
    >{`@${children}`}</Heading>
  );
};
