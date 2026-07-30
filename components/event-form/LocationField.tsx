import LocationMap from "@/components/LocationMap";
import LocationSearchInput from "@/components/LocationSearchInput";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export const LocationSection = ({ initialAddress }: { initialAddress?: string }) => {
    const { register, setValue, watch } = useFormContext();
    const [isMapOpen, setMapOpen] = useState(false);

    const lat = watch("latitude");
    const lng = watch("longitude");

    const handleLocationSelect = (location: { name: string; lat: number; lon: number }) => {
        setValue("address", location.name, { shouldValidate: true });
        setValue("latitude", location.lat, { shouldValidate: true });
        setValue("longitude", location.lon, { shouldValidate: true });
        setMapOpen(true);
    };

    const handleMapClick = (newLat: number, newLng: number) => {
        setValue("latitude", newLat, { shouldValidate: true });
        setValue("longitude", newLng, { shouldValidate: true });
    };

    return (
        <>
            <LocationSearchInput
                initialValue={initialAddress}
                onLocationSelect={handleLocationSelect}
                onMapIconClick={() => setMapOpen(!isMapOpen)}
            />

            <input type="hidden" {...register("address")} />
            <input type="hidden" {...register("latitude")} />
            <input type="hidden" {...register("longitude")} />

            {isMapOpen && lat && lng && (
                <LocationMap
                    latitude={lat}
                    longitude={lng}
                    onMapClick={handleMapClick}
                />
            )}
        </>
    );
};