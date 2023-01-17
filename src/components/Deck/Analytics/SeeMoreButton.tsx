import { Button, GridItem } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaArrowRight } from 'react-icons/fa';

export const SeeMoreButton = ({
  slug,
  loading,
}: {
  slug: string;
  loading?: boolean;
}) => {
  const router = useRouter();

  return (
    <GridItem gridColumn={'1/-1'}>
      <Button
        color='gray.500'
        size='sm'
        variant='ghost'
        onClick={() => router.push(router.asPath + slug)}
        rightIcon={<FaArrowRight />}
        disabled={loading}
      >
        See more
      </Button>
    </GridItem>
  );
};
