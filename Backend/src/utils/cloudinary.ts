import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

console.log("Verifying Cloudinary config...", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    has_secret: !!process.env.CLOUDINARY_API_SECRET
});

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

        // Verify file exists
        if (!fs.existsSync(localFilePath)) {
            console.log('File does not exist at path:', localFilePath);
            return null;
        }

        console.log('About to upload to Cloudinary...');
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        
        console.log('Upload successful:', {
            url: uploadResult.url,
            public_id: uploadResult.public_id
        });
        
        fs.unlinkSync(localFilePath);
        return uploadResult;
    } catch (error) {
        console.error('Full upload error:', error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }  
}

export default uploadOnCloudinary;