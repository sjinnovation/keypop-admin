import { CREATE_SURVEY, EDIT_SURVEY, GET_ALL_SURVEYS, GET_SURVEY_BY_ID, DELETE_SURVEY } from "@/constant/ApiConstants";
import { axiosPrivate } from "@/lib/axios";

export const getAllSurveys = async () => {
  try {
    const response = await axiosPrivate.get(GET_ALL_SURVEYS());
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error);
  }
};

export const getSurveyById = async (id: any) => {
  try {
    const response = await axiosPrivate.get(GET_SURVEY_BY_ID(id));
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error);
  }
};

export const createSurvey = async (body: any) => {
  try {
    const response = await axiosPrivate.post(CREATE_SURVEY(), body);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response?.data?.error);
  }
};

export const editSurvey = async (id: any, body: any) => {
  try {
    const response = await axiosPrivate.put(EDIT_SURVEY(id), body);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'An error occurred while updating the survey');
  }
};

export const deleteSurvey = async (id: any) => {
  try {
    const response = await axiosPrivate.delete(DELETE_SURVEY(id));
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response?.data?.error);
  }
};

