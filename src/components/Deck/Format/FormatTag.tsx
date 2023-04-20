import { Tag } from '@chakra-ui/react';
import { FormatSchema } from '../../../hooks/formats/formats';

interface FormatTagProps {
  format: FormatSchema;
}

export const FormatTag = (props: FormatTagProps) => {
  return (
    <Tag ml={2} mt={2}>
      {props.format.rotation} Block
    </Tag>
  );
};
