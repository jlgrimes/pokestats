import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
} from '@chakra-ui/react';
import { SeeMoreButton } from '../Deck/Analytics/SeeMoreButton';

export const CommonCard = ({
  header,
  children,
  slug,
  ghost,
}: {
  header?: string;
  children: JSX.Element;
  slug?: string;
  ghost?: boolean;
}) => {
  return (
    <Card variant={ghost ? 'unstyled' : 'elevated'}>
      {header && (
        <CardHeader paddingX={4} paddingBottom={0}>
          <Heading color='gray.700' size='md' fontWeight={'semibold'}>
            {header}
          </Heading>
        </CardHeader>
      )}
      <CardBody padding={ghost ? 0 : 4}>{children}</CardBody>
      {slug && (
        <CardFooter
          padding={ghost ? 0 : 4}
          paddingTop={ghost ? 4 : 0}
        >
          <SeeMoreButton slug={slug} />
        </CardFooter>
      )}
    </Card>
  );
};
