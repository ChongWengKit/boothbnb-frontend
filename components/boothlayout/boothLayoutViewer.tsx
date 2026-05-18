'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useCurrency } from "@/components/CurrencyProvider";
import { IoClose } from "react-icons/io5";
import { Spinner } from '@/components/ui/spinner';
interface BoothLayoutViewerProps {
    booths: Booth[];
    onClose?: () => void;
    onCheckout?: (booth: Booth) => void | Promise<void>;
    isHost?: boolean;
}

export interface Booth {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'LOCKED';
    price: number;
    name: string;
    description?:string;
    rotation: number;
}


export default function BoothLayoutViewer({
    booths,
    onCheckout,
    isHost = false,
    onClose
}: BoothLayoutViewerProps) {
    const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
    const [isPending, setIsPending] = useState(false);
    const { currencyCode } = useCurrency();

    const handleCheckout = async () => {
        if (!selectedBooth || !onCheckout || isPending) return;
        
        setIsPending(true);
        try {
            await onCheckout(selectedBooth);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="mx-auto flex max-h-screen w-full max-w-lg flex-col rounded-lg border border-border bg-card shadow-lg">
            <div className="flex w-full items-center justify-between border-b border-border p-4">
                <h2 className="text-xl font-bold">Booth Layout</h2>
                <IoClose size={24} onClick={onClose} className='cursor-pointer' />
            </div>
            <div className="flex flex-col gap-4 overflow-y-scroll w-full p-4 flex-1">
                <div className='flex flex-col gap-3 w-full'>
                    {booths.map((booth, index) => {
                        const isAvailable = booth.type === 'AVAILABLE';
                        const isSelected = selectedBooth?.id === booth.id;

                        return (
                            <div
                                key={booth.id}
                                className={`flex flex-col rounded-2xl border p-5 gap-3 transition-all duration-200 shadow-sm ${isAvailable
                                    ? 'cursor-pointer'
                                    : 'cursor-not-allowed opacity-60 grayscale-[0.5]'
                                    } ${isSelected
                                        ? 'border-primary bg-background ring-1 ring-primary shadow-lg'
                                        : 'border-border bg-background hover:border-ring'
                                    }`}
                                onClick={() => {
                                    if (isAvailable) {
                                        setSelectedBooth(booth);
                                    }
                                }}
                            >
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex flex-col">
                                        <p className={`text-lg font-bold ${isAvailable ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {booth.name}
                                        </p>
                                        {!isAvailable && (
                                            <span className="text-[10px] font-bold text-red-500 uppercase">Not Selectable</span>
                                        )}
                                    </div>
                                    <div className={`text-xs font-bold px-2 py-1 rounded-md border ${booth.type === 'AVAILABLE' ? 'bg-green-50 text-green-700 border-green-200' :
                                        'bg-primary text-primary-foreground border-gray-200'
                                        }`}>
                                        {booth.type}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-border pt-2">
                                    <div className="flex flex-col">
                                        <span className="font-bold uppercase text-muted-foreground">Size(cm)</span>
                                        <p className="text-sm font-medium text-foreground">{booth.width}x{booth.height}</p>
                                    </div>

                                    <div className="text-right">
                                        <span className="font-bold uppercase text-muted-foreground">Price</span>
                                        <p className="text-xl font-black text-foreground">
                                            <span className="text-sm font-normal text-muted-foreground mr-1">Est. </span>{booth.price} {currencyCode}
                                        </p>
                                    </div>
                                </div>
                                {booth.description && (
                                    <div className="flex flex-col gap-1">
                                        <span className="font-bold uppercase text-muted-foreground">Description</span>
                                        <p className="text-sm text-foreground">{booth.description}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
            {onCheckout && !isHost && (
                <div className='w-full border-t border-border p-4 pt-6'>
                    <button
                        disabled={!selectedBooth || isPending}
                        className={`flex w-full items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors ${selectedBooth && !isPending
                            ? 'bg-primary text-primary-foreground cursor-pointer'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                            }`}
                        onClick={handleCheckout}
                    >
                        {isPending ? (
                            <>
                                <Spinner className="size-4" /> Processing...
                            </>
                        ) : (
                            selectedBooth ? `Checkout ${selectedBooth.name}` : 'Select a Booth'
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
