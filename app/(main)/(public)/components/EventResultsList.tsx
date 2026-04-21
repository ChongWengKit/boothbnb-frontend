import React from 'react';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';
import EventCard from '@/app/(main)/(public)/components/EventCard';
import type { Event } from '@/app/(main)/(vendor)/hooks/useBookmarks';

interface EventResultsListProps {
  events: Event[];
  isLoading: boolean;
  emptyTitle: string;
  emptySubtitle: string;
  title?: string;
  bookmarks?: Event[];
  onToggleBookmark?: (event: Event) => void;
  showStatus?: boolean;
  className?: string;
  baseUrl?: string;
}

const EventResultsList: React.FC<EventResultsListProps> = ({
  events,
  isLoading,
  emptyTitle,
  emptySubtitle,
  title,
  bookmarks = [],
  onToggleBookmark,
  showStatus = false,
  className = "m-2 rounded-lg bg-card p-4",
  baseUrl = "dashboard"
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="mt-8 rounded-lg border-2 border-dashed border-border bg-card py-20 text-center">
        <p className="text-xl font-semibold text-foreground">{emptyTitle}</p>
        <p className="text-muted-foreground">{emptySubtitle}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && <h2 className="mt-8 text-3xl font-bold text-foreground">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-4 mx-auto">
        {events.map((event) => (
          <Link key={event.id} href={`/${baseUrl}/${event.slug}`}>
            <EventCard
              event={event}
              isBookmarked={bookmarks.some((b) => b.id === event.id)}
              onToggleBookmark={onToggleBookmark}
              showStatus={showStatus}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EventResultsList;