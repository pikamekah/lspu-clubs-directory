export function getDepartmentStyle(department?: string) {
  const key = (department || "").toUpperCase();

  if (key === "CAS") return "bg-[#CDE4DE] text-[#2F4F48]";
  if (key === "CBAA") return "bg-[#A4C2B2] text-[#263D33]";
  if (key === "CCJE") return "bg-[#FCDCD3] text-[#7A3A2C]";
  if (key === "CIHTM") return "bg-[#F6B3A2] text-[#6D2E23]";
  if (key === "CCS") return "bg-[#E4989C] text-white";
  if (key === "CIT") return "bg-[#B5838D] text-white";
  if (key === "COE") return "bg-[#B1A0CE] text-[#34284A]";
  if (key === "CONAH") return "bg-[#9A80B4] text-white";
  if (key === "CTE") return "bg-[#6F8FC1] text-white";
  if (key === "NON-ACAD") return "bg-[#3C5D81] text-white";

  return "bg-gray-200 text-gray-700";
}

export function getCategoryStyle(category?: string) {
  const key = (category || "").toLowerCase();

  if (key === "seminar") return "bg-[#F1C5AE] text-[#4F2B21]";
  if (key === "workshop") return "bg-[#ECDDD0] text-[#4B372C]";
  if (key === "competition") return "bg-[#CED2C2] text-[#35455D]";
  if (key === "recruitment") return "bg-[#92B1B6] text-[#102B33]";
  if (key === "meeting") return "bg-[#35455D] text-white";
  if (key === "social") return "bg-[#BFD1DF] text-[#26384A]";

  return "bg-[#35455D] text-white";
}