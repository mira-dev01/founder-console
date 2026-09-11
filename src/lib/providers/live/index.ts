import { LiveProviderData } from "../types";
import { fetchTwilioLiveData } from "./twilio";
import { fetchCloudinaryLiveData } from "./cloudinary";

/**
 * Maps a provider id (registry.ts) to its live fetcher. Add an entry here only
 * once the fetcher has been built AND verified to return real data with a real
 * key — see README "Adding a live provider card".
 */
export const LIVE_FETCHERS: Record<string, () => Promise<LiveProviderData>> = {
  twilio: fetchTwilioLiveData,
  cloudinary: fetchCloudinaryLiveData,
};
