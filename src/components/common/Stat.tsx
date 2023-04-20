import { Heading, Stack, useColorMode } from '@chakra-ui/react';
import { fixPercentage } from '../Deck/ListViewer/CardViewer.tsx/helpers';

interface StatProps {
  stat: number;
  label: string;
  isInactive?: boolean;
}

export const Stat = (props: StatProps) => {
  const { colorMode } = useColorMode();
  const color = props.isInactive
    ? 'gray.500'
    : colorMode === 'dark'
    ? 'gray.300'
    : 'gray.700';

  return (
    <Stack spacing={0}>
      <Heading size='md' color={color}>
        {fixPercentage(props.stat * 100)}%
      </Heading>
      <Heading size='xs' color={color}>
        {props.label}
      </Heading>
    </Stack>
  );
};
