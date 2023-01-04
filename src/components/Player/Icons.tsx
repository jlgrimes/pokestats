import { Icon } from '@chakra-ui/react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export const VerifiedIcon = () => (
  <Icon as={FaCheckCircle} color='twitter.500' zIndex={3} />
);
export const NotVerifiedIcon = () => (
  <Icon as={FaTimesCircle} color='gray.500' zIndex={3} />
);
