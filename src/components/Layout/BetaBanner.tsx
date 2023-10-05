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
      10/4: Expect things to be broken! Currently no decks are displayed and all optimization is out.
    </Callout>
  )
};
