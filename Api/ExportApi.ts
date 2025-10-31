import { axiosPrivate } from "@/lib/axios";
import { EXPORT_DATA } from "@/constant/ApiConstants";
import { HttpStatusCode } from "axios";

export const exportData = async (type: string, tableData: any) => {
  try {
    const response = await axiosPrivate.post(
      EXPORT_DATA(),
      { type, tableData },
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `contact-requests-${type}.${type}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error: any) {
    throw new Error(error.response?.data?.error);
  }
};