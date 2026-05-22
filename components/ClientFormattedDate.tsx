'use client';

import { formatEventDate } from "@/app/lib/util";
import React from "react";

interface ClientFormattedDateProps {
    dateString: string;
}

const ClientFormattedDate: React.FC<ClientFormattedDateProps> = ({ dateString }) => {
    return <>{formatEventDate(dateString)}</>;
};

export default ClientFormattedDate;