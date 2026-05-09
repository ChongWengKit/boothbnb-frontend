'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import EventCard from "@/app/(main)/(public)/components/EventCard";
import type { Event } from "@/app/(main)/(vendor)/actions/useBookmarks";
import { Spinner } from "@/components/ui/spinner";

const markerIcon = typeof window !== 'undefined' ? new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
}) : null;

interface MapBounds {
    ne_lat: number;
    ne_lng: number;
    sw_lat: number;
    sw_lng: number;
}

function MapEvents({ onMove, onMoveEnd }: { onMove: (coords: [number, number]) => void, onMoveEnd: (coords: [number, number], zoom: number, bounds: MapBounds) => void }) {
    const map = useMapEvents({
        move: () => {
            const center = map.getCenter();
            onMove([center.lat, center.lng]);
        },
        moveend: () => {
            const center = map.getCenter();
            const bounds = map.getBounds();
            onMoveEnd([center.lat, center.lng], map.getZoom(), {
                ne_lat: bounds.getNorthEast().lat,
                ne_lng: bounds.getNorthEast().lng,
                sw_lat: bounds.getSouthWest().lat,
                sw_lng: bounds.getSouthWest().lng
            });
        }
    });
    return null;
}



export default function DashboardMapView({ events: serverEvents }: { events: Event[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const defaultCenter: [number, number] = [40.7128, -74.0060];

    const getUrlCoords = useCallback((): [number, number] => {
        const lat = searchParams.get("lat");
        const lon = searchParams.get("lon");
        const parsedLat = lat ? parseFloat(lat) : defaultCenter[0];
        const parsedLon = lon ? parseFloat(lon) : defaultCenter[1];

        return [
            isNaN(parsedLat) ? defaultCenter[0] : parsedLat,
            isNaN(parsedLon) ? defaultCenter[1] : parsedLon
        ];
    }, [searchParams]);
    const centerRef = useRef<[number, number]>(getUrlCoords());

    const [center, setCenter] = useState<[number, number]>(getUrlCoords());
    const lastFiltersRef = useRef("");

    useEffect(() => {
        const filters = [
            searchParams.get("query"),
            searchParams.get("title"),
            searchParams.get("category"),
            searchParams.get("start_date"),
            searchParams.get("end_date")
        ].join("|");


        lastFiltersRef.current = filters;
    }, [searchParams]);

    const boundsRef = useRef<MapBounds | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const loadingStartRef = useRef<number | null>(null);

    useEffect(() => {
        if (isLoading) {
            if (!loadingStartRef.current) {
                loadingStartRef.current = Date.now();
            }
        } else {
            loadingStartRef.current = null;
        }
    }, [isLoading]);

    useEffect(() => {
        if (isLoading && loadingStartRef.current) {
            const elapsed = Date.now() - loadingStartRef.current;
            const remainingTime = Math.max(0, 2000 - elapsed);

            const timeoutId = setTimeout(() => {
                setIsLoading(false);
            }, remainingTime);
            return () => clearTimeout(timeoutId);
        }
    }, [isLoading]);

    const handleMove = useCallback((coords: [number, number]) => {
        centerRef.current = coords;
    }, []);

    const handleMoveEnd = useCallback((coords: [number, number], newZoom: number, bounds: MapBounds) => {
        setIsLoading(true);
        loadingStartRef.current = Date.now(); 
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            const params = new URLSearchParams(window.location.search);
            params.set("lat", coords[0].toFixed(6));
            params.set("lon", coords[1].toFixed(6));
            params.set("ne_lat", bounds.ne_lat.toFixed(6));
            params.set("ne_lng", bounds.ne_lng.toFixed(6));
            params.set("sw_lat", bounds.sw_lat.toFixed(6));
            params.set("sw_lng", bounds.sw_lng.toFixed(6));
            params.delete("page");
            
            router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
        }, 1000);
    }, [router]);

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);

        const urlCoords = getUrlCoords();

        if (
            Math.abs(urlCoords[0] - centerRef.current[0]) > 0.0001 ||
            Math.abs(urlCoords[1] - centerRef.current[1]) > 0.0001
        ) {
            setCenter(urlCoords);
            centerRef.current = urlCoords;
        }

        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [searchParams, getUrlCoords]);

    return (
        <div className="relative h-dvh md:h-[80vh] rounded-none md:rounded-xl border-none md:border shadow-inner mt-0 md:mt-4">
            <style dangerouslySetInnerHTML={{
                __html: `
                /* Complete Leaflet Popup Reset */
                .leaflet-popup-content-wrapper {
                    padding: 0 !important;
                    background: transparent !important; /* Fix white layer popping out */
                    box-shadow: none !important;
                    border-radius: 0 !important;
                    border: none !important;
                }
                .leaflet-popup-content {
                    margin: 0 !important;
                    width: 288px !important; /* Exact match for EventCard w-72 */
                    padding: 0 !important;
                    /* Block Leaflet font garbage and reset to app defaults */
                    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                    line-height: 1.5 !important;
                    color: inherit !important;
                }
                .leaflet-popup-tip-container, .leaflet-popup-close-button {
                    display: none !important;
                }
                .leaflet-container a {
                    color: inherit !important;
                }
    .leaflet-control-zoom {
    filter: invert(0) !important; /* Ensure no dark mode inversion is leaking in */
}

            `}} />

            <MapContainer center={center} zoom={13} className="h-full w-full z-0">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapEvents onMove={handleMove} onMoveEnd={handleMoveEnd} />
                {markerIcon && serverEvents.map((event) => (
                    <Marker
                        key={event.id}
                        position={[event.latitude, event.longitude]}
                        icon={markerIcon}
                    >
                        <Popup autoPan={false} className="min-w-[200px] md:min-w-[300px]"
                        >
                            <Link
                                href={`/dashboard/${event.slug}`}
                                className="block transition-transform hover:scale-[1.02]"
                            >
                                <EventCard event={event} />
                            </Link>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {isLoading && (
                <div className="absolute top-8 left-1/2 z-[1000] flex -translate-x-1/2 items-center gap-3 rounded-full bg-card/90 px-6 py-2 text-foreground shadow-2xl backdrop-blur-sm md:top-auto md:bottom-8">
                    <Spinner className="size-4 border-white/30 border-t-white" />
                    <span className="text-sm font-medium tracking-wide">Searching area...</span>
                </div>
            )}
        </div>
    );
}