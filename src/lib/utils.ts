import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate, formatDistanceToNowStrict } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// date of post function
export function formatRelativeDate(from: Date) {
  const currentDate = new Date();
  // if post is created earlier than 24 hours,
  //  24*60*60*1000 for millie seconds
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    // return from date and set suffix to true
    // suffix looks like 10mins ago, 10 secs ago etc..
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    // if month is in this year and created 24 hours later
    if (currentDate.getFullYear() === from.getFullYear()) {
      // we format the data month and day
      return formatDate(from, "d MMM");
    }
    //  else, we format the day, month and year as well
    else {
      return formatDate(from, "d MMM, yyyy");
    }
  }
}
