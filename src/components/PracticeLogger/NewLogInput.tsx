import { Button, Card, Textarea } from "@tremor/react";
import { useState } from "react";
import { uploadGameLog } from "./helpers";
import { useUser } from "@supabase/auth-helpers-react";
import { useToast } from "@chakra-ui/react";
import { useSessionPlayerProfile } from "../../hooks/user";

export const NewLogInput = () => {
  const [value, setValue] = useState('');
  const user = useUser();
  const { data: playerProfile } = useSessionPlayerProfile();
  const toast = useToast();

  return (
    <Card className="mx-auto max-w-lg">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (user?.id) {
            const res = await uploadGameLog(user.id, value, playerProfile?.ptcg_live_name, toast);
            if (res) setValue('');
          }
        }}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            Paste in an exported game log from PTCG Live
          </label>
          <Textarea
            onChange={(e) => setValue(e.target.value)}
            id="description"
            placeholder="Start typing here..."
            rows={6}
            value={value}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={value.length < 20 || !value.includes('Turn #') || !value.includes('Setup') || !value.includes('\n')}>
            Import
          </Button>
        </div>
      </form>
  </Card>
  )
}