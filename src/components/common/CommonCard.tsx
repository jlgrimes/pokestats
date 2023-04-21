import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardProps,
  Heading,
  HStack,
  Skeleton,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { memo } from 'react';
import { SeeMoreButton } from '../Deck/Analytics/SeeMoreButton';
import { StatsHeading } from './StatsHeading';

interface CommonCardProps {
  header?: string;
  subheader?: string;
  children: JSX.Element;
  leftIcon?: JSX.Element;
  slug?: string;
  ghost?: boolean;
  loading?: boolean;
  shouldRemovePadding?: boolean;
  smallHeader?: boolean;
  slugText?: string;
  rightElement?: JSX.Element;
}

export const CommonCard = memo(
  (props: CommonCardProps & Partial<CardProps>) => {
    const { colorMode } = useColorMode();

    return (
      <Card
        style={
          props.ghost
            ? {
                borderRadius: 'none',
                boxShadow: 'none',
                padding: props.shouldRemovePadding ? 0 : 'auto',
              }
            : {}
        }
        variant={props.ghost ? 'unstyled' : 'elevated'}
        paddingX={2}
        paddingY={3}
        gap={3}
        {...props}
      >
        {(props.header || props.rightElement) && (
          <HStack justifyContent='space-between'>
            {props.header && (
              <CardHeader
                padding={0}
                display='flex'
                flexDirection={'column'}
                gap={1}
              >
                {!props.loading ? (
                  <StatsHeading
                    headingProps={{
                      color: colorMode === 'dark' ? 'gray.400' : 'gray.600',
                      size: props.smallHeader ? 'xs' : 'sm',
                    }}
                  >
                    {props.leftIcon ? (
                      <HStack>
                        {props.leftIcon}
                        <Text>{props.header}</Text>
                      </HStack>
                    ) : (
                      props.header
                    )}
                  </StatsHeading>
                ) : (
                  <Skeleton height='6' width='70' />
                )}
                {props.subheader &&
                  (!props.loading ? (
                    <Heading color='gray.500' size='sm' fontWeight={'semibold'}>
                      {props.subheader}
                    </Heading>
                  ) : (
                    <Skeleton height='6' width='70' />
                  ))}
              </CardHeader>
            )}
            {props.rightElement ?? null}
          </HStack>
        )}
        <CardBody padding={0}>{props.children}</CardBody>
        {props.slug && (
          <CardFooter padding={0}>
            <SeeMoreButton slug={props.slug} text={props.slugText} />
          </CardFooter>
        )}
      </Card>
    );
  }
);

CommonCard.displayName = 'CommonCard';
