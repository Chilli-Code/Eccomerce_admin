const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const ADMIN_API = "/cloudinary-admin";

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Error al subir a Cloudinary");

  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
    createdAt: data.created_at,
    size: data.bytes,
  };
}

export async function uploadImages(files, onProgress) {
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const result = await uploadImage(files[i]);
    results.push(result);
    onProgress?.(i + 1, files.length);
  }
  return results;
}

export async function deleteImage(publicId) {
  const res = await fetch(
    `${ADMIN_API}/resources/image/upload?public_ids[]=${publicId}`,
    { method: "DELETE" }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Error al eliminar");
  return data.deleted?.[publicId] === "deleted";
}

export async function listImages(options = {}) {
  const params = new URLSearchParams({
    max_results: String(options.maxResults || 100),
    ...(options.nextCursor ? { next_cursor: options.nextCursor } : {}),
  });

  const res = await fetch(`${ADMIN_API}/resources/image?${params}`);

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Error al listar imágenes");

  return {
    images: data.resources.map((r) => ({
      publicId: r.public_id,
      url: r.secure_url,
      width: r.width,
      height: r.height,
      format: r.format,
      size: r.bytes,
      createdAt: r.created_at,
    })),
    nextCursor: data.next_cursor,
    totalCount: data.total_count,
  };
}
