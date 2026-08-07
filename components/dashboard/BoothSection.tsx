"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUserContext } from "@/app/contexts/UserContext";

import { publishEventAction, closeEventAction } from "@/app/(main)/(host)/host-dashboard/[slug]/actions";
import { checkoutAction } from "@/app/(main)/(public)/dashboard/[slug]/actions";
import { Booth } from "@/app/(main)/(host)/create-event/actions";
import { getCurrency } from "@/app/contexts/currency";

const BoothLayoutViewer = dynamic(() => import("@/components/boothlayout/boothLayoutViewer"), { ssr: false });

interface Booking {
  payment_status: string;
  vendor?: {
    username: string;
    email: string;
  };
  booked_at?: string;
  stripeChargeId?: string;
  receiptUrl?: string;
  cardBrand?: string;
  cardLast4?: string;
}

interface BoothWithBookings extends Booth {
  bookings?: Booking[];
}

interface DashboardEvent {
  id: string | number;
  host_id: number | string;
  title: string;
  slug: string;
  status: string;
  currency_code: string;
  available_booths: number;
  total_capacity: number;
  booths: BoothWithBookings[];
}

interface BoothSectionProps {
  event: DashboardEvent;
  isHost?: boolean;
  isOwner?: boolean;
  isHostDashboard?: boolean;
}

