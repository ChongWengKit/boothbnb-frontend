
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import AdminDashboardResultsLoader from "../admin-dashboard/components/AdminDashboardResultLoader"
import AdminDashboardSearch from "./components/AdminDashboardSearch";
interface AdminDashboardPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
        status?: string;
        actionType?: string;
    }>;
}
const AdminDashboardPage = async (props: AdminDashboardPageProps) => {
    const searchParams = await props.searchParams;
    const suspenseKey = JSON.stringify(searchParams);

    return (
        <div className="flex flex-col justify-center">
            <AdminDashboardSearch />
            <Suspense
                key={suspenseKey}
                fallback={
                    <div className="flex items-center justify-center py-20">
                        <Spinner className="size-8" />
                    </div>
                }
            >
                <AdminDashboardResultsLoader searchParams={searchParams} />
            </Suspense>
        </div>
    )
}

export default AdminDashboardPage;