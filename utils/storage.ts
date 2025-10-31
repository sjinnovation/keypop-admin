import Cookies from "js-cookie";

export const getToken = () => {
  return Cookies.get("token");
};

export const getUser = () => {
  const name = Cookies.get("name");
  const role = Cookies.get("role");
  return { name, role };
};

export const setToken = (response: any) => {
  Cookies.set("token", response.token, { expires: 1 });
  Cookies.set("name", response.user.name, { expires: 1 });
  Cookies.set("role", response.user.role, { expires: 1 });
};

export const removeToken = () => {
  Cookies.remove("token");
  Cookies.remove("name");
  Cookies.remove("role");
};