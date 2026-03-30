// ============= Contact requests api=============
export const ADD_CONTACT_REQUEST = () => `/contact-request`;
export const GET_CONTACT_REQUEST = () => `/contact-request`;
export const GET_ALL_CONTACT_REQUEST = () => `/contact-request/all`;
export const UPDATE_CONTACT_REQUEST_STATUS = (id: string) => `/contact-request/update-status/${id}`;

// ============= User api=============
export const CREATE_ADMIN_USER = () => `/user/createUser`;
export const GET_ADMIN_USERS = () => `/user/admin-users`;
export const GET_ALL_USERS = () => `/user/users`;
export const GET_ALL_ADMIN_USERS = () => `/user/admin-users/all`;
export const DELETE_ADMIN_USER = (id: string) => `/user/${id}`;
export const UPDATE_ADMIN_USER = (id: string) => `/user/${id}`;
export const GET_USER_INFO = () => `/user/user-info`;

//============== Hooks api==============
export const GET_USER_INFO_HOOK = () => `/api/user/user-info`;


// ============= export api=============
export const EXPORT_DATA = () => `/export`;
export const EXPORT_ALL_SURVEY_RESPONSES = (surveyId: string) =>
  `/export/all-responses/${surveyId}`;

// ============= country api=============
export const GET_ALL_COUNTRIES = () => `/country/all`;
export const DELETE_COUNTRY = (id: string) => `/country/${id}`;
export const CREATE_COUNTRY = () => `/country`;

// ============= survey api=============
export const GET_ALL_SURVEYS = () => `/survey/all`;
export const GET_SURVEY_BY_ID = (id: string) => `/survey/${id}`;
export const CREATE_SURVEY = () => `/survey`;
export const EDIT_SURVEY = (id: string) => `/survey/${id}`;
export const DELETE_SURVEY = (id: string) => `/survey/${id}`;
export const GET_SURVEY_ADMIN_RESPONSES = () => `/survey/admin/responses`;
export const DELETE_SURVEY_ADMIN_RESPONSE = (responseId: string) =>
  `/survey/admin/responses/${responseId}`;