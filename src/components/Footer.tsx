import {
  HStack,
  Icon,
  IconButton,
  Link,
  Stack,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { FaGithub, FaTwitter } from 'react-icons/fa';
import NextLink from 'next/link';
import { useTwitterLink } from '../hooks/twitter';
import { useColor } from '../hooks/useColor';
import Image from 'next/image';
import { TCGPLAYER_AFFILIATE_URL } from '../lib/url';

export const Footer = () => {
  const myTwitter = useTwitterLink('jgrimesey');
  const { subheader } = useColor();

  return (
    <Stack padding={6} justifyContent={'center'} alignItems='center'>
      <Link href={TCGPLAYER_AFFILIATE_URL} isExternal>
        <Image
          src='/Powered-By-TCGplayer-Primary-Horizontal-RGB_500px.png'
          width='200'
          height='50'
          alt='TCGplayer Affiliate Link'
        />
      </Link>
      <Text fontSize={'sm'} color={subheader}>
        Made by Jared Grimes
      </Text>
      <HStack spacing={4}>
        <Link as={NextLink} href={myTwitter} target='_blank'>
          <Icon color={subheader} as={FaTwitter} />
        </Link>
        <Link
          as={NextLink}
          href={'https://github.com/jlgrimes'}
          target='_blank'
        >
          <Icon color={subheader} as={FaGithub} />
        </Link>
      </HStack>
    </Stack>
  );
};
