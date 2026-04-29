"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUserContext } from "@/app/contexts/UserContext";

import { publishEventAction, closeEventAction } from "@/app/(main)/(host)/host-dashboard/[slug]/actions";
import { checkoutAction } from "@/app/(main)/(public)/dashboard/[slug]/actions";
import { Booth } from "@/app/(main)/(host)/create-event/actions";

const BoothLayoutViewer = dynamic(() => import("@/components/boothlayout/boothLayoutViewer"), { ssr: false });

interface Booking {
  payment_status: string;
  vendor?: {
    username: string;
    email: string;
  };
  booked_at?: string;
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
  available_booths: number;
  total_capacity: number;
  total_money_made?: number;
  booths: BoothWithBookings[];
}

interface BoothSectionProps {
  event: DashboardEvent;
  isHost?: boolean;
}

export default function BoothSection({ event, isHost = false }: BoothSectionProps) {
  const router = useRouter();
  const { user } = useUserContext();
  const [isLayoutOpen, setIsLayoutOpen] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const isOwner = user && Number(user.id) === Number(event.host_id);

  useEffect(() => {
    if (isHost && user && user.role === "HOST" && !user.is_stripe_connected) {
      toast.error("Please connect your Stripe account to manage events.");
      router.push("/dashboard");
    }
  }, [user, router, isHost]);

  const handlePublish = async () => {
    const result = await publishEventAction(event.slug);
    if (result.success) {
      toast.success("Event published successfully");
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const handleClose = async () => {
    const result = await closeEventAction(event.slug);
    if (result.success) {
      toast.success("Event closed successfully");
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const handleExportCSV = () => {
    const summary = [
      ["Event Report", `"${event.title}"`],
      ["Total Revenue", `"${event.total_money_made || 0}"`],
      ["Generated At", `"${new Date().toLocaleString()}"`],
      [""]
    ].map(row => row.join(",")).join("\n");

    const headers = ["ID", "Name", "Status", "Price", "Vendor", "Email", "Booked At"].join(",");
    const rows = event.booths.map((booth) => {
      const booking = booth.bookings?.find((b) => b.payment_status !== 'FAILED');
      return [
        booth.id,
        `"${booth.name || ''}"`,
        `"${booth.type || ''}"`,
        booth.price || 0,
        `"${booking?.vendor?.username || ''}"`,
        `"${booking?.vendor?.email || ''}"`,
        `"${booking?.booked_at ? new Date(booking.booked_at).toLocaleString() : ''}"`
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

          {isOwner && (
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
            className="w-full rounded-lg bg-primary py-4 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {isOwner ? "View Booths" : "View & Book Booths"}
          </button>

          {isOwner && (
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Admin Tools</p>

              {event.status === "DRAFT" ? (
                <button
                  onClick={handlePublish}
                  onMouseEnter={() => setHoveredButton('publish')}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {hoveredButton === 'publish' ? "Confirm Publish" : "Publish Event"}
                </button>
              ) : (
                <button
                  onClick={event.status === "PUBLISHED" ? handleClose : handlePublish}
                  onMouseEnter={() => setHoveredButton('status')}
                  onMouseLeave={() => setHoveredButton(null)}
                  className={`w-full rounded-lg py-3 font-semibold text-white transition-colors ${event.status === "PUBLISHED" ? "bg-green-600 hover:bg-red-600" : "bg-red-600 hover:bg-green-600"}`}
                >
                  {hoveredButton === 'status'
                    ? (event.status === "PUBLISHED" ? "Close Event" : "Open Event")
                    : (event.status === "PUBLISHED" ? "Status: Live" : "Status: Closed")}
                </button>
              )}

              <button
                onClick={handleExportCSV}
                className="w-full rounded-lg border border-border py-3 font-semibold text-foreground hover:bg-accent"
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
            className="w-full rounded-lg bg-primary py-2 font-bold text-primary-foreground transition-all active:scale-[0.98]"
          >
            View & Book Booths
          </button>

          {isOwner && (
            <div className="flex flex-col gap-3 mt-2 pt-4 border-t">
              <div className="grid grid-cols-2 gap-3">
                {event.status === "DRAFT" ? (
                  <button onClick={handlePublish} className="w-full rounded-lg bg-primary py-3 text-xs font-semibold text-primary-foreground">
                    Publish Event
                  </button>
                ) : (
                  <button
                    onClick={event.status === "PUBLISHED" ? handleClose : handlePublish}
                    className={`w-full rounded-lg py-3 text-xs font-semibold text-white ${event.status === "PUBLISHED" ? "bg-green-600" : "bg-red-600"}`}
                  >
                    {event.status === "PUBLISHED" ? "Status: Live" : "Status: Closed"}
                  </button>
                )}
                <button onClick={handleExportCSV} className="w-full rounded-lg border border-border py-3 text-xs font-semibold text-foreground">
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