'use client';

import React from "react";
import EventResultsList from "@/app/(main)/(public)/components/EventResultsList";
import { useUserContext } from "@/app/contexts/UserContext";
import type { Event } from "@/app/(main)/(vendor)/actions/useBookmarks";
import { Button } from "@/components/ui/button";
import { LayoutList, Map as MapIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const DashboardMapView = dynamic(() => import("./DashboardMapView"), { ssr: false });

export default function EventResultsContainer({ initialEvents, totalItems }: { initialEvents: Event[], totalItems: number}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const viewMode = (searchParams.get("view") as 'list' | 'map') || 'list';
    const { user } = useUserContext();

    const handleToggleView = () => {
        const nextMode = viewMode === 'list' ? 'map' : 'list';
        const params = new URLSearchParams(searchParams.toString());
        params.set('view', nextMode);

        if (nextMode === 'list') {
            params.delete('lat');
            params.delete('lon');
            params.delete('zoom');
            params.delete('sw_lat');
            params.delete('sw_lng');
            params.delete('ne_lat');
            params.delete('ne_lng');
        }
        router.replace(`/dashboard?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex flex-col w-full relative">
            <div className={`
    flex justify-end px-4 
    ${viewMode === 'map'
                    ? 'absolute right-4 top-4 z-[1001] md:relative md:inset-auto md:mt-4 md:z-auto'
                    : 'mt-4'}
`}>
                <Button
                    variant="outline"
                    onClick={handleToggleView}
                    className={`flex items-center gap-2 bg-background text-foreground shadow-sm hover:text-foreground}`}
                >
                    {viewMode === 'list' ? <MapIcon size={18} /> : <LayoutList size={18} />}
                    {viewMode === 'list' ? 'Search by Map' : 'Show List'}
                </Button>
            </div>

            {viewMode === 'list' ? (
                <EventResultsList
                    events={initialEvents}
                    isLoading={false}
                    emptyTitle="No events found"
                    emptySubtitle="Try adjusting your search area or dates."
                    title={totalItems> 0 ? `Found ${totalItems} events` : undefined}
                    enableBookmark={user?.role === 'VENDOR'}
                />
            ) : (
                <DashboardMapView events={initialEvents} />
            )}
        </div>
    );
}