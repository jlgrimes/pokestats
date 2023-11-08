import { useQuery } from "@tanstack/react-query";
import { EventGame, MapCenter } from "./types";
import { isAfter, isSameDay, parseISO } from "date-fns";

const fetchEvents = async (center: MapCenter | undefined, shouldShowLocals?: boolean): Promise<Record<any, any>[]> => {
  if (!center) return [];

  const res = await fetch(`/api/events/?lat=${center.lat}&lng=${center.lng}`);
  const data = await res.json();
  let events = data['activities'];

  if (!shouldShowLocals) events = events?.filter((event: Record<any, any>) => event.tags.includes('championship_series'));

  events = events.sort((a: Record<any, any>, b: Record<any, any>) => {
    const aDate = parseISO(a.start_datetime);
    const bDate = parseISO(b.start_datetime);
    
    if (isSameDay(aDate, bDate)) {
      if (a.distance < b.distance) return -1;
      return 1;
    }

    if (isAfter(aDate, bDate)) return 1;
    return -1;
  });

  return events;
}

export const useEvents = (center: MapCenter | undefined, shouldShowLocals?: boolean, filteredGame?: EventGame, maxDistance?: number) => {
  const { data, ...rest } =  useQuery({
    queryKey: ['events', center],
    queryFn: () => fetchEvents(center, shouldShowLocals)
  });

  let transformedData = filteredGame ? data?.filter((event: Record<any, any>) => event.products.includes(filteredGame)) : data;
  transformedData = maxDistance ? data?.filter((event: Record<any, any>) => event.distance < maxDistance) : transformedData;

  return {
    ...rest,
    data: transformedData
  }
}