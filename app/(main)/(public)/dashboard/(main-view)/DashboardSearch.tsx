'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { type DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import LocationSearchResults from "@/components/LocationSearchResults";
import DateRangePicker from "@/app/(main)/(public)/components/DateRangePicker";
import { useLocationSearch } from "@/app/actions/useLocationSearch";
import { IoIosSearch } from "react-icons/io";
import { IoFilter } from "react-icons/io5";

const CATEGORIES = [
    { value: "ART_CRAFT", label: "Art & Craft" },
    { value: "FOOD_BEVERAGE", label: "Food & Beverage" },
    { value: "FASHION_BEAUTY", label: "Fashion & Beauty" },
    { value: "TECH_GADGETS", label: "Tech & Gadgets" },
    { value: "HOME_LIVING", label: "Home & Living" },
    { value: "CORPORATE_TRADE", label: "Corporate & Trade" },
    { value: "ANIME_COMIC", label: "Anime & Comic (ACG)" },
    { value: "THRIFT_VINTAGE", label: "Thrift & Vintage" },
    { value: "WELLNESS_FITNESS", label: "Wellness & Fitness" },
    { value: "PET_FAIR", label: "Pet Fair" },
    { value: "EDUCATIONAL", label: "Educational" },
    { value: "OTHERS", label: "Others" },
];

interface Coordinates {
    lat: number | null;
    lon: number | null;
    type: string | null;
    ne_lat: number | null;
    ne_lng: number | null;
    sw_lat: number | null;
    sw_lng: number | null;
}

