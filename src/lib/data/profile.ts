import { profileData } from "@/data/profile";
import type { ProfileData } from "@/types/portfolio";

/**
 * Data Access Layer untuk Profile & Credentials.
 * Siap disambungkan ke pengaturan dinamis di Fase 2.
 */
export async function getProfileData(): Promise<ProfileData> {
  return profileData;
}
