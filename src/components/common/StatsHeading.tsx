import { Heading, HeadingProps } from '@chakra-ui/react';

export const StatsHeading = ({
  children,
  headingProps,
}: {
  children: any;
  headingProps?: Partial<HeadingProps>;
}) => (
  <Heading
    size='sm'
    letterSpacing={1}
    fontWeight={'extrabold'}
    textTransform='uppercase'
    {...headingProps}
  >
    {children}
  </Heading>
);
