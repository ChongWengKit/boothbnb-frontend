'use client'
import { useForm, Controller, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { FormField } from "@/components/event-form/form-field";
import { DateTimeSection } from "@/components/event-form//date-field";
import ImageUploader from "@/app/(main)/(host)/components/ImageUploader";
import { updateEventAction } from "./actions";
import { LocationSection } from "@/components/event-form/location-field";
import { BoothSection } from "@/components/event-form/booth-field";


const combineDateTime = (date: Date, time: string) => {
    const combined = new Date(date);
    const [hours, minutes] = time.split(':');
    combined.setHours(parseInt(hours), parseInt(minutes), 0, 0);
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
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters" }),
    address: z.string().min(1, { message: "Address is required" }),
    latitude: z.number({ required_error: "Location is required" }),
    longitude: z.number({ required_error: "Location is required" }),
    startDate: z.date({ required_error: "Start date is required" }),
    startTime: z.string().min(1, { message: "Start time is required" }),
    endDate: z.date({ required_error: "End date is required" }),
    endTime: z.string().min(1, { message: "Start time is required" }),
    category: z.string().min(1, { message: "Category is required" }),
    booths: z.array(z.object({
        id: z.string(),
        x: z.number().int(),
        y: z.number().int(),
        width: z.number().int(),
        height: z.number().int(),
        type: z.enum(['AVAILABLE', 'RESERVED', 'SOLD', 'LOCKED']),
        price: z.number().optional(),
        name: z.string().optional(),
        rotation: z.number().int().optional(),
    })),
    images: z.array(z.string()).max(5, { message: "Maximum 5 images allowed" })

});

interface EditEventClientProps {
    event: any;
}

const EditEventClient: React.FC<EditEventClientProps> = ({ event }) => {
    const router = useRouter();
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);

    const methods = useForm({
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
            images: event.images.map((img: { url: string }) => img.url) || [],
            booths: event.booths.map((booth: any) => ({ 
                ...booth,
                id: String(booth.id),
                price: parseFloat(booth.price),
                name: booth.name || `Booth ${booth.id}`,
                rotation: booth.rotation ?? 0, 
            })) || [],
        }
    });

    const { register, handleSubmit, formState: { errors }, setValue, watch } = methods;
    const [isLayoutEditorOpen, setIsLayoutEditorOpen] = useState(false);
    const booths = watch("booths") || [];

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

            console.log("Submitting Update:", eventData);

            const result = await updateEventAction(event.slug, eventData);

            if (result.success) {
                toast.success("Event updated successfully");
                router.push("/host-dashboard");
                router.refresh();
            } else {
                toast.error(result.message || "Failed to update event");
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to update event");
        }
    };

    return (
        <FormProvider {...methods}>
            <form className="flex flex-col gap-8 rounded-lg border border-border bg-card p-8 shadow-lg" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-3xl font-bold">Edit Event</h1>
                <FormField label="Name" error={errors.name?.message}>
                    <input
                        className="w-full rounded-lg border border-border bg-background px-4 py-4 text-foreground"
                        {...register("name")}
                    />
                </FormField>
                <FormField label="Description" error={errors.description?.message}>
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
                <FormField label="Location" error={errors.address?.message}>
                    <LocationSection initialAddress={event.address} />
                </FormField>

                <FormField
                    label="Event Images"
                    description="Upload up to 5 photos"
                    error={errors.images?.message}
                >
                    <ImageUploader
                        maxImages={5}
                    />
                </FormField>
                <FormField label="Booth Layout" description="Design your floor plan" error={errors.booths?.message}>
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