import axios from "axios";
import ConnectionApis from "./apis/connectionApis";

const createConnection = (connection) => {
  return axios.post(ConnectionApis.CREATE_CONNECTION, connection, {
    withCredentials: "include",
  });
};

const testConnection = (connection) => {
  return axios.post(ConnectionApis.TEST_CONNECTION, connection, {
    withCredentials: "include",
  });
};

export { createConnection, testConnection };
