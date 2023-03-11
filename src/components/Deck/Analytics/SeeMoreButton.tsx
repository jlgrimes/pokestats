import { Button, GridItem } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaArrowRight } from 'react-icons/fa';

export const SeeMoreButton = ({
  slug,
  loading,
  text,
}: {
  slug: string;
  loading?: boolean;
  text?: string;
}) => {
  const router = useRouter();
  const absolute = slug.includes('/');

  return (
    <GridItem gridColumn={'1/-1'}>
      <Button
        color='gray.600'
        size='md'
        variant='ghost'
        onClick={() =>
          router.push(absolute ? slug : router.asPath + '/' + slug)
        }
        rightIcon={<FaArrowRight />}
        isDisabled={loading}
      >
        {text ?? `See more`}
      </Button>
    </GridItem>
  );
};
