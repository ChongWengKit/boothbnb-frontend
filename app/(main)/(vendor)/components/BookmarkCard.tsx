import React from 'react';
import { format } from 'date-fns';
import { Toggle } from '@/components/ui/toggle';
import { BookmarkIcon } from 'lucide-react';
import type { Event } from '@/app/(main)/(vendor)/hooks/useBookmarks';
import Image from "next/image";

interface BookmarkCardProps {
  bookmark: Event;
  onToggleBookmark: (event: Event) => void;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, onToggleBookmark }) => {
  return (
    <div className="w-72 flex flex-col group bg-background rounded-lg shadow-md p-4">
      <div className="relative overflow-hidden">
        <Image
          className="w-full h-40 bg-secondary rounded-t-lg transition-transform duration-300 group-hover:scale-105"
          src={`https://picsum.photos/id/${bookmark.id % 1000}/400/300`}
          alt={bookmark.title}
          fill
        />
        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Toggle
            aria-label="Toggle bookmark"
            size="sm"
            variant="outline"
            className="cursor-pointer bg-background hover:bg-muted"
            pressed={true} 
            onPressedChange={() => onToggleBookmark(bookmark)}
          >
            <BookmarkIcon className="group-data-[state=on]/toggle:fill-foreground" />
          </Toggle>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold line-clamp-1">{bookmark.title}</h3>
        <p className="mb-2 text-sm text-muted-foreground">
          {format(new Date(bookmark.start_date), "MMM d")} - {format(new Date(bookmark.end_date), "MMM d, yyyy")}
        </p>
        <div className="mt-auto">
          <p className="line-clamp-1 text-sm italic text-muted-foreground">{bookmark.address}</p>
          <div className="flex justify-between items-center mt-2 pt-2 border-t">
            <span className="text-xs font-medium uppercase tracking-tighter text-muted-foreground">Capacity</span>
            <p className="text-sm font-semibold">{`${bookmark.total_bookings} / ${bookmark.total_capacity}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkCard;
