import { Tag } from '@chakra-ui/react';
import { FormatSchema } from '../../../hooks/formats/formats';

interface FormatTagProps {
  format: FormatSchema;
  removeSpacing?: boolean;
}

export const FormatTag = (props: FormatTagProps) => {
  return (
    <Tag ml={props.removeSpacing ? 0 : 2} mt={props.removeSpacing ? 0 : 2}>
      {props.format.rotation} Block
    </Tag>
  );
};
