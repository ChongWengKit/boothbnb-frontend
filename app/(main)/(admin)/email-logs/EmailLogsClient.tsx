'use client';

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import EmailLogsList from "./components/EmailLogsList";

interface EmailLog {
    id: number;
    user_id: number;
    category: "VERIFICATION" | "PASSWORD_RESET" | "BOOKING_CONFIRMATION" | "HOST_APPROVED" | "ADMIN_INVITATION";
        payload: {
        email: string;
        name: string;
    };
    status: "PENDING" | "SUCCESSFUL" | "FAILED" | "BOUNCED" | "COMPLAINED";
    email_id: string | null;
    attempts: number;
}


interface PaginationMeta {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface EmailLogsClientProps {
    emailLogs: EmailLog[];
    paginationMeta?: PaginationMeta;
}
const EmailLogsClient: React.FC<EmailLogsClientProps> = ({ emailLogs, paginationMeta }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <>
            <div className="mt-6">
                <EmailLogsList logs={emailLogs} />
            </div>

            {paginationMeta && (
                <Pagination
                    currentPage={paginationMeta.currentPage}
                    totalPages={paginationMeta.totalPages}
                    onPageChange={handlePageChange}
                    hasNextPage={paginationMeta.hasNextPage}
                    hasPreviousPage={paginationMeta.hasPreviousPage}
                />
            )}
        </>
    );
};

export default EmailLogsClient;