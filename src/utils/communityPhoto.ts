/** Keep demo photos small enough for browser storage. Never persist the original file. */
export async function prepareCommunityPhoto(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("format");
  if (file.size > 10 * 1024 * 1024) throw new Error("size");
  const image = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1280 / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("decode");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const result = canvas.toDataURL("image/jpeg", .8);
    if (!result.startsWith("data:image/jpeg;base64,") || result.length > 1500000) throw new Error("size");
    return result;
  } finally { image.close(); }
}

export function isCommunityPhoto(value: unknown): value is string {
  return typeof value === "string" && value.length <= 1500000 && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(value);
}
