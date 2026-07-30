'use client'
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { FormField } from "@/components/event-form/FormField";
import { DateTimeSection } from "@/components/event-form/DateField";
import ImageUploader from "@/app/(main)/(host)/components/ImageUploader";
import { updateEventAction } from "./actions";
import { LocationSection } from "@/components/event-form/LocationField";
import { BoothSection } from "@/components/event-form/BoothField";


const combineDateTime = (date: Date, time: string) => {
    const combined = new Date(date);
    const match = time.match(/(\d+):(\d+)\s*(am|pm)?/i);
    if (match) {
        let h = parseInt(match[1]);
        const m = parseInt(match[2]);
        const p = match[3]?.toLowerCase();
        if (p === 'pm' && h < 12) h += 12;
        if (p === 'am' && h === 12) h = 0;
        combined.setHours(h, m, 0, 0);
    }
    return combined.toISOString();
};

const CATEGORIES = [
    { value: "ART_CRAFT", label: "Art & Craft" },
    { value: "FOOD_BEVERAGE", label: "Food & Beverage" },
    { value: "FASHION_BEAUTY", label: "Fashion & Beauty" },
    { value: "TECH_GADGETS", label: "Tech & Gadgets" },
    { value: "HOME_LIVING", label: "Home & Living" },
    { value: "CORPORATE_TRADE", label: "Corporate & Trade" },
    { value: "ANIME_COMIC", label: "Anime & Comic (ACG)" },
    { value: "THRIFT_VINTAGE", label: "Thrift & Vintage" },
    { value: "WELLNESS_FITNESS", label: "Wellness & Fitness" },
    { value: "PET_FAIR", label: "Pet Fair" },
    { value: "EDUCATIONAL", label: "Educational" },
    { value: "OTHERS", label: "Others" },
];

const eventSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }).max(100, { message: "Name must be at most 100 characters" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(2000, { message: "Description must be at most 2000 characters" }),
    address: z.string().min(1, { message: "Address is required" }),
    latitude: z.number({ error: "Location is required" }),
    longitude: z.number({ error: "Location is required" }),
    startDate: z.date({ message: "Start date is required" }),
    startTime: z.string().min(1, { message: "Start time is required" }),
    endDate: z.date({ message: "End date is required" }),
    endTime: z.string().min(1, { message: "End time is required" }),
    category: z.string().min(1, { message: "Category is required" }),
    booths: z.array(z.object({
        id: z.string(),
        name: z.string().min(1, "Booth name is required"),
        type: z.enum(["AVAILABLE", "RESERVED", "SOLD", "LOCKED"]),
        price: z.number().min(0),
        width: z.number().int().min(1),
        height: z.number().int().min(1),
        x: z.number().int(),
        y: z.number().int(),
        rotation: z.number().int(),
    })).min(1, "At least one booth is required"),
    images: z.array(z.string()).max(5, { message: "Maximum 5 images allowed" })
}).refine((data) => {
    const now = new Date();
    const start = new Date(combineDateTime(data.startDate, data.startTime));
    return start.getTime() >= now.getTime();
}, {
    message: "Start date and time cannot be in the past",
    path: ["startDate"],
})
    .refine((data) => {
        const start = new Date(combineDateTime(data.startDate, data.startTime));
        const end = new Date(combineDateTime(data.endDate, data.endTime));
        return end.getTime() > start.getTime();
    }, {
        message: "End date and time must be after start date and time",
        path: ["endDate"],
    });

interface RawBoothData {
    id: number;
    name: string;
    type: "AVAILABLE" | "RESERVED" | "SOLD" | "LOCKED";
    price: number | string;
    width: number;
    height: number;
    x: number;
    y: number;
    rotation?: number;
}

interface EventDetailResponse {
    slug: string;
    title: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    start_date: string;
    end_date: string;
    category: string;
    images: { url: string }[];
    booths: RawBoothData[];
}

