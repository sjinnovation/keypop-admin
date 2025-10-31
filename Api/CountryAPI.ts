import { CREATE_COUNTRY, DELETE_COUNTRY, GET_ALL_COUNTRIES } from "@/constant/ApiConstants";
import { axiosPrivate } from "@/lib/axios";

export const getAllCountries =async () =>{
  try {
    const response = await axiosPrivate.get(GET_ALL_COUNTRIES());
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error);
  }
}

export const deleteCountry = async (id: string) => {
  try {
    const response = await axiosPrivate.delete(DELETE_COUNTRY(id));
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error);
  }
};

export const createCountry = async (data: {
  name: string;
  code: string;
  isActive: boolean;
  surveyAvailable: boolean;
}) => {
  try {
    const payload = { ...data };
    const response = await axiosPrivate.post(CREATE_COUNTRY(), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error);
  }
};