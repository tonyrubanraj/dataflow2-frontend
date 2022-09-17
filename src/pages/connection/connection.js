import * as React from "react";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import "./connection.css";
import { createConnection } from "../../services/connectionServices";
import { testConnection } from "../../services/connectionServices";
import MySQLForm from "../../components/mySQLForm/mySQLForm";
import BigQueryForm from "../../components/bigQueryForm/bigQueryForm";

const theme = createTheme();

export default function Connection() {
  const [connectionName, setConnectionName] = useState("");
  const [dbType, setDbType] = useState("");
  const [connectionSettings, setConnectionSettings] = useState({});
  const [isConnectionSettingsValid, setIsConnectionSettingsValid] =
    useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [testConnectionStatus, setTestConnectionStatus] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState(0);
  const [errors, setErrors] = useState({
    connectionName: "",
    dbType: "",
  });

  const updateConnectionSettings = (connection_params, status) => {
    setConnectionSettings(connection_params);
    setIsConnectionSettingsValid(status);
  };

  useEffect(() => {
    setTestConnectionStatus(0);
    setConnectionStatus(0);
    if (connectionName && dbType && isConnectionSettingsValid) {
      let flag = true;
      for (let key in errors) {
        if (errors[key] !== "") {
          flag = false;
          break;
        }
      }
      setIsFormValid(flag);
    } else {
      setIsFormValid(false);
    }
  }, [connectionName, dbType, isConnectionSettingsValid, errors]);

  const onCreateConnection = (e) => {
    let connection_settings = {
      connectionName,
      dbType,
      connectionParameters: connectionSettings,
    };
    if (isFormValid) {
      createConnection(connection_settings)
        .then(() => {
          setConnectionStatus(1);
        })
        .catch((error) => {
          if (error.response.status === 409)
            setErrors({
              ...errors,
              connectionName: "Connection name already exists",
            });
          else setConnectionStatus(2);
        });
    }
    e.preventDefault();
  };

  const onTestConnection = (e) => {
    let connection_settings = {
      connectionName,
      dbType,
      connectionParameters: connectionSettings,
    };
    if (isFormValid) {
      testConnection(connection_settings)
        .then(() => {
          setTestConnectionStatus(1);
        })
        .catch(() => {
          setTestConnectionStatus(2);
        });
    }
    e.preventDefault();
  };

  const validateForm = (field, value) => {
    switch (field) {
      case "connectionName":
        if (value.length === 0) {
          setErrors({
            ...errors,
            connectionName: "Connection Name cannot be empty",
          });
        } else {
          setErrors({
            ...errors,
            connectionName: "",
          });
        }
        break;
      case "dbType":
        if (value.length === 0) {
          setErrors({
            ...errors,
            dbType: "Choose a valid DB Type",
          });
        } else {
          setErrors({
            ...errors,
            dbType: "",
          });
        }
        break;
      default:
        break;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Grid item xs={12} sm={5} md={5} component={Paper}>
            <Box
              sx={{
                my: 6,
                mx: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Create Connection
              </Typography>
              <Box component="form" noValidate sx={{ mt: 2, width: "100%" }}>
                <TextField
                  margin="normal"
                  helperText={errors.connectionName}
                  error={errors.connectionName ? true : false}
                  required
                  fullWidth
                  value={connectionName}
                  name="connectionName"
                  label="Connection Name"
                  id="connectionName"
                  onChange={(e) => {
                    validateForm("connectionName", e.target.value);
                    setConnectionName(e.target.value);
                  }}
                />
                <FormControl
                  fullWidth
                  error={errors.dbType ? true : false}
                  sx={{ mt: 2, mb: 1 }}
                >
                  <InputLabel id="dbType">Connection DB Type</InputLabel>
                  <Select
                    labelId="dbType"
                    id="dbType"
                    fullWidth
                    value={dbType}
                    label="Connection DB Type"
                    onChange={(e) => {
                      validateForm("dbType", e.target.value);
                      setIsConnectionSettingsValid(false);
                      setConnectionSettings({});
                      setDbType(e.target.value);
                    }}
                  >
                    <MenuItem value="" selected>
                      --Select--
                    </MenuItem>
                    <MenuItem value="mysql">MySQL</MenuItem>
                    <MenuItem value="aws_mysql">Amazon RDS for MySQL</MenuItem>
                    <MenuItem value="bigquery">BigQuery</MenuItem>
                  </Select>
                </FormControl>
                {(dbType === "mysql" || dbType === "aws_mysql") && (
                  <MySQLForm onFieldChange={updateConnectionSettings} />
                )}
                {dbType === "bigquery" && (
                  <BigQueryForm onFieldChange={updateConnectionSettings} />
                )}
                <Grid item xs={12} sm={12} md={12} alignItems="left">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                    }}
                  >
                    <Grid item xs={12} md={5.5} sm={5.5}>
                      <Button
                        onClick={onTestConnection}
                        disabled={isFormValid ? false : true}
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, py: 1.5 }}
                      >
                        Test Connection
                      </Button>
                      <Grid item>
                        <div
                          className={`connection__form__error-msg${
                            testConnectionStatus === 2 ? "" : " hide"
                          }`}
                        >
                          Error connecting to the data source. Please check the
                          connection parameters
                        </div>
                        <div
                          className={`connection__form__success-msg${
                            testConnectionStatus === 1 ? "" : " hide"
                          }`}
                        >
                          Successfully connected to the data source
                        </div>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={5.5} sm={5.5}>
                      <Button
                        onClick={onCreateConnection}
                        disabled={isFormValid ? false : true}
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, py: 1.5 }}
                      >
                        Create Connection
                      </Button>
                      <Grid item>
                        <div
                          className={`connection-params__form__success-msg${
                            connectionStatus === 1 ? "" : " hide"
                          }`}
                        >
                          Successfully created connection record
                        </div>
                        <div
                          className={`connection-params__form__error-msg${
                            connectionStatus === 2 ? "" : " hide"
                          }`}
                        >
                          Internal Error
                        </div>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
