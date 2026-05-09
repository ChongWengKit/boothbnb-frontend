
'use client';
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useUserContext } from "@/app/contexts/UserContext";
import EventResultsList from "@/app/(main)/(public)/components/EventResultsList";
import { updateProfileAction } from "../[slug]/action";
import Pagination from "@/components/Pagination";
import Image from "next/image";
import { useCloudinaryUpload } from '@/app/actions/useCloudinaryUpload';
import React from "react";
import { Camera } from "lucide-react";
import { setProfilePhoto } from "@/app/contexts/auth";

export interface AccountEvent {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    address: string;
    thumbnail: string | null;
    slug: string;
    total_bookings: number;
    total_capacity: number;
    available_booths: number;
    latitude: number;
    longitude: number;
}

export interface Account {
    username: string;
    email: string;
    role: string;
    profile_photo: string | null;
    created_at: string;
    events: AccountEvent[];
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export default function AccountDetailClient({ account, paginationMeta }: { account: Account, paginationMeta: PaginationMeta }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, } = useUserContext();
    const [tempPhoto, setTempPhoto] = React.useState<string | null>(null);
    const { uploadFile, isUploading } = useCloudinaryUpload();
    const isOwnProfile = user?.email === account?.email;

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = await uploadFile(file);
        if (url) {
            setTempPhoto(url);
            toast.success("Photo uploaded! Click save to update profile.");
        }
    };

    const handleSaveProfile = async () => {
        if (!tempPhoto) return;

        const result = await updateProfileAction({ profile_photo: tempPhoto });

        if (result.success) {
            toast.success("Profile updated successfully");
            setTempPhoto(null);
            setProfilePhoto(tempPhoto);
            router.refresh();
        } else {
            toast.error(result.message || "Failed to update profile");
        }
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <>

            <div className="bg-background rounded-lg shadow-lg p-8">
                <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-8">
                        <div className="relative flex-shrink-0">
                            {(tempPhoto || account?.profile_photo) ? (
                                <Image
                                    className="w-32 h-32 rounded-full object-cover"
                                    src={tempPhoto || account?.profile_photo || ""}
                                    alt={account?.username}
                                    width={128}
                                    height={128}
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-muted shrink-0" />
                            )}
                            {isOwnProfile && (
                                <label className="absolute -top-2 -right-2 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-md">
                                    {isUploading ? (
                                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Camera size={20} />
                                    )}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/png, image/jpeg, image/webp"
                                        onChange={handleImageUpload}
                                        disabled={isUploading}
                                    />
                                </label>
                            )}
                        </div>

                        <div className="flex flex-col gap-4">
                            <h1 className="text-3xl font-bold">Profile</h1>
                            <div className="flex flex-wrap items-center">Username:<span className="font-semibold break-all">{account?.username}</span></div>
                            <div className="flex flex-wrap items-center">Role:<span className="font-semibold">{account?.role}</span></div>
                            <div className="flex flex-wrap items-center">Email:<span className="font-semibold break-all">{account?.email}</span></div>
                            <div className="flex flex-wrap items-center">Created in:<span className="font-semibold">{account?.created_at ? new Date(account.created_at).toLocaleDateString('en-US') : ''}</span></div>
                        </div>

                    </div>
                    {tempPhoto && (
                        <button
                            onClick={handleSaveProfile}
                            className="ml-auto rounded-xl bg-primary px-6 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all"
                        >
                            Save Changes
                        </button>
                    )}

                </div>
            </div>
            <div>
                <div className="w-full">
                    <EventResultsList
                        events={account?.events || []}
                        isLoading={false}
                        emptyTitle="No events found"
                        emptySubtitle="Try adjusting your search area or dates."
                        title={"Listing"}
                    />
                    {paginationMeta && (
                        <Pagination
                            currentPage={paginationMeta.currentPage}
                            totalPages={paginationMeta.totalPages}
                            onPageChange={handlePageChange}
                            hasNextPage={paginationMeta.hasNextPage}
                            hasPreviousPage={paginationMeta.hasPreviousPage}
                        />
                    )}
                </div>
            </div>
        </>
    );
}