import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function getBaseUrl() {
  if (typeof window !== "undefined") {
    // No browser, use a URL atual (frontend e backend no mesmo domínio)
    return window.location.origin;
  }
  // VITE_APP_URL is the URL of the backend service (e.g., Render URL)
  if (import.meta.env.VITE_APP_URL) return import.meta.env.VITE_APP_URL; 
  // Fallback for development
  return "https://roboroleta.com.br"; 
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
