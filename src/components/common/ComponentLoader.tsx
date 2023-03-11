import { Box, Flex } from '@chakra-ui/react';
import PulseLoader from 'react-spinners/PulseLoader';
import SyncLoader from 'react-spinners/SyncLoader';

interface ComponentLoaderProps {
  isLiveComponent?: boolean;
}

export const ComponentLoader = (props: ComponentLoaderProps) => {
  if (props.isLiveComponent) {
    return (
      <Flex justifyContent={'center'} opacity={0.4} width='100%' padding={8}>
        <SyncLoader size={10} />
      </Flex>
    );
  }

  return (
    <Flex justifyContent={'center'} opacity={0.4} width='100%'>
      <PulseLoader size={5} />
    </Flex>
  );
};
