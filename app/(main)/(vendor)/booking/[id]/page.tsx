import React from "react";
import { getBookingByIdAction } from "../action";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import PrintButton from "@/components/ui/PrintButton";
import Image from "next/image";
import { formatEventDate } from "@/app/lib/util";


export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const response = await getBookingByIdAction(id);

    if (!response.success) {
        return (
            <div className="m-8 rounded-xl border border-border bg-card p-8 text-center shadow-sm">
                <h1 className="text-2xl font-bold text-red-600 mb-2">Could not load booking</h1>
                <p className="text-muted-foreground">{response.message || "An unexpected error occurred."}</p>
                <Link href="/payment" className="inline-block mt-4 text-blue-600 hover:underline">Return to list</Link>
            </div>
        );
    }

    const booking = response.data;

    if (booking.payment_status !== 'PAID') {
        redirect('/payment');
    }

    const booth = booking.booth;
    const event = booth.event;

    return (
        <div className="p-8 max-w-6xl mx-auto w-full receipt-content-wrapper">
            <Link href="/payment" className="no-print mb-6 flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                <IoArrowBack /> Back to Bookings
            </Link>

            <div className="receipt-content ">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-background p-6 rounded-2xl border shadow-sm">
                        <h1 className="mb-1 text-2xl font-bold text-foreground">{booking.event_name}</h1>
                        <p className="mb-6 text-sm text-muted-foreground">{event.address}</p>

                        <div className="space-y-4">
                            <DetailItem label="Booth" value={booking.booth_name} />
                            <DetailItem label="Event ID" value={booth.event_id} />
                            <DetailItem label="Booth ID" value={booking.booth_id} />
                            <DetailItem label="Vendor ID" value={booking.vendor_id} />
                            <DetailItem label="Price Paid" value={`$${Number(booth.price).toLocaleString()}`} />
                            {booking.cardBrand && (
                                <DetailItem 
                                    label="Payment Method" 
                                    value={<span className="capitalize">{booking.cardBrand} •••• {booking.cardLast4}</span>} 
                                />
                            )}
                            {booking.stripeChargeId && (
                                <DetailItem label="Transaction ID" value={booking.stripeChargeId} />
                            )}
                            <DetailItem label="Status" value={
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                    booking.payment_status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-primary text-primary-foreground'
                                }`}>
                                    {booking.payment_status}
                                </span>
                            } />
                            <DetailItem label="Booked On" value={formatEventDate(booking.booked_at)} />
                            
                            {booking.receiptUrl && (
                                <div className="pt-2 no-print">
                                    <a 
                                        href={booking.receiptUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
                                    >
                                        View Official Stripe Receipt
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-background p-6 rounded-2xl border shadow-sm">
                        <h3 className="mb-4 font-bold text-foreground">Vendor Information</h3>
                        <div className="flex items-center gap-3">
                            {booking.vendor.profile_photo ? (
                                <Image 
                                    src={booking.vendor.profile_photo} 
                                    className="w-12 h-12 rounded-full border" 
                                    alt="Vendor profile" 
                                    width={48}
                                    height={48}
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-secondary" />
                            )}
                            <div>
                                <p className="font-semibold">{booking.vendor.username}</p>
                                <p className="text-xs text-muted-foreground">{booking.vendor.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 no-print">
                        <PrintButton />
                        <Link 
                            href={`/dashboard/${event.slug}`}
                            className="block w-full rounded-xl bg-primary py-4 text-center font-bold text-primary-foreground transition-all hover:bg-primary/90"
                        >
                            View Event Page
                        </Link>
                    </div>
                </div>

                
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { size: A4; margin: 15mm; }
                    
                    /* Hide the Topbar, Sidebar, and standard Layout containers */
                    body { visibility: hidden; background: white !important; -webkit-print-color-adjust: exact; }
                    
                    /* Force only the receipt wrapper to be visible */
                    .receipt-content-wrapper, .receipt-content-wrapper * { visibility: visible; }
                    
                    /* Specifically remove layout components and navigation from the flow */
                    nav, aside, footer, header, .no-print, [role="navigation"] { display: none !important; visibility: hidden !important; }

                    .receipt-content-wrapper {
                        position: absolute;
                        left: 0;
                        top: 0;
                        display: block !important;
                        width: 100% !important;
                        max-width: none !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .receipt-content { display: block !important; width: 100% !important; }
                    .grid { display: block !important; }
                    .lg\\:col-span-1, .lg\\:col-span-2 { width: 100% !important; margin-bottom: 20px; display: block !important; }
                    
                    /* Fix Map Container for Print */
                    .h-\\[600px\\] { height: auto !important; min-height: 400px; }
                    svg { width: 100% !important; height: auto !important; max-height: 500px; }

                    .shadow-sm, .border { border: 1px solid #eee !important; box-shadow: none !important; }
                }
            `}} />
        </div>
    );
}

function DetailItem({ label, value }: { label: string, value: React.ReactNode }) {
    return (
        <div>
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
            <div className="font-medium text-foreground">{value}</div>
        </div>
    );
}