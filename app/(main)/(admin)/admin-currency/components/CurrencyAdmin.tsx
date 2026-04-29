
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { updateCurrencyStatusAction } from "../actions";


interface CurrencyRequest {
    currency: string;
    rate: number;
    is_enabled: boolean;
    updated_at: string;
}

interface CurrencyAdminProps {
    requests: CurrencyRequest[];
}
const CurrencyAdmin: React.FC<CurrencyAdminProps> = ({ requests: initialRequests }) => {
    const [requests, setRequests] = useState<CurrencyRequest[]>(initialRequests);
    const prevInitialRequestsRef = useRef<CurrencyRequest[] | null>(null);

    useEffect(() => {

        if (
            !prevInitialRequestsRef.current ||
            JSON.stringify(initialRequests) !== JSON.stringify(prevInitialRequestsRef.current)
        ) {
            setRequests(initialRequests);
            prevInitialRequestsRef.current = initialRequests;
        }
    }, [initialRequests]);

    const handleAction = async (code: string, isEnabled: boolean) => {
        const status = isEnabled ? false : true;
        setRequests(requests.map(req =>
            req.currency === code ? { ...req, is_enabled: !isEnabled } : req
        ));

        const result = await updateCurrencyStatusAction(code, status);
        if (result.success) {
            toast.success(result.message);
        } else { 
            toast.error(result.message);
            setRequests(initialRequests);
        }
    };

    return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card m-4">
        <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                    <th className="px-6 py-4">Currency Code</th>
                    <th className="px-6 py-4">Exchange Rate</th>
                    <th className="px-6 py-4">Last Updated</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border">
                {requests.map((request) => (
                    <tr key={request.currency} className="hover:bg-accent/50 transition-colors">
                        <td className="px-6 py-4 font-bold">{request.currency}</td>
                        <td className="px-6 py-4">{request.rate}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                            {new Date(request.updated_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                            <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${request.is_enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {request.is_enabled ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <Button
                                variant={request.is_enabled ? "destructive" : "default"}
                                className="cursor-pointer"
                                size="sm"
                                onClick={() => handleAction(request.currency, request.is_enabled)}
                            >
                                {request.is_enabled ? "Disable" : "Enable"}
                            </Button>
                        </td>
                    </tr>
                ))}
                {requests.length === 0 && (
                    <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground italic">No currencies found</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
    );
};
export default CurrencyAdmin;