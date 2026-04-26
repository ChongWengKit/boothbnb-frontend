'use client';

import React from 'react';
import { IoPrintOutline } from 'react-icons/io5';

export default function PrintButton() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <button
            onClick={handlePrint}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-4 font-bold transition-all hover:bg-accent"
        >
            <IoPrintOutline size={20} />
            Print Receipt
        </button>
    );
}