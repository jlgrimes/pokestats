import NextLink from 'next/link';
import { Button, ButtonGroup, HStack } from '@chakra-ui/react';
import { FaHeart, FaRegQuestionCircle } from 'react-icons/fa';

export const HomeIcons = () => (
  <HStack justifyContent={'center'}>
    <ButtonGroup size='sm'>
      <Button as={NextLink} href='/help' leftIcon={<FaRegQuestionCircle />}>
        Help
      </Button>
      <Button
        colorScheme='pink'
        as={NextLink}
        href='https://t.co/ruYHo54RjN'
        target='_blank'
        leftIcon={<FaHeart />}
      >
        Donate
      </Button>
    </ButtonGroup>
  </HStack>
);
