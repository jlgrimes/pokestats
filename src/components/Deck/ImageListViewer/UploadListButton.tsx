import {
  FormControl,
  FormLabel,
  IconButton,
  InputGroup,
  InputLeftElement,
  useToast,
} from '@chakra-ui/react';
import { IconFileUpload } from '@tabler/icons-react';
import { ChangeEvent, useRef } from 'react';
import supabase from '../../../lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useFinalResults } from '../../../hooks/finalResults';
import { useSession } from 'next-auth/react';
import { usePlayerProfile, useSessionUserProfile } from '../../../hooks/user';

interface UploadListButtonProps {
  placing: number;
  tournamentId: string;
}

export const UploadListButton = (props: UploadListButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: profile } = useSessionUserProfile();
  const { refetch } = useFinalResults({
    playerName: profile?.name,
    additionalNames: profile?.additionalNames,
  });
  const toast = useToast();

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return console.error('No file');

    const ext = file.name.split('.')[1];
    const fileName = uuidv4();
    const { data, error } = await supabase.storage
      .from('uploaded-deck-lists')
      .upload(`${fileName}.${ext}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    const path = data?.path;

    const res = await supabase
      .from('Final Results')
      .update({ uploaded_list_path: path })
      .match({ placing: props.placing, tournament_id: props.tournamentId });

    refetch();
    toast({
      status: 'success',
      title: 'Deck uploaded successfully!',
    });
  };

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
          onChange={handleFileUpload}
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
