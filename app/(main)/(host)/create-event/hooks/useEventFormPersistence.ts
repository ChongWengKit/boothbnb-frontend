// import { useEffect, useState } from "react";
// import { UseFormReturn } from "react-hook-form";

// export const useEventFormPersistence = (methods: UseFormReturn<any>, isSubmitting: boolean) => {
//     const [isLoaded, setIsLoaded] = useState(false);
//     const { setValue, watch } = methods;

//     useEffect(() => {
//         const savedData = localStorage.getItem("create-event-data");
//         if (savedData) {
//             try {
//                 const parsed = JSON.parse(savedData);
//                 Object.entries(parsed).forEach(([key, value]) => {
//                     if (key.toLowerCase().includes('date') && value) {
//                         setValue(key, new Date(value as string));
//                     } else {
//                         setValue(key, value);
//                     }
//                 });
//             } catch (e) { console.error("Persistence Load Error", e); }
//         }
//         setIsLoaded(true);
//     }, [setValue]);

//     const formValues = watch();
//     useEffect(() => {
//         if (!isLoaded || isSubmitting) return;
//         localStorage.setItem("create-event-data", JSON.stringify(formValues));
//     }, [formValues, isLoaded, isSubmitting]);

//     return { isLoaded };
// };



