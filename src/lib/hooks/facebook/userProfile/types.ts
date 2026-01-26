export interface FacebookUserProfile {
  facebook_user_id?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_picture_url?: string;
  profile_link?: string;
  locale?: string;
  timezone?: string | number | null;
  verified?: boolean;
  about?: string | null;
  birthday?: string | null;
  location?: string | null;
  hometown?: string | null;
  website?: string | null;
}

export interface FacebookUserProfileResponse {
  success: boolean;
  message: string;
  profile: FacebookUserProfile | null;
  pages: any[];
  source: string | null;
  last_updated: string | null;
  error?: string | null;
}

export interface FacebookUserProfileState {
  loading: boolean;
  error: string | null;
  profile: FacebookUserProfile | null;
}

