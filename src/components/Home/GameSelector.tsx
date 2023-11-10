import { Bold, Tab, TabGroup, TabList } from "@tremor/react"
import { track } from "@vercel/analytics/react";
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react";

export const GameSelector = () => {
  const router = useRouter();
  const path = router.asPath;

  const getSelectedIndex = useCallback(() => {
    if (path.includes('vgc')) return 1;
    return 0;
  }, [path]);

  const [index, setIndex] = useState(getSelectedIndex());

  useEffect(() => {
    setIndex(getSelectedIndex());
  }, [path]);

  const handleTabClick = useCallback((route: string) => {
    track('Game selector tab clicked', { game: route === '/vgc' ? 'vgc' : 'tcg' });
    router.push(route)
  }, [index]);


  return (
    <div className="flex justify-center">
      <TabGroup className="w-auto" index={index}>
        <TabList variant="solid">
          <Tab onClick={() => handleTabClick('/')}><Bold className="tracking-wide">TCG</Bold></Tab>
          <Tab onClick={() => handleTabClick('/vgc')}><Bold className="tracking-wide">VGC</Bold></Tab>
        </TabList>
      </TabGroup>
    </div>
  )
}