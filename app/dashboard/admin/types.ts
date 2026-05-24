export type AdminView =
  | "dashboard"
  | "organizations"
  | "events"
  | "announcement"
  | "users"
  | "contacts";

export type AdminContactMessage = {
  id: string;
  name: string;
  email: string;
  concern: string;
  message: string;
  status?: string;
  created_at?: string;
};

export type AnnouncementTargetType =
  | "all"
  | "officers"
  | "organization";

export type UserRole =
  | "student"
  | "officer_admin"
  | "main_admin"
  | string;

export type AdminUser = {
  id: string;
  auth_id: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: UserRole;
  org_id?: string | null;
  student_id?: string | null;
  program?: string | null;
  college?: string | null;
  course_section?: string | null;
  section?: string | null;
  year_level?: string | null;
  profile_url?: string | null;
};

export type AdminOrganization = {
  id: string;
  name?: string;
  slug?: string;
  short_desc?: string;
  description?: string;
  category?: string;
  department?: string;
  members?: number;
  location?: string;
  president?: string;
  contact?: string;
  contact_email?: string;
  logo_url?: string;
  banner_url?: string;
  status?: string;
  offers?: string | string[];
  officers?: {
    President?: string;
    [key: string]: string | undefined;
  };
};

export type AdminEvent = {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  program?: string;
  org_id?: string | null;
  date?: string;
  time?: string;
  venue?: string;
  image_url?: string;
  created_by?: string;
};

export type AdminMember = {
  id: string;
  user_id: string;
  org_id: string;
  status?: string;
  role?: string;
  full_name?: string;
  student_id?: string;
  program?: string;
  year_level?: string;
  email?: string;
  phone?: string;
  course_section?: string;
};

export type AdminAnnouncement = {
  id: string;
  title?: string;
  message?: string;
  type?: string;
  is_read?: boolean;
  created_at?: string;
  announcement_group?: string;
  created_by?: string;
  target_type?: AnnouncementTargetType | string;
  target_value?: string | null;
};

export type OrgForm = {
  name: string;
  short_desc: string;
  department: string;
  description: string;
  offers: string;
  members: string;
  location: string;
  president: string;
  contact: string;
  banner_url: string;
  logo_url: string;
};

export type EventForm = {
  title: string;
  description: string;
  category: string;
  program: string;
  org_id: string;
  date: string;
  time: string;
  venue: string;
  image_url: string;
};

export type AnnouncementForm = {
  title: string;
  message: string;
  target_type: AnnouncementTargetType;
  target_value: string;
};