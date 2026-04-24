'use client'
import { useForm, Controller, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import { type DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { createEventAction } from "@/app/(main)/(host)/create-event/actions";
import ImageUploader from "@/app/(main)/(host)/components/ImageUploader";
import { FormField } from "@/components/event-form/form-field";
import { DateTimeSection } from "@/components/event-form/date-field";
import { LocationSection } from "@/components/event-form/location-field";
import { BoothSection } from "@/components/event-form/booth-field";
import { validateResponse } from "@/app/contexts/auth";

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
const boothSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Booth name is required"),
    type: z.enum(["AVAILABLE", "RESERVED", "SOLD", "LOCKED"]),
    price: z.number().min(0),
    width: z.number().min(1),
    height: z.number().min(1),
    x: z.number(),
    y: z.number(),
    rotation: z.number().int().default(0)
});
const eventSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }).max(100, { message: "Name must be at most 100 characters" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(2000, { message: "Description must be at most 2000 characters" }),
    address: z.string().min(1, { message: "Address is required" }),
    latitude: z.number({ error: "Location is required" }),
    longitude: z.number({ error: "Location is required" }),
    startDate: z.preprocess((val) => val ? new Date(val as string) : undefined, z.date({ error: "Start date is required" })),

    startTime: z.string().min(1, { message: "Start time is required" }),
    endDate: z.date({ error: "End date is required" }),
    endTime: z.string().min(1, { message: "End time is required" }),
    category: z.string().min(1, { message: "Category is required" }),
    booths: z.array(boothSchema).min(1, "At least one booth is required"),
    images: z.array(z.string()).max(5, "Maximum 5 images allowed")
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

const CreateEvent = () => {

    const router = useRouter();
    const methods = useForm({
        resolver: zodResolver(eventSchema),
        mode: "all", defaultValues: {
            name: "",
            description: "",
            address: "",
            startTime: "10:30",
            endTime: "18:00",
            startDate: new Date(new Date().setHours(0, 0, 0, 0)),
            endDate: new Date(Date.now() + 604800000),
            category: "",
            booths: [],
            images: []
        }
    });

    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = methods;

    const [locationKey, setLocationKey] = useState(0);
    const [isLayoutEditorOpen, setIsLayoutEditorOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const address = watch("address");

    const handleReset = () => {
        localStorage.removeItem("create-event-data");
        reset();
        setLocationKey((prev) => prev + 1);
        toast.success("Form reset");
    };

    const onSubmit = async (data: z.infer<typeof eventSchema>) => {
        console.log("submitted", data);
        setIsSubmitting(true);
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

            const result = await createEventAction(eventData);
            validateResponse(result.status);
            if (result.success) {

                localStorage.removeItem("create-event-data");
                toast.success("Event created successfully");
                router.push("/host-dashboard");
            } else {
                toast.error(result.message || "Failed to create event");
                setIsSubmitting(false);
            }
        } catch (error) {

            setIsSubmitting(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <form className="flex flex-col gap-8 rounded-lg border border-border bg-card p-8 shadow-lg" onSubmit={handleSubmit(onSubmit, (errors) => console.log("VALIDATION ERRORS", errors))}>
                <h1 className="text-3xl font-bold">Event details</h1>

                <FormField label="Name" error={errors.name?.message}>
                    <input className="w-full rounded-lg border border-border bg-background px-4 py-4 text-foreground" {...register("name")} placeholder="Name" />
                </FormField>

                <FormField label="Description" error={errors.description?.message}>
                    <textarea className="min-h-[120px] w-full rounded-lg border border-border bg-background px-4 py-4 text-foreground" {...register("description")} placeholder="Description" />
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
                    <DateTimeSection dateName="startDate" timeName="startTime" />
                </FormField>

                <FormField label="End Date & Time" error={errors.endDate?.message}>
                    <DateTimeSection dateName="endDate" timeName="endTime" minDate={watch("startDate")} />
                </FormField>

                <FormField label="Address" error={errors.address?.message}>
                    <LocationSection key={locationKey} initialAddress={address} />
                </FormField>

                <FormField label="Event Images" description="Upload up to 5 photos" error={errors.images?.message}>
                    <ImageUploader maxImages={5} />
                </FormField>

                <FormField label="Booth Layout" description="Design your floor plan" error={errors.booths?.message as string}>
                    <BoothSection />
                </FormField>


                <div className="flex flex-end justify-end gap-8 ">
                    <button className="cursor-pointer rounded-xl bg-secondary px-4 py-4 text-sm font-bold text-secondary-foreground" type="button" onClick={handleReset}>Reset</button>
                    <button className="cursor-pointer rounded-xl bg-primary px-4 py-4 text-sm font-bold text-primary-foreground hover:bg-primary/90" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Event"}
                    </button>
                </div>
            </form>
        </FormProvider>
    );


}

export default CreateEvent