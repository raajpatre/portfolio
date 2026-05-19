import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function optimizeCloudinaryUrl(url: string | null | undefined): string {
  if (!url) return "";
  // If it's already optimized or not a cloudinary URL, return as is
  if (!url.includes("res.cloudinary.com") || url.includes("f_auto") || url.includes("q_auto")) {
    return url;
  }
  // Cloudinary URLs usually have /upload/ in them. We insert f_auto,q_auto after /upload/
  return url.replace("/upload/", "/upload/f_auto,q_auto/");
}
