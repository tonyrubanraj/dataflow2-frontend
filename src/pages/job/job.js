import * as React from "react";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./job.css";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import {
  getConnections,
  getDestinationSchemas,
  getDestinationTables,
  getSourceSchemas,
  getSourceTables,
  migrate,
} from "../../services/jobServices";

const theme = createTheme();

export default function Job() {
  const [connectionId, setConnectionId] = useState(-1);
  const [sourceSchema, setSourceSchema] = useState("");
  const [destinationSchema, setDestinationSchema] = useState("");
  const [connections, setConnections] = useState([]);
  const [sourceSchemas, setSourceSchemas] = useState([]);
  const [destinationSchemas, setDestinationSchemas] = useState([]);
  const [sourceTablesList, setSourceTablesList] = useState([]);
  const [destinationTablesList, setDestinationTablesList] = useState([]);
  const [sourceTables, setSourceTables] = useState([
    {
      id: 0,
      value: "",
    },
  ]);
  const [destinationTables, setDestinationTables] = useState([
    {
      id: 0,
      value: "",
    },
  ]);
  const [jobType, setJobType] = useState("");
  const [isValidForm, setIsValidForm] = useState(false);
  const [formStatus, setFormStatus] = useState(0);

  const [errors, setErrors] = useState({
    connectionId: "",
    sourceSchema: "",
    destinationSchema: "",
    sourceTables: "",
    destinationTables: "",
    jobType: "",
  });

  const addTableField = () => {
    setSourceTables([
      ...sourceTables,
      {
        id: sourceTables.length,
        value: "",
      },
    ]);
    setDestinationTables([
      ...destinationTables,
      {
        id: destinationTables.length,
        value: "",
      },
    ]);
  };

  const removeTableField = () => {
    let sourceTableCount = sourceTables.length - 1;
    setSourceTables(
      sourceTables.filter((table) => table.id !== sourceTableCount)
    );
    let destinationTableCount = destinationTables.length - 1;
    setDestinationTables(
      destinationTables.filter((table) => table.id !== destinationTableCount)
    );
  };

  useEffect(() => {
    getConnections().then((res) => setConnections(res.data));
  }, []);

  useEffect(() => {
    getSourceSchemas(connectionId)
      .then((response) => {
        setSourceSchemas(response.data);
      })
      .catch(() => {
        setSourceSchemas([]);
      });
    getDestinationSchemas(connectionId)
      .then((response) => {
        setDestinationSchemas(response.data);
      })
      .catch(() => {
        setDestinationSchemas([]);
      });
  }, [connectionId]);

  useEffect(() => {
    getSourceTables(connectionId, sourceSchema)
      .then((response) => {
        setSourceTablesList(response.data);
      })
      .catch(() => {
        setSourceTablesList([]);
      });
    getDestinationTables(connectionId, destinationSchema)
      .then((response) => {
        setDestinationTablesList(response.data);
      })
      .catch(() => {
        setDestinationTablesList([]);
      });
  }, [connectionId, sourceSchema, destinationSchema]);

  const validateJobForm = (field, value) => {
    switch (field) {
      case "connectionId": {
        if (parseInt(value) === -1) {
          setErrors({
            ...errors,
            connectionId: "Connection name cannot be empty",
            sourceSchema: "",
            destinationSchema: "",
            sourceTables: "",
            destinationTables: "",
          });
        } else {
          setErrors({
            ...errors,
            connectionId: "",
            sourceSchema: "",
            destinationSchema: "",
            sourceTables: "",
            destinationTables: "",
          });
        }
        break;
      }
      case "sourceSchema": {
        if (value.length === 0) {
          setErrors({
            ...errors,
            sourceSchema: "Source schema cannot be empty",
            sourceTables: "",
          });
        } else {
          setErrors({
            ...errors,
            sourceSchema: "",
            sourceTables: "",
          });
        }
        break;
      }
      case "destinationSchema": {
        if (value.length === 0) {
          setErrors({
            ...errors,
            destinationSchema: "Destination schema cannot be empty",
            destinationTables: "",
          });
        } else {
          setErrors({
            ...errors,
            destinationSchema: "",
            destinationTables: "",
          });
        }
        break;
      }
      case "sourceTables": {
        if (value.length === 0) {
          setErrors({
            ...errors,
            sourceTables: "Source table cannot be empty",
          });
        } else {
          setErrors({
            ...errors,
            sourceTables: "",
          });
        }
        break;
      }
      case "destinationTables": {
        if (value.length === 0) {
          setErrors({
            ...errors,
            destinationTables: "Destination table cannot be empty",
          });
        } else {
          setErrors({
            ...errors,
            destinationTables: "",
          });
        }
        break;
      }
      case "jobType": {
        if (value.length === 0) {
          setErrors({
            ...errors,
            jobType: "Job type cannot be empty",
          });
        } else {
          setErrors({
            ...errors,
            jobType: "",
          });
        }
        break;
      }
      default:
        break;
    }
  };

  const isValidTable = (tables) => {
    for (const table of tables) {
      if (table.value === "") {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    setFormStatus(0);
    let flag = true;
    if (
      parseInt(connectionId) !== -1 &&
      sourceSchema &&
      destinationSchema &&
      isValidTable(sourceTables) &&
      isValidTable(destinationTables) &&
      jobType
    ) {
      for (let key in errors) {
        if (errors[key] !== "") {
          flag = false;
          break;
        }
      }
      setIsValidForm(flag);
    } else {
      setIsValidForm(false);
    }
  }, [
    errors,
    connectionId,
    destinationSchema,
    destinationTables,
    jobType,
    sourceSchema,
    sourceTables,
  ]);

  const handleSubmit = (e) => {
    const job_settings = {
      connectionId: connectionId,
      sourceSchema: sourceSchema,
      destinationSchema: destinationSchema,
      sourceTables: sourceTables.map((table) => table.value),
      destinationTables: destinationTables.map((table) => table.value),
      jobType: jobType,
    };
    if (isValidForm) {
      migrate(job_settings)
        .then((response) => {
          setFormStatus(1);
        })
        .catch(() => {
          setFormStatus(2);
        });
    }
    e.preventDefault();
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        component="main"
        sx={{ height: "100vh" }}
        justifyContent="center"
      >
        <Grid item xs={12} sm={6} md={6} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Data Transfer Job Settings
            </Typography>
            <Box
              component="form"
              noValidate={false}
              onSubmit={handleSubmit}
              sx={{ mt: 3, width: "100%" }}
            >
              <FormControl
                fullWidth
                error={errors.connectionId ? true : false}
                sx={{ my: 2 }}
              >
                <InputLabel id="connectionId">
                  Choose the Connection setting
                </InputLabel>
                <Select
                  labelId="connectionId"
                  id="connectionId"
                  fullWidth
                  value={connectionId}
                  label="Choose the Connection setting"
                  onChange={(e) => {
                    validateJobForm("connectionId", e.target.value);
                    setSourceSchema("");
                    setDestinationSchema("");
                    setConnectionId(e.target.value);
                  }}
                >
                  <MenuItem value="-1" selected>
                    --Select--
                  </MenuItem>
                  {connections.map(({ name, id }) => {
                    return (
                      <MenuItem key={id} value={id}>
                        {name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Grid item xs={12} sm={12} md={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Grid item xs={12} sm={5.5} md={5.5}>
                    <FormControl
                      fullWidth
                      error={errors.sourceSchema ? true : false}
                      sx={{ my: 2 }}
                    >
                      <InputLabel id="sourceSchema">
                        Choose the Source schema
                      </InputLabel>
                      <Select
                        labelId="sourceSchema"
                        id="sourceSchema"
                        fullWidth
                        value={sourceSchema}
                        label="Choose the Source schema"
                        onChange={(e) => {
                          validateJobForm("sourceSchema", e.target.value);
                          setSourceSchema(e.target.value);
                        }}
                      >
                        <MenuItem value="">--Select--</MenuItem>
                        {sourceSchemas.map((schema) => {
                          return (
                            <MenuItem key={schema} value={schema}>
                              {schema}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={5.5} md={5.5}>
                    <FormControl
                      fullWidth
                      error={errors.destinationSchema ? true : false}
                      sx={{ my: 2 }}
                    >
                      <InputLabel id="destinationSchema">
                        Choose the Destination schema
                      </InputLabel>
                      <Select
                        labelId="destinationSchema"
                        id="destinationSchema"
                        fullWidth
                        value={destinationSchema}
                        label="Choose the Destination schema"
                        onChange={(e) => {
                          validateJobForm("destinationSchema", e.target.value);
                          setDestinationSchema(e.target.value);
                        }}
                      >
                        <MenuItem value="">--Select--</MenuItem>
                        {destinationSchemas.map((schema) => {
                          return (
                            <MenuItem key={schema} value={schema}>
                              {schema}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Grid item xs={12} sm={5.5} md={5.5}>
                    {sourceTables.map((input) => (
                      <FormControl key={input.id} fullWidth sx={{ my: 1 }}>
                        <InputLabel id={`sourceTable-${input.id}`}>
                          Choose the Source table
                        </InputLabel>
                        <Select
                          labelId={`sourceTable-${input.id}`}
                          id={`sourceTable-${input.id}`}
                          fullWidth
                          value={input.value}
                          label="Choose the Source table"
                          onChange={(e) => {
                            validateJobForm("sourceTables", e.target.value);
                            setSourceTables(
                              sourceTables.map((table) => {
                                if (table.id === input.id) {
                                  table.value = e.target.value;
                                }
                                return table;
                              })
                            );
                          }}
                        >
                          <MenuItem value="">--Select--</MenuItem>
                          {sourceTablesList.map((table) => {
                            return (
                              <MenuItem key={table} value={table}>
                                {table}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    ))}
                    <div
                      className={`source-table--error-msg${
                        errors.sourceTables === "" ? " hide" : ""
                      }`}
                    >
                      {errors.sourceTables}
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={5.5} md={5.5}>
                    {destinationTables.map((input) => (
                      <FormControl key={input.id} fullWidth sx={{ my: 1 }}>
                        <InputLabel id={`destinationTable-${input.id}`}>
                          Choose the Destination table
                        </InputLabel>
                        <Select
                          labelId={`destinationTable-${input.id}`}
                          id={`destinationTable-${input.id}`}
                          fullWidth
                          value={input.value}
                          label="Choose the Destination table"
                          onChange={(e) => {
                            validateJobForm(
                              "destinationTables",
                              e.target.value
                            );
                            setDestinationTables(
                              destinationTables.map((table) => {
                                if (table.id === input.id) {
                                  table.value = e.target.value;
                                }
                                return table;
                              })
                            );
                          }}
                        >
                          <MenuItem value="">--Select--</MenuItem>
                          {destinationTablesList.map((table) => {
                            return (
                              <MenuItem key={table} value={table}>
                                {table}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    ))}
                    <div
                      className={`destination-table--error-msg${
                        errors.destinationTables === "" ? " hide" : ""
                      }`}
                    >
                      {errors.destinationTables}
                    </div>
                  </Grid>
                </Box>
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <div className="job__form__table-btns">
                  <IconButton aria-label="Add" onClick={addTableField}>
                    <FontAwesomeIcon icon={faPlusCircle} />
                  </IconButton>
                  <IconButton aria-label="Remove" onClick={removeTableField}>
                    <FontAwesomeIcon
                      className={`${sourceTables.length > 1 ? "" : " hide"}`}
                      icon={faMinusCircle}
                    />
                  </IconButton>
                </div>
              </Box>

              <FormControl
                fullWidth
                error={errors.jobType ? true : false}
                sx={{ my: 2 }}
              >
                <InputLabel id="jobType">Choose the Job Type</InputLabel>
                <Select
                  labelId="jobType"
                  id="jobType"
                  fullWidth
                  value={jobType}
                  label="Choose the Job Type"
                  onChange={(e) => {
                    validateJobForm("jobType", e.target.value);
                    setJobType(e.target.value);
                  }}
                >
                  <MenuItem value="">--Select--</MenuItem>
                  <MenuItem value="bulk">Bulk</MenuItem>
                  <MenuItem value="cdc">CDC</MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                disabled={isValidForm ? false : true}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                Execute Job
              </Button>
              <Grid container>
                <Grid item>
                  <div
                    className={`job__form__error-msg${
                      formStatus !== 2 ? " hide" : ""
                    }`}
                  >
                    Error in initiating the data migration job. Please check
                    your settings again.
                  </div>
                  <div
                    className={`job__form__success-msg${
                      formStatus !== 1 ? " hide" : ""
                    }`}
                  >
                    Successfully initiated data migration job.
                  </div>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
