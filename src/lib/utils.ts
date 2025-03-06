import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBackendURL() {
  return import.meta.env.VITE_API_URL || "http://localhost:8787";
}
