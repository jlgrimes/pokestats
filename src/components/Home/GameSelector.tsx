import { Tab, TabGroup, TabList } from "@tremor/react"
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
    router.push(route)
  }, [index]);


  return (
    <TabGroup className="my-2" index={index}>
      <TabList variant="solid">
        <Tab onClick={() => handleTabClick('/')}>TCG</Tab>
        <Tab onClick={() => handleTabClick('/vgc')}>VGC</Tab>
      </TabList>
    </TabGroup>
  )
}