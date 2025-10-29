import { apiImages } from "./api.js";
import { showLoading, hideLoading } from "../stores/loadingStore.js";

async function base64ToBlob(base64) {
  const response = await fetch(base64);
  const blob = await response.blob();
  return blob;
}

export async function uploadImagesBase64(base64String) {
  try {
    showLoading();

    // Convierte la cadena base64 en un objeto blob
    const blob = await base64ToBlob(base64String);

    // Usa FormData para enviar el archivo
    const formData = new FormData();
    formData.append("file", blob, "image.png");
    formData.append("fileName", "image.png");

    const folder = import.meta.env.VITE_FOLDER_IMAGES || "products";

    const response = await apiImages.post(`/image/upload/${folder}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.imageUrl;
  } catch (error) {
    return await Promise.reject(error.response ? error.response.data : error);
  } finally {
    hideLoading();
  }
}

export async function uploadImagesFile(file) {
  try {
    showLoading();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    const folder = import.meta.env.VITE_FOLDER_IMAGES || "products";

    const response = await apiImages.post(`/image/upload/${folder}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.imageUrl;
  } catch (error) {
    return await Promise.reject(error.response ? error.response.data : error);
  } finally {
    hideLoading();
  }
}
