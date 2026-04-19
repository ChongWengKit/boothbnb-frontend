'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IoClose } from "react-icons/io5";
interface BoothLayoutViewerProps {
    booths: Booth[];
    onClose?: () => void;
    onCheckout?: (booth: Booth) => void;
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

    return (
        <div className="mx-auto flex max-h-screen w-full max-w-lg flex-col items-center justify-center rounded-lg border border-border bg-card p-4 shadow-lg">
            <div className="flex w-full justify-between border-b border-border pb-4">
                <h2 className="text-xl font-bold">Booth Layout</h2>
                <IoClose size={24} onClick={onClose} className='cursor-pointer' />
            </div>
            <div className="flex flex-col gap-4 overflow-y-scroll w-full p-4">
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
                                            ${booth.price}
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
                        disabled={!selectedBooth}
                        className={`w-full py-3 rounded-lg font-semibold transition-colors ${selectedBooth
                            ? 'bg-primary text-primary-foreground cursor-pointer'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                            }`}
                        onClick={() => selectedBooth && onCheckout(selectedBooth)}
                    >
                        {selectedBooth ? `Checkout ${selectedBooth.name}` : 'Select a Booth'}
                    </button>
                </div>
            )}
        </div>
    );
}
