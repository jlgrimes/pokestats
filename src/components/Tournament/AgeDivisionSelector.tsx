import { Tab, TabGroup, TabList } from "@tremor/react"
import { useRouter } from "next/router"
import { useCallback } from "react";

interface AgeDivisionSelectorProps {
  urlConstructor: (ageDivision: string) => string;
}

export const AgeDivisionSelector = (props: AgeDivisionSelectorProps) => {
  const router = useRouter();
  const path = router.asPath;

  const getSelectedIndex = useCallback(() => {
    if (path.includes('juniors')) return 2;
    if (path.includes('seniors')) return 1;
    return 0;
  }, [path]);

  const index = getSelectedIndex();

  const handleTabClick = useCallback((division: string) => {
    if (division === 'masters' && index === 0) return;
    if (division === 'seniors' && index === 1) return;
    if (division === 'juniors' && index === 2) return;

    router.push(props.urlConstructor(division))
  }, [index]);

  return (
    <TabGroup className="my-2" index={index}>
      <TabList variant="solid">
        <Tab onClick={() => handleTabClick('masters')}>Masters</Tab>
        <Tab onClick={() => handleTabClick('seniors')}>Seniors</Tab>
        <Tab onClick={() => handleTabClick('juniors')}>Juniors</Tab>
      </TabList>
    </TabGroup>
  )
}

export const useRoutedAgeDivision = () => {
  const router = useRouter();
  const path = router.asPath;

  if (path.includes('juniors')) return 'juniors';
  if (path.includes('seniors')) return 'seniors';

  return 'masters';
}