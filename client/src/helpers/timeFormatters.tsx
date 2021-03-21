import { differenceInHours, differenceInMinutes, format, parseISO } from 'date-fns';
import { toDate } from 'date-fns-tz';

import { timeZones } from 'src/modules/auctions/editAuction/DetailsPage/consts';

export function toHumanReadableDuration(date: string): string | null {
  let hours = differenceInHours(toDate(date), new Date());
  let inPast = false;

  if (hours < 0) {
    hours = Math.abs(hours);
    inPast = true;
  }

  if (hours === 0) {
    const minutes = Math.abs(differenceInMinutes(toDate(date), new Date()));
    return minutes ? `${minutes}m` : null;
  }

  const hoursLeft = hours % 24;
  const daysLeft = Math.floor(hours / 24);
  const left = [daysLeft ? `${daysLeft}d` : '', hoursLeft ? `${hoursLeft}h` : ''];

  if (inPast) {
    left.push('ago');
  }

  return left.join(' ');
}

export function toFullHumanReadableDatetime(date: string): string | null {
  const currentDate = toDate(parseISO(date));
  const day = format(currentDate, 'd.mm.yy');
  const time = format(currentDate, 'hh:mm');
  const dayPeriod = format(currentDate, 'a');
  const timeZone = format(currentDate, 'x');
  const currentTimeZone = timeZones.find((x) => x.value === timeZone);

  return `${day} @ ${time} ${dayPeriod} ${currentTimeZone || timeZone}`;
}
