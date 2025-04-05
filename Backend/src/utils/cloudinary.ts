import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import { ApiError } from "./ApiError.js";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string) => {
    try {
        console.log('Starting upload, file path:', localFilePath);
        
        if (!localFilePath) {
            console.log('No file path provided');
            return null;
        }

        console.log('About to upload to Cloudinary...');
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        console.log("File uplload successfully: ", uploadResult);
        
        fs.unlinkSync(localFilePath);
        return uploadResult;
    } catch (error) {
        console.error('Full upload error:', error);
        fs.unlinkSync(localFilePath);
        
        return null;
    }  
}

const deleteFileOnCloudinary = async (urlOfFile: string) => {
    try {
        const publicId = urlOfFile.split('/').pop()?.split('.')[0];
        if(!publicId) {
            throw new ApiError(404, "publicId is not found for deleteing the file from cloudinary");
        }

        await cloudinary.uploader.destroy(publicId);
        console.log("File deleted successfully")
    } catch (error) {
        console.log("Error in deleting file from cloudinary", error);
    }
}

export { uploadOnCloudinary, deleteFileOnCloudinary };