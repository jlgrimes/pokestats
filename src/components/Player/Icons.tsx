import { Icon } from '@chakra-ui/react';
import { FaCheck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export const VerifiedIcon = ({ subtle }: { subtle?: boolean }) => (
  <Icon
    as={FaCheckCircle}
    boxSize={subtle ? 3 : 4}
    color={subtle ? 'blue.500' : 'blue.300'}
    zIndex={3}
  />
);
export const NotVerifiedIcon = ({ subtle }: { subtle?: boolean }) => (
  <Icon
    as={FaTimesCircle}
    boxSize={subtle ? 3 : 4}
    color='gray.500'
    zIndex={3}
  />
);
