import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "./configs.js";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME!,
  api_key: CLOUDINARY_API_KEY!,
  api_secret: CLOUDINARY_API_SECRET!,
});

export const uploadOnCloudinary = async (localImagePath: string) => {
  if (!localImagePath) return null;

  try {
    const result = await cloudinary.uploader.upload(localImagePath, {
      folder: "profile_pictures",
      resource_type: "image",
    });

    fs.unlinkSync(localImagePath); // delete file from local after upload
    return result.url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export default uploadOnCloudinary;
