import { Icon } from '@chakra-ui/react';
import { FaCheck, FaCheckCircle, FaQuestionCircle, FaTimesCircle } from 'react-icons/fa';

export const VerifiedIcon = ({ subtle }: { subtle?: boolean }) => (
  <Icon
    as={FaCheckCircle}
    boxSize={subtle ? 3 : 4}
    color={'blue.300'}
    zIndex={3}
  />
);
export const NotVerifiedIcon = ({ subtle }: { subtle?: boolean }) => (
  <Icon
    as={subtle ? FaQuestionCircle : FaTimesCircle}
    boxSize={subtle ? 3 : 4}
    color={subtle ? 'gray.400' : 'gray.500'}
    zIndex={3}
  />
);
