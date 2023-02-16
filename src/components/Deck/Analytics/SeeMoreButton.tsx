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
  const absolute = slug.includes('/');

  return (
    <GridItem gridColumn={'1/-1'}>
      <Button
        color='gray.500'
        size='md'
        variant='ghost'
        onClick={() =>
          router.push(absolute ? slug : router.asPath + '/' + slug)
        }
        rightIcon={<FaArrowRight />}
        isDisabled={loading}
      >
        See more
      </Button>
    </GridItem>
  );
};
