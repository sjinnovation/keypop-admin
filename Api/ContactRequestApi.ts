import { axiosPrivate } from "@/lib/axios";
import { ADD_CONTACT_REQUEST, GET_ALL_CONTACT_REQUEST, GET_CONTACT_REQUEST, UPDATE_CONTACT_REQUEST_STATUS } from "@/constant/ApiConstants";

export const addContactRequest = async (name: string, email: string, phoneNumber: string, message: string) => {
    try{
        const response = await axiosPrivate.post(ADD_CONTACT_REQUEST(), { name, email, phoneNumber, message });
        return response.data;
    }catch(error: any){
        throw new Error(error.response?.data?.error);
    }
};

export const getContactRequests = async (page: number, limit: number) => {
    try{
        const response = await axiosPrivate.get(GET_CONTACT_REQUEST(), { params: { page, limit } });
        return response.data;
    }catch(error: any){
        throw new Error(error.response?.data?.error);
    }
};

export const updateContactRequestStatus = async (id: string, status: string) => {
    try{
        const response = await axiosPrivate.put(UPDATE_CONTACT_REQUEST_STATUS(id), { status });
        return response.data;
    }catch(error: any){
        throw new Error(error.response?.data?.error);
    }
};

export const getAllContactRequests = async (filters: any) => {
    try{
        const response = await axiosPrivate.get(GET_ALL_CONTACT_REQUEST(), { params: filters });
        return response.data;
    }catch(error: any){
        throw new Error(error.response?.data?.error);
    }
};