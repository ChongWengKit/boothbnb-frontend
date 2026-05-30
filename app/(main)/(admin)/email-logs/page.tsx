
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import EmailLogsSearch from "./components/EmailLogsSearch";
import EmailLogsResultsLoader from "./components/EmailLogsResultLoader";
interface EmailLogsPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
        category?: "VERIFICATION" | "PASSWORD_RESET" | "BOOKING_CONFIRMATION" | "HOST_APPROVED" | "ADMIN_INVITATION";
        status?: "PENDING" | "SUCCESSFUL" | "FAILED" | "BOUNCED" | "COMPLAINED";
    }>;
}
const EmailLogsPage = async (props: EmailLogsPageProps) => {
    const searchParams = await props.searchParams;
    const suspenseKey = JSON.stringify(searchParams);

    return (
        <div className="flex flex-col justify-center">
            <EmailLogsSearch />
            <Suspense
                key={suspenseKey}
                fallback={
                    <div className="flex items-center justify-center py-20">
                        <Spinner className="size-8" />
                    </div>
                }
            >
                <EmailLogsResultsLoader searchParams={searchParams} />
            </Suspense>
        </div>
    )
}

export default EmailLogsPage;