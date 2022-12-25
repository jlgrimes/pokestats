import { Button, Link, Text } from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa';
import { useIsMobile } from '../../hooks/device';

export const ComplainLink = () => {
  const [isMobile] = useIsMobile();
  return (
    <Button
      as={Link}
      variant={'link'}
      color={'twitter.500'}
      rightIcon={<FaArrowRight />}
      href={
        isMobile
          ? 'twitter.com/jgrimesey'
          : 'twitter://user?screen_name=jgrimesey'
      }
      isExternal
    >
      Complain to me on Twitter
    </Button>
  );
};
