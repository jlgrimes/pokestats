import { Heading, Stack, useColorMode } from '@chakra-ui/react';
import { useColor } from '../../hooks/useColor';
import { fixPercentage } from '../Deck/ListViewer/CardViewer.tsx/helpers';

interface StatProps {
  stat: number;
  label: string;
  isInactive?: boolean;
  shouldHideLabel?: boolean;
}

export const Stat = (props: StatProps) => {
  const { active, inactive } = useColor();
  const color = props.isInactive ? inactive : active;

  return (
    <Stack spacing={0}>
      <Heading size='md' color={color}>
        {fixPercentage(props.stat * 100)}%
      </Heading>
      {!props.shouldHideLabel && (
        <Heading size='xs' color={color}>
          {props.label}
        </Heading>
      )}
    </Stack>
  );
};
