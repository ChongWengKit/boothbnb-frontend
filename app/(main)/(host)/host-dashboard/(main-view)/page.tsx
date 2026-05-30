
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import HostDashboardSearch from "./components/HostDashboardSearch";
import HostDashboardResultsLoader from "./components/HostDashboardResultLoader";
interface HostDashboardPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
        category?: "VERIFICATION" | "PASSWORD_RESET" | "BOOKING_CONFIRMATION" | "HOST_APPROVED" | "ADMIN_INVITATION";
        status?: "PENDING" | "SUCCESSFUL" | "FAILED" | "BOUNCED" | "COMPLAINED";
    }>;
}
const HostDashboardPage = async (props: HostDashboardPageProps) => {
    const searchParams = await props.searchParams;
    const suspenseKey = JSON.stringify(searchParams);

    return (
        <div className="flex flex-col justify-center">
            <HostDashboardSearch />
            <Suspense
                key={suspenseKey}
                fallback={
                    <div className="flex items-center justify-center py-20">
                        <Spinner className="size-8" />
                    </div>
                }
            >
                <HostDashboardResultsLoader searchParams={searchParams} />
            </Suspense>
        </div>
    )
}

export default HostDashboardPage;