export default function DashboardSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const viewMode = searchParams.get("view") || 'list';

    const [showFilters, setShowFilters] = useState(false);
    const [date, setDate] = useState<DateRange | undefined>(() => {
        const startParam = searchParams.get("start_date");
        const endParam = searchParams.get("end_date");

        return {
            from: startParam ? new Date(startParam) : new Date(),
            to: endParam ? new Date(endParam) : new Date(Date.now() + 604800000),
        };
    });

    const [coordinates, setCoordinates] = useState<Coordinates>({
        lat: searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null,
        lon: searchParams.get("lon") ? parseFloat(searchParams.get("lon")!) : null,
        type: searchParams.get("type") || null,
        ne_lat: searchParams.get("ne_lat") ? parseFloat(searchParams.get("ne_lat")!) : null,
        ne_lng: searchParams.get("ne_lng") ? parseFloat(searchParams.get("ne_lng")!) : null,
        sw_lat: searchParams.get("sw_lat") ? parseFloat(searchParams.get("sw_lat")!) : null,
        sw_lng: searchParams.get("sw_lng") ? parseFloat(searchParams.get("sw_lng")!) : null,
    });
    const [zoom, setZoom] = useState<number | null>(
        searchParams.get("zoom") ? parseInt(searchParams.get("zoom")!) : null
    );

    useEffect(() => {
        const lat = searchParams.get("lat");
        const lon = searchParams.get("lon");
        const z = searchParams.get("zoom");

        const newLat = lat ? parseFloat(lat) : null;
        const newLon = lon ? parseFloat(lon) : null;
        const newZoom = z ? parseInt(z) : null;

        const timeoutId = setTimeout(() => {
            setCoordinates(prev => {
                if (prev.lat === newLat && prev.lon === newLon) return prev;
                return { ...prev, lat: newLat, lon: newLon };
            });

            setZoom(prev => (prev === newZoom ? prev : newZoom));
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [searchParams]);

    const [title, setTitle] = useState(searchParams.get("title") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "");

    const {
        query,
        setQuery,
        results,
        setResults,
        isLoading,
        setIsSelecting
    } = useLocationSearch(searchParams.get("query") || "");

    const handleQueryChange = (value: string, lat?: number, lon?: number, extent?: number[], type?: string) => {
        setQuery(value);
        setCoordinates({
            lat: null,
            lon: null,
            type: null,
            ne_lat: null,
            ne_lng: null,
            sw_lat: null,
            sw_lng: null
        });

        if ((lat && lon) || (extent && extent.length > 0)) {
            setIsSelecting(true);
            setCoordinates(prev => ({
                ...prev,
                lat: lat ?? null,
                lon: lon ?? null,
                type: type || null,
                sw_lng: extent ? extent[0] : null,
                sw_lat: extent ? extent[3] : null,
                ne_lng: extent ? extent[2] : null,
                ne_lat: extent ? extent[1] : null,
            }));
            setZoom(15);
            setResults([]);
        }
    };

    const handleSubmit = () => {
        const params = new URLSearchParams();
        if (viewMode !== 'map') {

            if (coordinates.lat !== null) params.set("lat", coordinates.lat.toString());
            if (coordinates.lon !== null) params.set("lon", coordinates.lon.toString());
            if (coordinates.type) params.set("type", coordinates.type);

            if (coordinates.ne_lat !== null) params.set("ne_lat", coordinates.ne_lat.toString());
            if (coordinates.ne_lng !== null) params.set("ne_lng", coordinates.ne_lng.toString());
            if (coordinates.sw_lat !== null) params.set("sw_lat", coordinates.sw_lat.toString());
            if (coordinates.sw_lng !== null) params.set("sw_lng", coordinates.sw_lng.toString());
            if (zoom) params.set("zoom", zoom.toString());
        } else {
            const currentParams = new URLSearchParams(window.location.search);
            ['lat', 'lon', 'ne_lat', 'ne_lng', 'sw_lat', 'sw_lng', 'zoom'].forEach(key => {
                const val = currentParams.get(key);
                if (val) params.set(key, val);
            });
        }
        if (coordinates.type) params.set("type", coordinates.type);
        if (query) params.set("query", query);
        if (date?.from) params.set("start_date", date.from.toISOString());
        if (date?.to) params.set("end_date", date.to.toISOString());
        if (title) params.set("title", title);
        if (category) params.set("category", category);
        const view = searchParams.get("view");
        if (view) params.set("view", view);

        const limit = searchParams.get("limit");
        if (limit) params.set("limit", limit);
        params.set("page", "1");
        router.push(`/dashboard?${params.toString()}`);
    };

    return (
        <div className={`flex flex-col px-4 py-4 gap-4 rounded-lg bg-background ${viewMode === 'map' ? 'hidden md:flex' : 'flex'}`}>
            <div className="flex flex-wrap gap-4 items-center">
                <div className="relative flex flex-grow flex-shrink-0 items-center">
                    <div className="relative flex-1 items-center">
                        <IoIosSearch className="absolute left-3 top-3 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Location"
                            className="w-full rounded-lg border border-border bg-background px-4 py-1 pl-10 text-foreground"
                            value={query}
                            onChange={(e) => handleQueryChange(e.target.value)}
                        />
                    </div>
                    <LocationSearchResults
                        results={results}
                        isLoading={isLoading}
                        onSelect={(result) =>
                            handleQueryChange(result.properties.name, result.geometry.coordinates[1], result.geometry.coordinates[0], result.properties.extent, result.properties.type)
                        }
                    />
                </div>
                <div className="flex items-center flex-shrink-1">
                    <DateRangePicker date={date} onSelect={setDate} className="w-full border border-border bg-background text-foreground hover:text-foreground" />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className={`md:hidden rounded-md border p-2 transition-all ${showFilters ? "bg-accent text-accent-foreground" : "bg-background text-foreground"
                            }`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <IoFilter size={20} />
                    </button>
                    <Button className="cursor-pointer rounded-md px-4" onClick={handleSubmit}>Submit</Button>
                </div>
            </div>

            <div className={`flex flex-wrap gap-4 items-center pt-2 border-t  ${showFilters ? 'flex' : 'hidden md:flex'}`}>
                <div className="flex items-center flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Event Title..."
                        className="w-full rounded-lg border border-border bg-background px-4 py-1 text-foreground"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="flex items-center flex-1 min-w-[200px]">
                    <select
                        className="w-full rounded-lg border border-border bg-background px-4 py-1 text-foreground"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}