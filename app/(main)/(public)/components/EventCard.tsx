'use client';

import React, { useState } from 'react';
import { Toggle } from '@/components/ui/toggle';
import { BookmarkIcon } from 'lucide-react';
import type { Event } from '@/app/(main)/(vendor)/actions/useBookmarks';
import { useToggleBookmark } from '@/app/(main)/(vendor)/actions/useToggleBookmark';
import Image from "next/image";
import ClientFormattedDate from '@/components/ClientFormattedDate';

export const statusConfig = {
  DRAFT: { label: "DRAFT", style: "bg-yellow-100 text-yellow-800" },
  PUBLISHED: { label: "PUBLISHED", style: "bg-green-100 text-green-800" },
  CLOSED: { label: "CLOSED", style: "bg-red-100 text-red-800" },
  CANCELLED: { label: "CANCELLED", style: "bg-primary text-primary-foreground" },
};

export type EventStatus = keyof typeof statusConfig;

interface EventCardProps {
  event: Event & { status?: EventStatus };
  enableBookmark?: boolean;
  onBookmarkChange?: (event: Event, isBookmarked: boolean) => void;
  showStatus?: boolean;
  variant?: 'grid' | 'horizontal';
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  enableBookmark = false,
  onBookmarkChange,
  showStatus = false,
  variant = 'grid'
}) => {
  const isHorizontal = variant === 'horizontal';
  const { toggleBookmark } = useToggleBookmark();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => event.is_bookmarked ?? false);

  const handleToggleBookmark = async () => {
    const prevIsBookmarked = isBookmarked;
    setIsBookmarked(!prevIsBookmarked);
    try {
      await toggleBookmark(event, prevIsBookmarked);
      onBookmarkChange?.(event, !prevIsBookmarked);
    } catch {
      setIsBookmarked(prevIsBookmarked);
    }
  };

  return (
    <div className={`group flex w-full rounded-lg bg-card p-4 shadow-md transition-all hover:shadow-lg ${isHorizontal ? 'flex-col gap-4 lg:h-44 lg:flex-row' : 'h-full flex-col'}`}>
      <div className={`relative overflow-hidden shrink-0 rounded-lg ${isHorizontal ? 'w-full lg:w-64 aspect-video lg:aspect-auto ' : 'w-full aspect-video'}`}>
        {event.thumbnail ? (
          <Image
            className="object-cover bg-secondary rounded-lg transition-transform duration-300 group-hover:scale-105"
            src={event.thumbnail}
            alt={event.title}
            fill
          />
        ) : (
          <div className=" w-full h-full bg-secondary rounded-t-lg"></div>
        )}
        {enableBookmark && (
          <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}>
            <Toggle
              aria-label="Toggle bookmark"
              size="sm"
              variant="outline"
              className="cursor-pointer bg-background hover:bg-muted"
              pressed={isBookmarked}
              onPressedChange={handleToggleBookmark}
            >
              <BookmarkIcon className="group-data-[state=on]/toggle:fill-foreground" />
            </Toggle>
          </div>
        )}
      </div>
      <div className={`${isHorizontal ? 'py-2 md:p-0' : 'p-2'} flex flex-col flex-grow min-w-0`}>
        <h3 className="line-clamp-1 text-lg font-bold text-card-foreground">{event.title}</h3>
        <p className="mb-2 text-sm text-muted-foreground">
          <ClientFormattedDate dateString={event.start_date} formatString="MMM d" /> -{" "}
          <ClientFormattedDate dateString={event.end_date} formatString="MMM d, yyyy" />
        </p>
        <div className="mt-auto">
          {showStatus && event.status ? (
            <p className="line-clamp-1 text-sm italic text-muted-foreground">
              <span className={`${statusConfig[event.status].style} px-2 py-0.5 rounded not-italic font-medium`}>
                {statusConfig[event.status].label}
              </span>
            </p>
          ) : (
            <p className="line-clamp-1 text-sm italic text-muted-foreground">{event.address}</p>
          )}
          <div className="flex justify-between items-center mt-2 pt-2 border-t">
            <span className="text-xs font-medium uppercase tracking-tighter text-muted-foreground">Capacity</span>
            <p className="text-sm text-card-foreground font-semibold">{`${event.available_booths} / ${event.total_capacity}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;