interface EditEventClientProps {
    event: EventDetailResponse;
}

const EditEventClient: React.FC<EditEventClientProps> = ({ event }) => {
    const router = useRouter();
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);

    const methods = useForm<z.infer<typeof eventSchema>>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            name: event.title,
            description: event.description,
            address: event.address,
            latitude: event.latitude,
            longitude: event.longitude,
            startDate: start,
            startTime: format(start, "HH:mm"),
            endDate: end,
            endTime: format(end, "HH:mm"),
            category: event.category || "",
            images: event.images.map((img: { url: string }) => img.url),
            booths: event.booths.map((booth: RawBoothData) => ({
                ...booth,
                id: String(booth.id),
                price: typeof booth.price === 'string' ? parseFloat(booth.price) : booth.price,
                name: booth.name || `Booth ${booth.id}`,
                rotation: booth.rotation ?? 0,
            })) || [],
        }
    });

    const { register, handleSubmit, formState: { errors }, watch } = methods;

    const onSubmit = async (data: z.infer<typeof eventSchema>) => {
        try {
            const eventData = {
                title: data.name,
                description: data.description,
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
                start_date: combineDateTime(data.startDate, data.startTime),
                end_date: combineDateTime(data.endDate, data.endTime),
                images: data.images,
                category: data.category,
                booths: data.booths
            };


            const result = await updateEventAction(event.slug, eventData);

            if (result.success) {
                toast.success("Event updated successfully");
                router.push("/host-dashboard");
                router.refresh();
            } else {
                toast.error(result.message || "Failed to update event");
            }

        } catch (error) {
            toast.error("Failed to update event");
        }
    };

    return (
        <FormProvider {...methods}>
            <form className="flex flex-col gap-8 rounded-lg border border-border bg-card p-8 shadow-lg" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-3xl font-bold">Edit Event</h1>
                <FormField label="Name" error={errors.name?.message as string}>
                    <input
                        className="w-full rounded-lg border border-border bg-background px-4 py-4 text-foreground"
                        {...register("name")}
                    />
                </FormField>
                <FormField label="Description" error={errors.description?.message as string}>
                    <textarea
                        className="min-h-[120px] w-full rounded-lg border border-border bg-background px-4 py-4 text-foreground"
                        {...register("description")}
                        placeholder="Description"
                    />
                </FormField>
                <FormField label="Category" error={errors.category?.message as string}>
                    <select className="w-full rounded-lg border border-border bg-background px-4 py-4 text-foreground" {...register("category")}>
                        <option value="">Select a category</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </FormField>
                <FormField label="Start Date & Time" error={errors.startDate?.message}>
                    <DateTimeSection
                        dateName="startDate"
                        timeName="startTime"

                    />
                </FormField>
                <FormField label="End Date & Time" error={errors.endDate?.message}>
                    <DateTimeSection
                        dateName="endDate"
                        timeName="endTime"
                        minDate={watch("startDate")}
                    />
                </FormField>
                <FormField label="Location" error={errors.address?.message as string}>
                    <LocationSection initialAddress={event.address} />
                </FormField>

                <FormField
                    label="Event Images"
                    description="Upload up to 5 photos"
                    error={errors.images?.message as string}
                >
                    <ImageUploader
                        maxImages={5}
                    />
                </FormField>
                <FormField label="Booth Layout" description="Design your floor plan" error={errors.booths?.message as string}>
                    <BoothSection />
                </FormField>


                <div className="flex flex-end justify-end gap-8 ">
                    <button className="cursor-pointer rounded-xl bg-secondary px-4 py-4 text-sm font-bold text-secondary-foreground" type="button" onClick={() => router.back()}>Cancel</button>
                    <button className="cursor-pointer rounded-xl bg-primary px-4 py-4 text-sm font-bold text-primary-foreground hover:bg-primary/90" type="submit">Update Event</button>
                </div>
            </form>
        </FormProvider>
    );
}

export default EditEventClient;