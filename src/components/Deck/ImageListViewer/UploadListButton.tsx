import {
  FormControl,
  FormLabel,
  IconButton,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { IconFileUpload } from '@tabler/icons-react';
import { useRef } from 'react';

export const UploadListButton = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <FormControl isRequired>
      {/* <FormLabel htmlFor='writeUpFile'>{''}</FormLa> */}
      <InputGroup>
        <IconFileUpload
          size={18}
          onClick={e => {
            e.stopPropagation();
            inputRef.current && inputRef.current.click();
          }}
        />
        <input
          ref={inputRef}
          type='file'
          accept={'image/png, image/jpeg, image/heic'}
          onClick={e => {
            e.stopPropagation();
          }}
          // name={name}
          // ref={inputRef}
          // {...inputProps}
          // inputRef={ref}
          style={{ display: 'none' }}
        ></input>
        {/* <Input
        placeholder={placeholder || "Your file ..."}
        onClick={() => inputRef.current.click()}
        value={value}
      /> */}
      </InputGroup>
    </FormControl>
  );
};
