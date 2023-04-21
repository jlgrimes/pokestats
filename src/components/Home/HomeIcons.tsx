import NextLink from 'next/link';
import { Button, ButtonGroup, HStack } from '@chakra-ui/react';
import {
  FaHeart,
  FaInfo,
  FaInfoCircle,
  FaRegQuestionCircle,
} from 'react-icons/fa';
import { IconInfoCircle, IconInfoCircleFilled } from '@tabler/icons-react';

export const HomeIcons = () => (
  <HStack justifyContent={'center'}>
    <ButtonGroup size='sm'>
      <Button as={NextLink} href='/about' leftIcon={<FaInfoCircle />}>
        About
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
