'use client';

import React from "react";
import { formatEventDate } from "@/app/lib/util";
import { Button } from "@/components/ui/button";
import { updateApprovalAction } from "../actions";
import toast from "react-hot-toast";

interface AdminRequest {
    user: {
        id: number;
        username: string;
        email:string;
    };
    action_type: ActionType;
    status: "PENDING" | "APPROVED" | "REJECTED";
    created_at: string;
    updated_at: Date | null;
    id: number;
    user_id: number;
}

enum ActionType {
    HOST_APPROVAL = "HOST_APPROVAL"
}

interface AdminApprovalProps {
    requests: AdminRequest[];
}

const AdminApproval: React.FC<AdminApprovalProps> = ({ requests }) => {
    console.log(requests);
    const handleAction = async (id: number, status: "APPROVED" | "REJECTED") => {
        const result = await updateApprovalAction(id, status);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    if (requests.length === 0) {
        return (
            <div className="mt-8 rounded-lg border-2 border-dashed border-border bg-card py-20 text-center">
                <p className="text-xl font-semibold text-foreground">No pending requests</p>
                <p className="text-muted-foreground">Everything is currently up to date.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 bg-secondary rounded-lg p-4">
            {requests.map((request) => (
                <div key={request.id} className="grid grid-cols-1 items-center gap-4 rounded-xl border border-transparent bg-background p-6 transition-colors md:grid-cols-12">
                    <div className="md:col-span-4 min-w-0">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">User</p>
                        <div className="flex flex-col">
                            <h2 className="truncate text-lg font-bold text-foreground">{request.user.username}</h2>
                            <p className="text-sm font-medium text-muted-foreground">User ID: {request.user_id}</p>
                            <p className="text-sm font-medium text-muted-foreground">Email: {request.user.email}</p>
                        </div>
                    </div>

                    <div className="border-t border-border pt-4 md:col-span-3 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Action Type</p>
                        <p className="text-sm font-semibold text-foreground">
                            {request.action_type.replace(/_/g, ' ')}
                        </p>
                    </div>

                    <div className="border-t border-border pt-4 md:col-span-2 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Requested On</p>
                        <p className="text-sm text-muted-foreground">
                            {formatEventDate(request.created_at)}
                        </p>
                    </div>

                    <div className="md:col-span-3 flex md:justify-end gap-2">
                        {request.status === "PENDING" && (
                            <>
                                <Button 
                                    className="p-2 bg-green-500 rounded-lg text-white font-bold hover:bg-green-700 cursor-pointer"
                                    onClick={() => handleAction(request.id, "APPROVED")}
                                >
                                    Approve
                                </Button>
                                <Button 
                                    variant="destructive"
                                    className="p-2 cursor-pointer rounded-lg text-white font-bold"
                                    onClick={() => handleAction(request.id, "REJECTED")}
                                >
                                    Reject
                                </Button>
                            </>
                        )}
                        {request.status === "APPROVED" && (
                            <div className="bg-green-500 p-2 rounded-lg">
                                <p className="text-white font-bold">Approved</p>
                            </div>
                        )}
                        {request.status === "REJECTED" && (
                            <div className="bg-red-500 p-2 rounded-lg">
                                <p className="text-white font-bold">Rejected</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminApproval;
