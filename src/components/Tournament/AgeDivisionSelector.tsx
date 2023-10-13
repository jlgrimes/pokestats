import { Tab, TabGroup, TabList } from "@tremor/react"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { AgeDivision } from "../../../types/age-division";

interface AgeDivisionSelectorProps {
  urlConstructor?: (ageDivision: string) => string;
  setAgeDivision?: Dispatch<SetStateAction<AgeDivision>>
}

export const AgeDivisionSelector = (props: AgeDivisionSelectorProps) => {
  const router = useRouter();
  const path = router.asPath;

  const getSelectedIndex = useCallback(() => {
    if (path.includes('juniors')) return 2;
    if (path.includes('seniors')) return 1;
    return 0;
  }, [path]);

  const [index, setIndex] = useState(getSelectedIndex());

  const handleTabClick = useCallback((division: AgeDivision) => {
    if (division === 'masters' && index === 0) return;
    if (division === 'seniors' && index === 1) return;
    if (division === 'juniors' && index === 2) return;

    if (props.urlConstructor) {
      router.push(props.urlConstructor(division));
    } else if (props.setAgeDivision) {
      props.setAgeDivision(division);
      setIndex(division === 'juniors' ? 2 : division === 'seniors' ? 1 : 0);
    }
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