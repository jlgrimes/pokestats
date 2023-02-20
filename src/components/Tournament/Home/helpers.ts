import { addMinutes, format } from 'date-fns';

export const getLocalTime = (utcOffsetMinutes: number) => {
  const now = new Date();
  const currentOffset = now.getTimezoneOffset();

  const timeZoneDate = addMinutes(now, currentOffset + utcOffsetMinutes);
  return format(timeZoneDate, 'eee LLL d K:mm aaa');
};
