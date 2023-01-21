import { Link, Stack, Text } from '@chakra-ui/react';
import { useTwitterLink } from '../../hooks/twitter';

export const BetaBanner = () => {
  // TODO: update text once we're out of beta
  const showBetaBanner = process.env.NEXT_PUBLIC_ENV !== 'production';
  const myTwitter = useTwitterLink('jgrimesey');

  return showBetaBanner ? (
    <Stack
      paddingX={4}
      paddingY={2}
      backgroundColor='blue.50'
      borderRadius={4}
      spacing={0}
      // outline='solid'
      // outlineColor='yellow.700'
    >
      <Text as='b'>PokéStats Live is currently in beta</Text>
      <Link href={myTwitter} isExternal>
        <Text color='blue.500' >{`Please let me know if something is broken!`}</Text>
      </Link>
    </Stack>
  ) : null;
};
