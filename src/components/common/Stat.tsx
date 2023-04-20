import { Heading, Stack, useColorMode } from '@chakra-ui/react';
import { fixPercentage } from '../Deck/ListViewer/CardViewer.tsx/helpers';

interface StatProps {
  stat: number;
  label: string;
}

export const Stat = (props: StatProps) => {
  const { colorMode } = useColorMode();

  return (
    <Stack spacing={0}>
      <Heading size='md' color={colorMode === 'dark' ? 'gray.300' : 'gray.700'}>
        {fixPercentage(props.stat * 100)}%
      </Heading>
      <Heading size='xs' color='gray.500'>
        {props.label}
      </Heading>
    </Stack>
  );
};
