'use client';
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image";

export function EventCarousel({ images }: { images: { url: string }[] }) {
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

    if (!images || images.length === 0) return null;
    const getOptimizedUrl = (url: string) => {
        return url.replace('/upload/', '/upload/w_1000,c_fill,g_auto,f_auto,q_auto/');
    };
    return (
        <>
        <Carousel className="min-w-0 flex-shrink">
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem key={index} className="">
                        <div className="p-1">
                            <Card>
                                <CardContent className="relative flex aspect-[21/9] min-h-[200px] items-center justify-center p-0 overflow-hidden rounded-lg">
                                    <Image 
                                        src={getOptimizedUrl(image.url)} 
                                        alt={`Event image ${index + 1}`} 
                                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" 
                                        onClick={() => setSelectedImage(image.url)}
                                        fill
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
        {selectedImage && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelectedImage(null)}>
                <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
                    <Image 
                        src={selectedImage} 
                        alt="Full view" 
                        className="object-contain rounded-lg shadow-2xl" 
                        fill
                        priority
                    />
                </div>
            </div>
        )}
        </>
    )
}
