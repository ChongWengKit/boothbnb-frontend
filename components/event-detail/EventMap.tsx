"use client";

import dynamic from "next/dynamic";


const LocationMap = dynamic(() => import("@/components/event-detail/LocationMap"), { ssr: false });

export default function EventMap({ 
    latitude, 
    longitude, 
    events, 
    interactive = true,
    zoom
}: { latitude?: number; longitude?: number; events?: any[]; interactive?: boolean, zoom?: number }) {
    return (
        <LocationMap zoom ={zoom} latitude={latitude} longitude={longitude} events={events} interactive={interactive} />
    );
}