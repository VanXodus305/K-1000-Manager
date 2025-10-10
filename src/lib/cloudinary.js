import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {string} file - Base64 encoded image string
 * @param {string} folder - Folder name in Cloudinary (default: "K-1000")
 * @returns {Promise<{success: boolean, url?: string, publicId?: string, error?: string}>}
 */
export async function uploadToCloudinary(file, folder = "K-1000") {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: "auto",
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: error.message || "Failed to upload image",
    };
  }
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteFromCloudinary(publicId) {
  try {
    if (!publicId) {
      return { success: false, error: "No public ID provided" };
    }

    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return {
      success: false,
      error: error.message || "Failed to delete image",
    };
  }
}

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} - Public ID or null
 */
export function extractPublicId(url) {
  if (!url) return null;

  try {
    // Extract public_id from Cloudinary URL
    // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}.{format}
    const match = url.match(/\/v\d+\/(.+)\.\w+$/);
    if (match && match[1]) {
      return match[1];
    }

    // Alternative format without version
    const match2 = url.match(/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    if (match2 && match2[1]) {
      return match2[1];
    }

    return null;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
}

export default cloudinary;
