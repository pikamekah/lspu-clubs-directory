import { supabase } from "@/app/lib/supabaseClient";

export async function uploadEventImage(file: File) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("event-images")
    .upload(fileName, file, { upsert: true });

  if (error) {
    alert(error.message);
    return "";
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("event-images").getPublicUrl(fileName);

  return publicUrl;
}