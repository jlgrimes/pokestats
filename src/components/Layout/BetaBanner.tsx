import { Bold, Button, Callout, Text } from "@tremor/react";
import { useTwitterLink } from "../../hooks/twitter";

export const BetaBanner = () => {
  const myTwitter = useTwitterLink('jgrimesey');

  return (
    <Callout
      className="mx-4 mb-4"
      title='This is a beta version of pokestats.live'
      color='amber'
    >
      Things may not work as expected - please let me know <a href={myTwitter} target="_blank" rel="noopener noreferrer"><Bold>@jgrimesey</Bold></a> if something is wrong.
    </Callout>
  )
};
