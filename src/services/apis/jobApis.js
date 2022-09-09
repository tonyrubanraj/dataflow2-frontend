const JobApis = {
  GET_CONNECTIONS: "http://localhost:8080/connection/list",
  GET_SOURCE_SCHEMAS: "http://localhost:8080/connection/source/schemas",
  GET_DESTINATION_SCHEMAS:
    "http://localhost:8080/connection/destination/schemas",
  GET_SOURCE_TABLES: "http://localhost:8080/connection/source/tables",
  GET_DESTINATION_TABLES: "http://localhost:8080/connection/destination/tables",
  MIGRATE: "http://localhost:8080/job/migrate",
  GET_JOBS: "http://localhost:8080/job/list",
};

export default JobApis;
