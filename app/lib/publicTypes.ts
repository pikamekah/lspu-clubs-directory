export type PublicOrganization = {
  id: string;
  name?: string;
  slug?: string;
  short_desc?: string;
  description?: string;
  category?: string;
  department?: string;
  members?: number;
  location?: string;
  contact?: string;
  contact_email?: string;
  logo_url?: string;
  banner_url?: string;
  status?: string;
  offers?: string | string[];
  officers?: {
    President?: string;
    president?: string;
    [key: string]: string | undefined;
  };
  president?: string;
};

export type PublicEvent = {
  id: string;
  org_id?: string;
  title?: string;
  description?: string;
  category?: string;
  date?: string;
  time?: string;
  venue?: string;
  image_url?: string;
};