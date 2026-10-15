import axios from "axios";
import { toastBus } from "../lib/toastBus";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

// In development Vite proxies /api and /uploads to the local API.
// In production VITE_API_URL should be the full Render API URL, including /api.
export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_URL || "/api",
);
export const UPLOADS_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_UPLOADS_URL || "",
);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("portfolio_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Let the browser/Axios set the multipart boundary automatically.
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

// Global error interceptor.
// Component-level code (e.g. useFetch, form submit handlers) still owns
// rendering error state inline — this only standardizes the *unexpected*
// failure classes (dead network, timeouts, server errors, expired
// sessions) with a consistent toast, so no call site has to remember to.
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const hadToken = Boolean(localStorage.getItem("portfolio_admin_token"));
    const status = error?.response?.status as number | undefined;

    if (!error.response) {
      // Request never reached the server: DNS failure, offline, CORS, etc.
      toastBus.error(
        error.code === "ECONNABORTED"
          ? "Request timed out. Please try again."
          : "Can't reach the server. Check your connection and try again.",
      );
    } else if (status === 401) {
      localStorage.removeItem("portfolio_admin_token");
      if (hadToken) {
        toastBus.error("Your session has expired. Please log in again.");
      }
    } else if (status === 429) {
      toastBus.error(
        (error.response?.data?.message as string) ||
          "Too many requests. Please slow down and try again.",
      );
    } else if (status && status >= 500) {
      toastBus.error(
        "Something went wrong on our end. Please try again shortly.",
      );
    }

    return Promise.reject(error);
  },
);

export const resolveAssetUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;

  const base = UPLOADS_BASE_URL || API_BASE_URL.replace(/\/api\/?$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

export const optimizeCloudinaryImage = (
  url?: string | null,
  width = 800,
): string | undefined => {
  const resolvedUrl = resolveAssetUrl(url);
  if (!resolvedUrl) return undefined;

  // Leave non-Cloudinary URLs unchanged.
  const marker = "/image/upload/";
  const markerIndex = resolvedUrl.indexOf(marker);

  if (markerIndex === -1) return resolvedUrl;

  const prefix = resolvedUrl.slice(0, markerIndex + marker.length);
  const remainder = resolvedUrl.slice(markerIndex + marker.length);

  // Avoid inserting transformations twice.
  if (/^(f_auto|q_auto|w_\d+)(,|\/)/.test(remainder)) {
    return resolvedUrl;
  }

  return `${prefix}f_auto,q_auto,w_${width}/${remainder}`;
};
