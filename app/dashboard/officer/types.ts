export type OfficerView =
  | "dashboard"
  | "application"
  | "events"
  | "members"
  | "notifications"
  | "club";

export type EventForm = {
  title: string;
  description: string;
  venue: string;
  category: string;
  date: string;
  time: string;
  image_url: string;
};

export type ClubForm = {
  name: string;
  short_desc: string;
  department: string;
  location: string;
  contact: string;
  contact_email: string;
  description: string;
  offers: string;
  banner_url: string;
  logo_url: string;
};

export type MemberApplication = {
  id: string;
  user_id?: string;
  org_id: string;
  status: "pending" | "approved" | "rejected" | string;
  role?: string;
  full_name?: string;
  student_name?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  student_id?: string;
  course_section?: string;
  section?: string;
  year_section?: string;
  email?: string;
  phone?: string;
  contact_number?: string;
  created_at?: string;
};

export type Organization = {
  id: string;
  name: string;
  short_desc?: string;
  department?: string;
  location?: string;
  contact?: string;
  contact_email?: string;
  description?: string;
  offers?: string | string[];
  banner_url?: string;
  logo_url?: string;
};

export type OfficerEvent = {
  id: string;
  org_id?: string;
  title?: string;
  description?: string;
  venue?: string;
  category?: string;
  date?: string;
  time?: string;
  image_url?: string;
  created_by?: string;
};

export type OfficerNotification = {
  id: string;
  notification_id?: string;
  user_id?: string;
  org_id?: string;
  title?: string;
  message?: string;
  type?: string;
  is_read?: boolean;
  created_at?: string;
  announcement_group?: string;
  target_type?: string;
  target_value?: string;
  target_role?: string;
};

export type OfficerUser = {
  id?: string;
  auth_id?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  role?: string;
  org_id?: string | null;
  profile_url?: string;
};