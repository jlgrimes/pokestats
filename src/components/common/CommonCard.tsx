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
  children,
  slug,
  ghost,
  loading,
}: {
  header?: string;
  children: JSX.Element;
  slug?: string;
  ghost?: boolean;
  loading?: boolean;
}) => {
  return (
    <Card variant={ghost ? 'unstyled' : 'elevated'}>
      {header && (
        <CardHeader paddingX={4} paddingBottom={0}>
          {!loading ? (
            <Heading color='gray.700' size='md' fontWeight={'semibold'}>
              {header}
            </Heading>
          ) : (
            <Skeleton height='6' width='70' />
          )}
        </CardHeader>
      )}
      <CardBody padding={ghost ? 0 : 4}>{children}</CardBody>
      {slug && (
        <CardFooter padding={ghost ? 0 : 4} paddingTop={ghost ? 4 : 0}>
          <SeeMoreButton slug={slug} />
        </CardFooter>
      )}
    </Card>
  );
};
