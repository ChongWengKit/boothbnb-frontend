import { Suspense } from "react";
import CurrencySearch from "../admin-currency/components/CurrencySearch";
import { Spinner } from "@/components/ui/spinner";
import CurrencyResultsLoader from "./components/CurrencyResultLoader";
interface PageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
        status?: string;
        actionType?: string;
    }>;
}

const AdminCurrencyPage = async (props : PageProps) => {
     const searchParams = await props.searchParams;

    return (
        <div className="flex flex-col justify-center">
            <CurrencySearch />
            <Suspense
                key={searchParams.toString()}
                fallback={
                    <div className="flex items-center justify-center py-20">
                        <Spinner className="size-8" />
                    </div>
                }
            >
                <CurrencyResultsLoader searchParams={searchParams} />
            </Suspense>
        </div>
    );
};

export default AdminCurrencyPage;