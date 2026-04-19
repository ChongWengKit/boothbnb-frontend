'use client'

import React from 'react';
import { useLocationSearch, type LocationSearchResult } from '@/app/hooks/useLocationSearch';
import { FaMapMarkedAlt } from "react-icons/fa";
import LocationSearchResults from '@/components/LocationSearchResults';

interface LocationSearchInputProps {
  initialValue?: string;
  onLocationSelect: (location: { name: string; lat: number; lon: number }) => void;
  onMapIconClick: () => void;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({ initialValue = '', onLocationSelect, onMapIconClick }) => {
  const { query, setQuery, results, setResults, isLoading, setIsSelecting } = useLocationSearch(initialValue);

  const handleSelect = (result: LocationSearchResult) => {
    const { name } = result.properties;
    const [lon, lat] = result.geometry.coordinates;

    setIsSelecting(true); 
    setQuery(name);      
    setResults([]);       
    onLocationSelect({ name, lat, lon });
  };

  return (
    <div className="flex flex-col w-full relative z-[50]">
      <div className="flex w-full bg-background text-foreground  justify-between px-4 py-4 rounded-lg">
        <input
          type="text"
          placeholder="Search for a location"
          className="outline-none flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        <FaMapMarkedAlt size={20} className="cursor-pointer" onClick={onMapIconClick} />
      </div>

      <LocationSearchResults 
        results={results} 
        isLoading={isLoading} 
        onSelect={handleSelect} 
      />
    </div>
  );
};

export default LocationSearchInput;
