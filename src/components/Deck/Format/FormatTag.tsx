import { BadgeProps, Tag } from '@chakra-ui/react';
import { FormatSchema } from '../../../hooks/formats/formats';

interface FormatTagProps {
  format: FormatSchema;
  removeSpacing?: boolean;
}

export const FormatTag = (props: FormatTagProps & BadgeProps) => {
  const { format, removeSpacing, ...rest } = props;
  return (
    <Tag {...rest} ml={removeSpacing ? 0 : 2} mt={removeSpacing ? 0 : 2}>
      {format.rotation} Block
    </Tag>
  );
};
