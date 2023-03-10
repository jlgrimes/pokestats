import { Link, Stack, Text } from '@chakra-ui/react';
import { useTwitterLink } from '../../hooks/twitter';
import { Banner } from '../common/Banner';

export const BetaBanner = () => {
  // TODO: update text once we're out of beta
  const showBetaBanner = process.env.NEXT_PUBLIC_ENV !== 'production';
  const myTwitter = useTwitterLink('jgrimesey');

  return showBetaBanner ? (
    <Banner title='PokéStats Live is currently in beta'>
      <Link href={myTwitter} isExternal>
        <Text color='blue.500'>{`Please let me know if something is broken!`}</Text>
      </Link>
    </Banner>
  ) : null;
};
