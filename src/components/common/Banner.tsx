import { Stack, Text, useColorMode } from '@chakra-ui/react';

export const Banner = ({
  title,
  children,
  color,
}: {
  title?: string;
  children: JSX.Element;
  color?: string;
}) => {
  const { colorMode } = useColorMode();

  return (
    <Stack
      paddingX={4}
      paddingY={2}
      backgroundColor={`${color ?? 'blue'}.${colorMode === 'dark' ? 800 : 50}`}
      borderRadius={4}
      spacing={0}
      // outline='solid'
      // outlineColor='yellow.700'
    >
      {title && <Text as='b'>{title}</Text>}
      {children}
    </Stack>
  );
};
