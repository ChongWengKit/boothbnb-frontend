import React, { Suspense } from "react";
import DashboardSearch from "./DashboardSearch";
import EventResultsLoader from "./EventResultsLoader";
import { Spinner } from "@/components/ui/spinner";

interface PageProps {
    searchParams: Promise<{
        query?: string;
        lat?: string;
        lon?: string;
        from?: string;
        to?: string;
        page?: string;
        limit?: string;
        title?: string;
        category?: string;
        view?: string | undefined;

    }>;
}

const Dashboard = async (props: PageProps) => {
    const searchParams = await props.searchParams;

    const suspenseKey = JSON.stringify(searchParams);

    return (
        <div className="flex flex-col justify-center">
            <DashboardSearch />
            <Suspense
                key={suspenseKey}
                fallback={
                    <div className="flex items-center justify-center py-20">
                        <Spinner className="size-8" />
                    </div>
                }
            >
                <EventResultsLoader searchParams={searchParams} />
            </Suspense>
        </div>
    );
};

export default Dashboard;