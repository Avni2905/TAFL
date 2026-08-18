const CLOUD_NAME = "dreg7o41n";
const UPLOAD_PRESET = "tafl_uploads";

export const uploadToCloudinary = async (file, folder = "general") => {
  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("File too large. Maximum size is 10MB.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", `tafl/${folder}`);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Cloudinary error:", data);
      throw new Error(data.error?.message || "Upload failed. Check Cloudinary preset settings.");
    }

    if (!data.secure_url) {
      throw new Error("No URL returned from upload.");
    }

    return data.secure_url;
  } catch (e) {
    if (e.message.includes("Failed to fetch")) {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw e;
  }
};

export const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUD_NAME}`;
