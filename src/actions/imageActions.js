"use server";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
} from "@/lib/cloudinary";

/**
 * Transform Cloudinary URL to include optimization parameters
 * @param {string} url - Original Cloudinary URL
 * @returns {string} - Transformed URL with optimization parameters
 */
function transformCloudinaryUrl(url) {
  if (!url) return url;

  // Replace /upload with /upload/w_1024,ar_1:1,c_auto,g_auto,f_auto
  const transformedUrl = url.replace(
    "/upload/",
    "/upload/w_1024,ar_1:1,c_auto,g_auto,f_auto/"
  );

  return transformedUrl;
}

/**
 * Upload image to Cloudinary
 * @param {string} base64Image - Base64 encoded image
 * @returns {Promise<{success: boolean, url?: string, publicId?: string, error?: string}>}
 */
export async function uploadImage(base64Image) {
  try {
    if (!base64Image) {
      return { success: false, error: "No image provided" };
    }

    const result = await uploadToCloudinary(base64Image);

    // Transform the URL before returning
    if (result.success && result.url) {
      result.url = transformCloudinaryUrl(result.url);
    }

    return result;
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      error: error.message || "Failed to upload image",
    };
  }
}

/**
 * Delete image from Cloudinary using URL
 * @param {string} imageUrl - Cloudinary image URL
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteImage(imageUrl) {
  try {
    if (!imageUrl) {
      return { success: false, error: "No image URL provided" };
    }

    const publicId = extractPublicId(imageUrl);
    if (!publicId) {
      return { success: false, error: "Could not extract public ID from URL" };
    }

    const result = await deleteFromCloudinary(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
    return {
      success: false,
      error: error.message || "Failed to delete image",
    };
  }
}
