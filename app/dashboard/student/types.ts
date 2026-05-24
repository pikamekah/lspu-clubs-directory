export type StudentView =
  | "dashboard"
  | "clubs"
  | "events"
  | "announcement"
  | "account";

export type DashboardFeature =
  | "clubs"
  | "members"
  | "events"
  | "announcement";

export type AccountForm = {
  first_name: string;
  last_name: string;
  email: string;
  student_id: string;
  department: string;
  program: string;
  course_section: string;
  year_level: string;
  gender: string;
  contact_number: string;
  profile_url: string;
};

export type StudentUser = {
  id?: string;
  auth_id: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  role?: string;
  profile_url?: string;
};

export type Organization = {
  id: string;
  name?: string;
  slug?: string;
  short_desc?: string;
  description?: string;
  department?: string;
  category?: string;
  logo_url?: string;
  banner_url?: string;
};

export type StudentApplication = {
  id: string;
  user_id?: string;
  org_id: string;
  status: string;
  role?: string;
  full_name?: string;
  name?: string;
  course_section?: string;
  organizations?: Organization;
};

export type StudentEvent = {
  id: string;
  org_id: string;
  title?: string;
  description?: string;
  venue?: string;
  category?: string;
  date?: string;
  time?: string;
  image_url?: string;
};

export type StudentMember = {
  id: string;
  org_id?: string;
  full_name?: string;
  name?: string;
  role?: string;
  course_section?: string;
  organizations?: Organization;
};

export type StudentNotification = {
  id: string;
  notification_id?: string;
  title?: string;
  message?: string;
  type?: string;
  is_read?: boolean;
  created_at?: string;
  announcement_group?: string;
  target_role?: string;
  target_type?: string;
  target_value?: string;
};

export type StudentAnnouncement = {
  id: string;
  title?: string;
  message?: string;
  target_type?: string;
  target_value?: string;
  notification_id?: string;
  is_read?: boolean;
  created_at?: string;
};