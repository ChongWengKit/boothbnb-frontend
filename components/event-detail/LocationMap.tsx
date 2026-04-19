'use client'

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { RiFullscreenFill, RiFullscreenExitLine } from "react-icons/ri";

import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { Icon } from 'leaflet'

interface LocationMapProps {
    latitude?: number;
    longitude?: number;
    events?: any[];
    className?: string;
    interactive?: boolean;
    zoom?: number;
}

// Helper components can live in the same file if they are only used here
function RecenterAutomatically({ lat, lng }: { lat: number | undefined; lng: number | undefined }) {
    const map = useMap();
    useEffect(() => {
        if (lat !== undefined && lng !== undefined) {
            map.invalidateSize();
            map.setView([lat, lng], map.getZoom());
        }
    }, [lat, lng, map]);
    return null;
}

const LocationMap: React.FC<LocationMapProps> = ({ latitude, longitude, events, className, interactive = true, zoom}) => {
    const [isMapExpanded, setMapExpand] = useState(false);
    const globalCenter: [number, number] = [20, 0];
    const markerIcon = new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] });

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
                        <Marker position={[latitude, longitude]} icon={markerIcon} />
                    </>
                )}

                {events?.map((event) => (
                    <Marker key={event.id} position={[event.latitude, event.longitude]} icon={markerIcon} />
                ))}
            </MapContainer>
        </div>
    );
};

export default LocationMap;
