'use client';

import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { formatEventDate } from "@/app/lib/util";

interface ClientFormattedDateProps {
    dateString: string;
    formatString?: string;
}

const ClientFormattedDate: React.FC<ClientFormattedDateProps> = ({ dateString, formatString }) => {
    const date = new Date(dateString);
    const formatted = formatString ? format(date, formatString) : formatEventDate(dateString);

    return <>{formatted}</>;
};

export default ClientFormattedDate;