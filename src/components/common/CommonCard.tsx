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
}: {
  header?: string;
  children: JSX.Element;
  slug?: string;
}) => {
  return (
    <Card>
      {header && (
        <CardHeader paddingX={4} paddingBottom={0}>
          <Heading color='gray.700' size='md' fontWeight={'semibold'}>
            {header}
          </Heading>
        </CardHeader>
      )}
      <CardBody padding={4}>
        {children}
      </CardBody>
      {slug && (
        <CardFooter paddingLeft={4} paddingTop={0}>
          <SeeMoreButton slug={slug} />
        </CardFooter>
      )}
    </Card>
  );
};
