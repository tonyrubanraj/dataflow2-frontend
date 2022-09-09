import axios from "axios";
import UserApis from "./apis/userApis";

const authenticateUser = (user) => {
  return axios.post(UserApis.AUTHENTICATE_USER, user, {
    withCredentials: true,
  });
};

const createUser = (user) => {
  return axios.post(UserApis.CREATE_USER, user, {
    withCredentials: "include",
  });
};
export { authenticateUser, createUser };
