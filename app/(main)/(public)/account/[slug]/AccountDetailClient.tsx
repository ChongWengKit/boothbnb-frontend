
'use client';
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useUserContext } from "@/app/contexts/UserContext";
import EventResultsList from "@/app/(main)/(public)/components/EventResultsList";
import Pagination from "@/components/Pagination";
import Image from "next/image";

export default function AccountDetailClient({ account, paginationMeta }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useUserContext();

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
                        {account?.profile_photo ? (<>
                            <div className="relative">
                                <Image 
                                    className="w-32 h-32 rounded-full object-cover" 
                                    src={account?.profile_photo} 
                                    alt={account?.username}
                                    width={128}
                                    height={128}
                                />
                            </div>

                        </>
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-muted shrink-0" />
                        )}

                        <div className="flex flex-col gap-4">
                            <h1 className="text-3xl font-bold">Profile</h1>
                            <div>Username:<span className="font-semibold select-none ml-2">{account?.username}</span></div>
                            <div>Role:<span className="font-semibold ml-2">{account?.role}</span></div>
                            <div>Email:<span className="font-semibold ml-2">{account?.email}</span></div>
                            <div>Created in:<span className="font-semibold ml-2">{account?.created_at ? new Date(account.created_at).toLocaleDateString('en-US') : ''}</span></div>
                        </div>
                    </div>


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