'use client'

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { RiFullscreenFill, RiFullscreenExitLine } from "react-icons/ri";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'

interface LocationMapProps {
    latitude: number;
    longitude: number;
    onMapClick: (lat: number, lng: number) => void;
    className?: string;
}

function RecenterAutomatically({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            map.invalidateSize();
            map.setView([lat, lng], map.getZoom());
        }, 0);
        return () => clearTimeout(timeoutId);
    }, [lat, lng, map]);
    return null;
}

function MapClickHandler({ setCoordinates }: { setCoordinates: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            setCoordinates(lat, lng);
        },
    });
    return null;
}

const LocationMap: React.FC<LocationMapProps> = ({ latitude, longitude, onMapClick, className }) => {
    const [isMapExpanded, setMapExpand] = useState(false);

    return (
        <div
            className={`
                ${isMapExpanded
                    ? 'fixed inset-0 z-[10000] m-0 rounded-none'
                    : `relative w-full h-[500px] z-[48] mt-4 rounded-lg ${className || ''}`
                } 
            overflow-hidden border shadow-lg duration-300
            `}
        >
            <div
                className="absolute top-5 right-5 z-[1001] cursor-pointer rounded-md border border-border bg-card p-2 shadow-md transition-colors hover:bg-accent"
                onClick={() => setMapExpand(!isMapExpanded)}
            >
                {isMapExpanded ? <RiFullscreenExitLine size={20} /> : <RiFullscreenFill size={20} />}
            </div>

            <MapContainer
                center={[latitude, longitude]}
                zoom={18}
                className="h-full w-full z-[47]"
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <RecenterAutomatically lat={latitude} lng={longitude} />
                <MapClickHandler setCoordinates={onMapClick} />

                {typeof window !== 'undefined' && (
                    <Marker 
                        position={[latitude, longitude]} 
                        icon={new L.Icon({
                            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        })}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default LocationMap;
