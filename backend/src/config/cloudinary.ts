/**
 * @file cloudinary.ts
 * @description Cloudinary storage and media upload/deletion configuration for user profile photos.
 */

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { config } from './env.config';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName || process.env.CLOUD_NAME,
  api_key: config.cloudinary.apiKey || process.env.CLOUD_API_KEY,
  api_secret: config.cloudinary.apiSecret || process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'expense_tracker_profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  } as any,
});

export const upload = multer({ storage });

export const extractPublicId = (url: string): string | null => {
  try {
    const splitUrl = url.split('/');
    const lastPart = splitUrl[splitUrl.length - 1];
    const folderPart = splitUrl[splitUrl.length - 2];
    const publicIdWithExt = `${folderPart}/${lastPart}`;
    return publicIdWithExt.split('.')[0];
  } catch (error) {
    return null;
  }
};

export const deleteImage = async (url: string): Promise<void> => {
  const publicId = extractPublicId(url);
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      // Intentionally handled error for missing image
    }
  }
};

export default upload;
