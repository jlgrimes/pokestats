import { Bold, Button, Callout, Text } from "@tremor/react";
import { useTwitterLink } from "../../hooks/twitter";

export const BetaBanner = () => {
  const myTwitter = useTwitterLink('jgrimesey');

  return (
    <Callout
      className="mb-4"
      title='This is a beta version of pokestats.live'
      color='amber'
    >
      10/6: Expect things to be broken! We might need to call code red and update prod with this.
    </Callout>
  )
};
