import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'expense_tracker_profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  } as any,
});

export const upload = multer({ storage });

export const extractPublicId = (url: string) => {
  try {
    // Cloudinary URLs typically look like: https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/<folder>/<public_id>.<ext>
    const splitUrl = url.split('/');
    const lastPart = splitUrl[splitUrl.length - 1]; // <public_id>.<ext>
    const folderPart = splitUrl[splitUrl.length - 2]; // <folder>
    const publicIdWithExt = `${folderPart}/${lastPart}`;
    const publicId = publicIdWithExt.split('.')[0]; // remove extension
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID from URL', error);
    return null;
  }
};

export const deleteImage = async (url: string) => {
  const publicId = extractPublicId(url);
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting image from Cloudinary', error);
    }
  }
};
