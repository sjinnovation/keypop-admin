import { axiosPrivate, axiosPublic } from "@/lib/axios";
import { CREATE_ADMIN_USER, DELETE_ADMIN_USER, GET_ADMIN_USERS, GET_ALL_ADMIN_USERS, GET_ALL_USERS, GET_USER_INFO, UPDATE_ADMIN_USER } from "@/constant/ApiConstants";

export const normalizeUsersList = (payload: unknown): any[] => {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const o = payload as Record<string, unknown>;
    if (Array.isArray(o.data)) return o.data as any[];
    if (Array.isArray(o.users)) return o.users as any[];
    const inner = o.data as Record<string, unknown> | undefined;
    if (inner && Array.isArray(inner.users)) return inner.users as any[];
  }
  return [];
};

export const createAdminUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  try {
    const response = await axiosPrivate.post(CREATE_ADMIN_USER(), userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'An error occurred while creating the user');
  }
};

export const getAdminUsers = async (page = 1, limit = 10) => {
  try {
    const response = await axiosPrivate.get(GET_ADMIN_USERS(), {
      params: { page, limit }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'An error occurred while fetching users');
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axiosPrivate.get(GET_ALL_USERS());
    return { users: normalizeUsersList(response.data) };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'An error occurred while fetching users');
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await axiosPrivate.delete(DELETE_ADMIN_USER(userId));
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'An error occurred while deleting the user');
  }
};

export const updateUser = async (userId: string, userData: any) => {
  try {
    const response = await axiosPrivate.put(UPDATE_ADMIN_USER(userId), userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'An error occurred while updating the user');
  }
};

export const getUserInfo = async () => {
  try {
    const response = await axiosPrivate.get(GET_USER_INFO());
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'An error occurred while fetching user info');
  }
};

export const getAllAdminUsers =async (filters: any) =>{
  try {
    const response = await axiosPrivate.get(GET_ALL_ADMIN_USERS(),{ params: filters });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'An error occurred while fetching admin users');
  }
}