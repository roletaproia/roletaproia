import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  // VITE_APP_URL is the URL of the backend service (e.g., Render URL)
  if (import.meta.env.VITE_APP_URL) return import.meta.env.VITE_APP_URL; 
  // Fallback for development (should be proxied by Vite)
  return ""; 
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
