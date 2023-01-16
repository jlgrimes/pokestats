import { Button, GridItem } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaArrowRight } from 'react-icons/fa';

export const SeeMoreButton = ({ slug }: { slug: string }) => {
  const router = useRouter();

  return (
    <GridItem gridColumn={'1/-1'}>
      <Button
        size='sm'
        variant='outline'
        onClick={() => router.push(router.asPath + slug)}
        rightIcon={<FaArrowRight />}
      >
        See more
      </Button>
    </GridItem>
  );
};
