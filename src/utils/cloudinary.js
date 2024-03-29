import { v2 as cloudinary } from 'cloudinary';
import {extractPublicId} from 'cloudinary-build-url'
import fs from "fs"
import dotenv from "dotenv"
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



const uplodeOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        fs.unlinkSync(localFilePath)
        console.log("uploded succsessfully")
        return response
    } catch (err) {
        fs.unlinkSync(localFilePath)
        return null
    }
}

const deleteOnCloudinary = async (publicId) => {
    if(!publicId) return null
    try {
        cloudinary.api.delete_resources_by_prefix(publicId)
            
    } catch (err) {
        throw err
    }
}

const deleteOnCloudinaryByUrl = async (uri)=>{
    const publicId = extractPublicId(uri);
    await deleteOnCloudinary(publicId);
}
export { uplodeOnCloudinary , deleteOnCloudinary , deleteOnCloudinaryByUrl}