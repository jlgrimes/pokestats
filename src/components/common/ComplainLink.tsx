import { Button, Link, Text } from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa';
import { useIsMobile } from '../../hooks/device';

export const ComplainLink = () => {
  const [isMobile] = useIsMobile();
  return (
    <Button
      as={Link}
      variant={'solid'}
      colorScheme='twitter'
      rightIcon={<FaArrowRight />}
      href={
        isMobile
          ? 'twitter://user?screen_name=jgrimesey'
          : 'http://twitter.com/jgrimesey'
      }
      isExternal
    >
      Complain to me on Twitter
    </Button>
  );
};
