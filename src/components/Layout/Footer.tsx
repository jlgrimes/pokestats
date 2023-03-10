import { HStack, Icon, IconButton, Link, Stack, Text } from '@chakra-ui/react';
import { FaGithub, FaTwitter } from 'react-icons/fa';
import NextLink from 'next/link';
import { useTwitterLink } from '../../hooks/twitter';

export const Footer = () => {
  const myTwitter = useTwitterLink('jgrimesey');

  return (
    <Stack
      padding={6}
      justifyContent={'center'}
      alignItems='center'
    >
      <Text fontSize={'sm'} color='gray.700'>
        Made by Jared Grimes
      </Text>
      <HStack spacing={4}>
        <Link as={NextLink} href={myTwitter} target='_blank'>
          <Icon color='gray' as={FaTwitter} />
        </Link>
        <Link as={NextLink} href={'https://github.com/jlgrimes'} target='_blank'>
          <Icon color='gray' as={FaGithub} />
        </Link>
      </HStack>
    </Stack>
  );
};
