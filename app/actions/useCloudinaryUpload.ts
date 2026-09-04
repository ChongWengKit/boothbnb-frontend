'use client';

import { useState } from 'react';
import { getAuthToken } from '@/app/contexts/auth';

interface UseCloudinaryUpload {
  isUploading: boolean;
  uploadFile: (file: File, options?: { folder?: string }) => Promise<string | undefined>;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; 
const DEFAULT_FOLDER = 'Events';

export const useCloudinaryUpload = (): UseCloudinaryUpload => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File, options?: { folder?: string }): Promise<string | undefined> => {
    setIsUploading(true);
    try {
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert("Only JPG, PNG,and WebP are allowed.");
        return undefined;
      }
      if (file.size > MAX_SIZE) {
        alert("File is too heavy. Keep it under 10MB.");
        return undefined;
      }
      const timestamp = Math.floor(Date.now() / 1000);
      const folder = options?.folder ?? DEFAULT_FOLDER;
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
      const { signature, allowedFormats } = signatureData.data;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');
      formData.append('timestamp', String(timestamp));
      formData.append('folder', folder);
      formData.append('allowed_formats', allowedFormats.join(','));
      formData.append('signature', signature);

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const uploadResponse = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
      });
      const uploadedImageData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error('Cloudinary upload failed.');
      }
      return uploadedImageData.secure_url || uploadedImageData.url; 
    } catch {
      return undefined; 
    } finally {
      setIsUploading(false);
    }
  };
  return { isUploading, uploadFile };
};