"use client"
import { formatEventDate } from "@/app/lib/util";

export default function EventDate({ dateString }: { dateString: string }) {
  const formattedDate = formatEventDate(dateString);

  return (
    <span suppressHydrationWarning>
      {formattedDate}
    </span>
  );
}