import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Skeleton,
} from '@chakra-ui/react';
import { SeeMoreButton } from '../Deck/Analytics/SeeMoreButton';

export const CommonCard = ({
  header,
  subheader,
  children,
  slug,
  ghost,
  loading,
}: {
  header?: string;
  subheader?: string;
  children: JSX.Element;
  slug?: string;
  ghost?: boolean;
  loading?: boolean;
}) => {
  // Everything is ghost!
  ghost = true;
  return (
    <Card variant={ghost ? 'unstyled' : 'elevated'}>
      {header && (
        <CardHeader
          paddingX={ghost ? 2 : 6}
          paddingBottom={ghost ? 2 : 0}
          display='flex'
          flexDirection={'column'}
          gap={1}
        >
          {!loading ? (
            <Heading
              color='gray.600'
              size='sm'
              letterSpacing={1}
              fontWeight={'extrabold'}
              textTransform='uppercase'
            >
              {header}
            </Heading>
          ) : (
            <Skeleton height='6' width='70' />
          )}
          {subheader &&
            (!loading ? (
              <Heading color='gray.500' size='sm' fontWeight={'semibold'}>
                {subheader}
              </Heading>
            ) : (
              <Skeleton height='6' width='70' />
            ))}
        </CardHeader>
      )}
      <CardBody padding={ghost ? 0 : 4}>{children}</CardBody>
      {slug && (
        <CardFooter
          padding={ghost ? 0 : 4}
          paddingTop={ghost ? 2 : 0}
        >
          <SeeMoreButton slug={slug} />
        </CardFooter>
      )}
    </Card>
  );
};
