import { Button, GridItem, useColorMode } from '@chakra-ui/react';
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
  const { colorMode } = useColorMode();

  const router = useRouter();
  const absolute = slug.includes('/');

  return (
    <GridItem gridColumn={'1/-1'}>
      <Button
        color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}
        size='md'
        variant='ghost'
        onClick={() =>
          router.push(
            absolute ? slug : router.asPath.split('?')[0] + '/' + slug
          )
        }
        rightIcon={<FaArrowRight />}
        isDisabled={loading}
      >
        {text ?? `See more`}
      </Button>
    </GridItem>
  );
};
