import { Spinner, useToast } from "@chakra-ui/react";
import { useSessionPlayerProfile } from "../../hooks/user"
import { Button, Flex, Text, TextInput } from "@tremor/react";
import { useState } from "react";
import supabase from "../../lib/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";

export const PtcgLiveNameInput = () => {
  const [screenNameInput, setScreenNameInput] = useState('');
  const { data: user, isLoading } = useSessionPlayerProfile();
  const userSupa = useUser();
  const toast = useToast();

  const onNameSubmit = async () => {
    const res = await supabase.from('Player Profiles').update({ ptcg_live_name: screenNameInput }).match({ id: userSupa?.id });
    if (res.error) {
      toast({
        status: 'error',
        title: 'Error updating player profile',
        description: res.error.message,
      });
      return null;
    }
  
    toast({
      status: 'success',
      title: 'Success! Please refresh the page.',
    });
  }

  if (isLoading) return <Spinner />;
  if (user?.ptcg_live_name) return null;

  return (
    <div className="p-12 flex flex-col gap-4">
      <Text>What is your PTCG Live screen name? We only ask you this once.</Text>
      <Flex className="gap-4">
        <TextInput placeholder="PTCG Live screen name" onChange={(e) => setScreenNameInput(e.target.value)} />
        <Button disabled={screenNameInput.length === 0} onClick={onNameSubmit}>Submit</Button>
      </Flex>
    </div>
  )
}