'use client';

import React from 'react';
import { MdAdd } from 'react-icons/md';
import { TiDelete } from 'react-icons/ti';
import { Spinner } from '@/components/ui/spinner';
import { useCloudinaryUpload } from '@/app/actions/useCloudinaryUpload';
import { useFormContext } from 'react-hook-form';
import Image from "next/image";

interface ImageUploaderProps {
  maxImages?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ maxImages = 5 }) => {
  const { watch, setValue } = useFormContext();
  const { isUploading, uploadFile } = useCloudinaryUpload();

  const imageUrls: string[] = watch("images") || [];
  const hasReachedLimit = imageUrls.length >= maxImages;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !hasReachedLimit) {
      const newUrl = await uploadFile(file);
      if (newUrl) {
        setValue("images", [...imageUrls, newUrl], { shouldValidate: true });
      }
    }
    event.target.value = '';
  };

  const handleDelete = (index: number) => {
    const updatedImages = imageUrls.filter((_, i) => i !== index);
    setValue("images", updatedImages, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <label
        className={`group flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-all ${
          hasReachedLimit || isUploading
            ? 'cursor-not-allowed border-border bg-muted'
            : 'cursor-pointer border-border hover:border-ring hover:bg-accent'
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-4 pb-4">
          {isUploading ? <Spinner className="size-8" /> : <MdAdd size="50" />}
          <p className="text-sm text-foreground">
            <span className="font-semibold">
              {isUploading ? "Uploading..." : "Click to upload"}
            </span> (png, jpeg, webp, max 10MB)
          </p>
        </div>

        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={hasReachedLimit || isUploading}
        />
      </label>

      {hasReachedLimit && (
        <p className="text-red-500 text-sm mt-1">Maximum {maxImages} images allowed</p>
      )}

      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
          {imageUrls.map((url, index) => (
            <div key={url} className="relative aspect-square group overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              <Image 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                src={url} 
                alt={`Upload ${index}`} 
                fill
              />
              <button 
                type="button" 
                onClick={() => handleDelete(index)} 
                className="absolute top-1 right-1 rounded-full text-foreground hover:text-red-500 transition-colors drop-shadow-md"
              >
                <TiDelete size="30" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;