'use client';
import React from 'react';
import { type LocationSearchResult } from '@/app/actions/useLocationSearch';

interface LocationSearchResultsProps {
  results: LocationSearchResult[];
  isLoading: boolean;
  onSelect: (result: LocationSearchResult) => void;
}

const LocationSearchResults: React.FC<LocationSearchResultsProps> = ({
  results,
  isLoading,
  onSelect,
}) => {
  if (!isLoading && (!results || results.length === 0)) return null;

  return (
    <ul className="absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-border bg-popover shadow-xl">
      {isLoading ? (
        <li className="bg-muted h-32 w-full rounded-sm animate-pulse" />
      ) : (
        results.map((result, index) => {
          const { name, district, country, state } = result.properties;
          const address = [district, country, state].filter(Boolean).join(", ");

          return (
            <li
              key={index}
              className="cursor-pointer rounded-sm px-4 py-2 hover:bg-accent"
              onClick={() => onSelect(result)}
            >
              <h3 className="text-lg">{name}</h3>
              {address && <p className="text-xs text-muted-foreground">{address}</p>}
            </li>
          );
        })
      )}
    </ul>
  );
};

export default LocationSearchResults;