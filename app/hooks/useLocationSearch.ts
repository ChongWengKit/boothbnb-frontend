'use client'

import { useState, useEffect } from 'react';

export interface LocationSearchResult {
    properties: {
        name: string;
        district?: string;
        state?: string;
        country?: string;
    };
    geometry: {
        coordinates: [number, number];
    };
}

export const useLocationSearch = (initialQuery = '', debounceMs = 1000) => {
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<LocationSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);

    useEffect(() => {
        if (isSelecting) {
            setIsSelecting(false);
            return;
        }

        const timer = setTimeout(() => {
            if (query.length < 3) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            fetch(`${process.env.NEXT_PUBLIC_PHOTON_API_URL}/?q=${query}&limit=5`)
                .then(response => response.json())
                .then(data => {
                    setResults(data.features);
                })
                .catch(error => console.error("Error fetching location data:", error))
                .finally(() => setIsLoading(false));
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [query, debounceMs]);

    return { query, setQuery, results, setResults, isLoading, setIsSelecting };
};
