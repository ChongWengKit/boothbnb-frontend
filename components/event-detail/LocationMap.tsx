'use client'

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { RiFullscreenFill, RiFullscreenExitLine } from "react-icons/ri";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'

export interface MapEvent {
    id: number | string;
    latitude: number;
    longitude: number;
}

interface LocationMapProps {
    latitude?: number;
    longitude?: number;
    events?: MapEvent[];
    className?: string;
    interactive?: boolean;
    zoom?: number;
}

function RecenterAutomatically({ lat, lng }: { lat: number | undefined; lng: number | undefined }) {
    const map = useMap();
    useEffect(() => {
        if (lat !== undefined && lng !== undefined) {
            const timeoutId = setTimeout(() => {
                map.invalidateSize();
                map.setView([lat, lng], map.getZoom());
            }, 0);
            return () => clearTimeout(timeoutId);
        }
    }, [lat, lng, map]);
    return null;
}

const LocationMap: React.FC<LocationMapProps> = ({ latitude, longitude, events, className, interactive = true, zoom}) => {
    const [isMapExpanded, setMapExpand] = useState(false);
    const globalCenter: [number, number] = [20, 0];
    const markerIcon = typeof window !== 'undefined' ? new L.Icon({
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }) : null;

    return (
        <div
            className={`
                ${isMapExpanded
                    ? 'fixed inset-0 z-[10000] m-0 rounded-none'
                    : `relative w-full h-full z-[48] rounded-lg ${className || ''}`
                } 
            overflow-hidden border shadow-lg duration-300
            `}
        >
           {interactive && (
                <div
                    className="absolute top-5 right-5 z-[1001] p-2 bg-background rounded-md shadow-md hover:bg-primary cursor-pointer border border-gray-300"
                    onClick={() => setMapExpand(!isMapExpanded)}
                >
                    {isMapExpanded ? <RiFullscreenExitLine size={20} /> : <RiFullscreenFill size={20} />}
                </div>
            )}

            <MapContainer
                center={latitude !== undefined && longitude !== undefined ? [latitude, longitude] : globalCenter}
                zoom={zoom || 2}
                className="h-full w-full"
                zoomControl={interactive}
                dragging={interactive}
                scrollWheelZoom={interactive}
                doubleClickZoom={interactive}
                touchZoom={interactive}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {!events && latitude !== undefined && longitude !== undefined && (
                    <>
                        <RecenterAutomatically lat={latitude} lng={longitude} />
                        {markerIcon && <Marker position={[latitude, longitude]} icon={markerIcon} />}
                    </>
                )}

                {events?.map((event) => (
                    markerIcon && <Marker key={event.id} position={[event.latitude, event.longitude]} icon={markerIcon} />
                ))}
            </MapContainer>
        </div>
    );
};

export default LocationMap;
