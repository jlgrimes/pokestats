import { Icon } from '@chakra-ui/react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export const VerifiedIcon = () => <Icon as={FaCheckCircle} color='red.600' />;
export const NotVerifiedIcon = () => (
  <Icon as={FaTimesCircle} color='gray.500' />
);