export default function BoothSection({ event, isHost = false, isOwner = false, isHostDashboard = false}: BoothSectionProps) {
  const router = useRouter();
  const { user } = useUserContext();
  const [isLayoutOpen, setIsLayoutOpen] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [eventStatus, setEventStatus] = useState(event.status);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);

  const handlePublish = async () => {
    if (isStatusUpdating) return;

    const previousStatus = eventStatus;
    setIsStatusUpdating(true);
    setEventStatus("PUBLISHED");

    const result = await publishEventAction(event.slug);

    if (result.success) {
      toast.success("Event published successfully");
    } else {
      setEventStatus(previousStatus);
      toast.error(result.message);
    }

    setIsStatusUpdating(false);
  };

  const handleClose = async () => {
    if (isStatusUpdating) return;

    const previousStatus = eventStatus;
    setIsStatusUpdating(true);
    setEventStatus("CLOSED");

    const result = await closeEventAction(event.slug);

    if (result.success) {
      toast.success("Event closed successfully");
    } else {
      setEventStatus(previousStatus);
      toast.error(result.message);
    }

    setIsStatusUpdating(false);
  };

  const handleExportCSV =async  () => {
      const currency = await getCurrency();

    const summary = [
      ["Event Report", `"${event.title}"`],
      ["Event Status", `"${eventStatus}"`],
      ["Booth Capacity", `"${event.available_booths} / ${event.total_capacity}"`],
      ["Generated At", `"${new Date().toLocaleString()}"`],
      [""]
    ].map(row => row.join(",")).join("\n");

    const headers = ["ID", "Name", "Status", `Price (${currency})`, "Vendor", "Email", "Booked At", "Stripe Charge ID", "Receipt URL", "Card Brand", "Card Last 4"].join(",");
    const rows = event.booths.map((booth) => {
      const booking = booth.bookings?.find((b) => b.payment_status !== 'FAILED');
      return [
        booth.id,
        `"${booth.name || ''}"`,
        `"${booth.type || ''}"`,
        booth.price || 0,
        `"${booking?.vendor?.username || ''}"`,
        `"${booking?.vendor?.email || ''}"`,
        `"${booking?.booked_at ? new Date(booking.booked_at).toLocaleString() : ''}"`,
        `"${booking?.stripeChargeId || ''}"`,
        `"${booking?.receiptUrl || ''}"`,
        `"${booking?.cardBrand || ''}"`,
        `"${booking?.cardLast4 || ''}"`
      ].join(",");
    });

    const csvContent = summary + headers + "\n" + rows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `booths_${event.slug}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCheckout = async (booth: BoothWithBookings) => {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      const result = await checkoutAction(String(event.id), booth.id, event.slug);
      if (result.data?.success && result.data.data) {
        toast.success(`Redirecting to checkout...`);
        router.push(result.data.data);
      } else {
        toast.error(result.message || "Checkout failed.");
      }
    } catch {
      toast.error("An error occurred during checkout.");
    }
  };

  return (
    <>
      <div className="hidden w-[320px] shrink-0 rounded-xl border border-border bg-card p-6 shadow-sm md:block">
        <h3 className="text-2xl font-bold mb-6 items-center">
          Booth Availability
  
        </h3>
        <div className="mb-6 space-y-2 leading-relaxed text-muted-foreground">
          <p>Available: <span className="font-semibold text-foreground">{event.available_booths} / {event.total_capacity}</span></p>

          {isHost && isOwner && isHostDashboard && (
            <div className="pt-2 border-t text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Available: {event.booths.filter((b) => b.type === "AVAILABLE").length}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                Sold: {event.booths.filter((b) => b.type === "SOLD").length}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setIsLayoutOpen(true)}
            className="w-full rounded-lg bg-primary py-4 font-bold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
          >
            {isOwner ? "View Booths" : "View & Book Booths"}
          </button>

          {isHost && isOwner && isHostDashboard && (
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Admin Tools</p>

              {eventStatus === "DRAFT" ? (
                <button
                  onClick={handlePublish}
                  onMouseEnter={() => setHoveredButton('publish')}
                  onMouseLeave={() => setHoveredButton(null)}
                  disabled={isStatusUpdating}
                  className="flex w-full items-center justify-center rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isStatusUpdating ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Updating...
                    </span>
                  ) : (
                    hoveredButton === 'publish' ? "Confirm Publish" : "Publish Event"
                  )}
                </button>
              ) : (
                <button
                  onClick={eventStatus === "PUBLISHED" ? handleClose : handlePublish}
                  onMouseEnter={() => setHoveredButton('status')}
                  onMouseLeave={() => setHoveredButton(null)}
                  disabled={isStatusUpdating}
                  className={`flex w-full items-center justify-center rounded-lg py-3 font-semibold text-white transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${eventStatus === "PUBLISHED" ? "bg-green-600 hover:bg-red-600" : "bg-red-600 hover:bg-green-600"}`}
                >
                  {isStatusUpdating ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Updating...
                    </span>
                  ) : (
                    hoveredButton === 'status'
                      ? (eventStatus === "PUBLISHED" ? "Close Event" : "Open Event")
                      : (eventStatus === "PUBLISHED" ? "Status: Live" : "Status: Closed")
                  )}
                </button>
              )}

              <button
                onClick={handleExportCSV}
                className="w-full rounded-lg border border-border py-3 font-semibold text-foreground cursor-pointer hover:bg-accent"
              >
                Export Sales (CSV)
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card border-t border-border p-4 shadow-2xl md:hidden" style={{ zIndex: 500 }}>
        <h3 className="text-2xl font-bold mb-2">Booth Availability</h3>
        <div className="mb-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
          <p>Available: <span className="font-semibold text-foreground">{event.available_booths} / {event.total_capacity}</span></p>


        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setIsLayoutOpen(true)}
            className="w-full rounded-lg bg-primary py-2 font-bold text-primary-foreground transition-all active:scale-[0.98] cursor-pointer"
          >
            View & Book Booths
          </button>

          {isHost && isOwner && isHostDashboard && (
            <div className="flex flex-col gap-3 mt-2 pt-4 border-t">
              <div className="grid grid-cols-2 gap-3">
                {eventStatus === "DRAFT" ? (
                  <button
                    onClick={handlePublish}
                    disabled={isStatusUpdating}
                    className="flex w-full items-center justify-center rounded-lg bg-primary py-3 text-xs font-semibold text-primary-foreground cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isStatusUpdating ? (
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Updating...
                      </span>
                    ) : (
                      "Publish Event"
                    )}
                  </button>
                ) : (
                  <button
                    onClick={eventStatus === "PUBLISHED" ? handleClose : handlePublish}
                    disabled={isStatusUpdating}
                    className={`flex w-full items-center justify-center rounded-lg py-3 text-xs font-semibold text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${eventStatus === "PUBLISHED" ? "bg-green-600" : "bg-red-600"}`}
                  >
                    {isStatusUpdating ? (
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Updating...
                      </span>
                    ) : (
                      eventStatus === "PUBLISHED" ? "Status: Live" : "Status: Closed"
                    )}
                  </button>
                )}
                <button onClick={handleExportCSV} className="w-full rounded-lg border border-border py-3 text-xs font-semibold text-foreground cursor-pointer">
                  Export CSV
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isLayoutOpen && (
        <div className="fixed inset-0 z-[9999]">
          <div className="flex justify-center items-center w-full h-full bg-black/50 backdrop-blur-sm">
            <BoothLayoutViewer
              onClose={() => setIsLayoutOpen(false)}
              booths={event.booths || []}
              isHost={isHost}
              onCheckout={isHost ? () => {} : handleCheckout}
            />
          </div>
        </div>
      )}
    </>
  );
}