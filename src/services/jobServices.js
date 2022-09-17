import axios from "axios";
import JobApis from "./apis/jobApis";

const getConnections = () => {
  return axios.get(JobApis.GET_CONNECTIONS, {
    withCredentials: true,
  });
};

const getSourceSchemas = (connectionId) => {
  return axios.get(JobApis.GET_SCHEMAS, {
    withCredentials: true,
    params: {
      connectionId: connectionId,
    },
  });
};

const getDestinationSchemas = (connectionId) => {
  return axios.get(JobApis.GET_SCHEMAS, {
    withCredentials: true,
    params: {
      connectionId: connectionId,
    },
  });
};

const getSourceTables = (connectionId, sourceSchema) => {
  return axios.get(JobApis.GET_TABLES, {
    withCredentials: true,
    params: {
      connectionId: connectionId,
      schema: sourceSchema,
    },
  });
};

const getDestinationTables = (connectionId, destinationSchema) => {
  return axios.get(JobApis.GET_TABLES, {
    withCredentials: true,
    params: {
      connectionId: connectionId,
      schema: destinationSchema,
    },
  });
};

const migrate = (job) => {
  return axios.post(JobApis.MIGRATE, job, {
    withCredentials: "include",
  });
};

const getJobs = () => {
  return axios.get(JobApis.GET_JOBS, {
    withCredentials: true,
  });
};

export {
  getConnections,
  getSourceSchemas,
  getDestinationSchemas,
  getSourceTables,
  getDestinationTables,
  migrate,
  getJobs,
};
