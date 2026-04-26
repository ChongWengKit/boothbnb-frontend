'use client'

import { useState } from 'react';
import { getAuthToken, validateResponse } from '@/app/contexts/auth';
interface UseCloudinaryUpload {
  isUploading: boolean;
  uploadFile: (file: File) => Promise<string | undefined>;
}

export const useCloudinaryUpload = (): UseCloudinaryUpload => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string | undefined> => {
    setIsUploading(true);
    try {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, PNG, and WebP are allowed.");
        return undefined;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File is too heavy. Keep it under 5MB.");
        return undefined;
      }
      const timestamp = Math.floor(Date.now() / 1000);
      const folder = 'Events';
      const token = await getAuthToken();
      const signatureResponse = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/upload/signature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify({ timestamp, folder }),
      });

      if (!signatureResponse.ok) {
        throw new Error('Failed to get upload signature.');
      }

      const signatureData = await signatureResponse.json();
      const { signature } = signatureData.data;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');
      formData.append('timestamp', String(timestamp));
      formData.append('folder', folder);
      formData.append('signature', signature);

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const uploadResponse = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Cloudinary upload failed.');
      }

      const uploadedImageData = await uploadResponse.json();
      return uploadedImageData.secure_url || uploadedImageData.url;
    } catch (error) {
      return undefined;
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, uploadFile };
};
