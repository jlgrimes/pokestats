import { Heading, HeadingProps } from '@chakra-ui/react';

export const StatsHeading = ({
  children,
  ...rest
}: {
  children: any;
  rest?: Partial<HeadingProps>;
}) => (
  <Heading
    color='gray.600'
    size='sm'
    letterSpacing={1}
    fontWeight={'extrabold'}
    textTransform='uppercase'
    {...rest}
  >
    {children}
  </Heading>
);
