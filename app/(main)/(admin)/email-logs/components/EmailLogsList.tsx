'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { resendEmailAction } from "../actions";
import toast from "react-hot-toast";

interface EmailLog {
    id: number;
    user_id: number;
    category: string;
    payload: {
        email: string;
        name: string;
    };
    status: "PENDING" | "SUCCESSFUL" | "FAILED" | "BOUNCED" | "COMPLAINED";
    email_id: string | null;
    attempts: number;
}

interface EmailLogsListProps {
    logs: EmailLog[];
}

const EmailLogsList: React.FC<EmailLogsListProps> = ({ logs }) => {
    const handleResend = async (id: number) => {
        const result = await resendEmailAction(id);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    if (logs.length === 0) {
        return (
            <div className="mt-8 rounded-lg border-2 border-dashed border-border bg-card py-20 text-center">
                <p className="text-xl font-semibold text-foreground">No email logs found</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 bg-secondary rounded-lg p-4">
            {logs.map((log) => (
                <div key={log.id} className="grid grid-cols-1 items-center gap-4 rounded-xl border border-transparent bg-background p-6 transition-colors md:grid-cols-12 shadow-sm">
                    <div className="md:col-span-3 min-w-0">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Category</p>
                        <h2 className="truncate text-sm font-bold text-foreground">{log.category.replace(/_/g, ' ')}</h2>
                        <p className="text-xs text-muted-foreground">User ID: {log.user_id}</p>
                    </div>

                    <div className="border-t border-border pt-4 md:col-span-3 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Recipient</p>
                        <p className="text-xs font-medium text-foreground truncate">{log.payload.email || log.payload.name}</p>
                        <p className="text-[10px] text-muted-foreground">Resend ID: {log.email_id || 'N/A'}</p>
                    </div>

                    <div className="border-t border-border pt-4 md:col-span-2 md:border-t-0 md:border-l md:pt-0 md:pl-6 text-center">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</p>
                        <span className={`inline-block px-2 py-1 text-[10px] font-bold rounded-full ${log.status === 'BOUNCED' || log.status === 'COMPLAINED' ? 'bg-primary text-primary-foreground' :
                                log.status === 'SUCCESSFUL' ? 'bg-green-100 text-green-700' :
                                    log.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                            }`}>
                            {log.status}
                        </span>
                    </div>

                    <div className="border-t border-border pt-4 md:col-span-2 md:border-t-0 md:border-l md:pt-0 md:pl-6 text-center">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Attempts</p>
                        <p className="text-sm font-semibold">{log.attempts}/3</p>
                    </div>

                    <div className="md:col-span-2 flex md:justify-end gap-2">
                        {log.status === "FAILED" && (
                            <Button
                                className="text-xs cursor-pointer"
                                onClick={() => handleResend(log.id)}
                            >
                                Resend
                            </Button>
                        )}
                        {log.status === "SUCCESSFUL" && (
                            <div className="bg-green-500/10 border border-green-500/20 p-2 rounded-lg">
                                <p className="text-green-600 text-xs font-bold text-center">Sent</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EmailLogsList;