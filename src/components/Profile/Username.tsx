import { Heading, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

export const Username = ({
  children,
  isLink,
  small,
}: {
  children: string;
  isLink?: boolean;
  small?: boolean;
}) => {
  const text = isLink ? (
    <Link as={NextLink} href={`/player/${children}`}>{`@${children}`}</Link>
  ) : (
    `@${children}`
  );

  return (
    <Heading
      size={small ? 'md' : 'lg'}
      color={isLink ? 'blue.600' : 'gray.500'}
      fontWeight='semibold'
    >
      {text}
    </Heading>
  );
};
