import { useMemo } from "react";
import { useIsMobile } from "./device";

export const useTwitterLink = (twitterHandle: string | undefined) => {
  const [isMobile] = useIsMobile();
  const twitterLink = useMemo(
    () =>
      `${isMobile ? 'twitter://user?screen_name=' : 'https://twitter.com/'}${
        twitterHandle
      }`,
    [twitterHandle, isMobile]
  );

  return twitterLink;
}