import * as React from "react";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import "./connectionContainer.css";
import { testConnection } from "../../services/connectionServices";

export default function ConnectionContainer(props) {
  let connectionParams = props.connectionParams;
  const [formStatus, setFormStatus] = useState(0);
  const [errors, setErrors] = useState({
    dbType: "",
    url: "",
    username: "",
    password: "",
  });

  const validateConnectionForm = (field, value) => {
    switch (field) {
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
      case "url":
        if (value.length === 0) {
          setErrors({
            ...errors,
            url: "URL cannot be empty",
          });
        } else {
          setErrors({
            ...errors,
            url: "",
          });
        }
        break;
      case "username":
        if (value.length === 0) {
          setErrors({
            ...errors,
            username: "Username cannot be empty",
          });
        } else {
          setErrors({
            ...errors,
            username: "",
          });
        }
        break;
      case "password":
        if (value.length === 0) {
          setErrors({
            ...errors,
            password: "Password cannot be empty",
          });
        } else {
          setErrors({
            ...errors,
            password: "",
          });
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    let flag = true;
    setFormStatus(0);
    if (
      connectionParams.dbType &&
      connectionParams.url &&
      connectionParams.username &&
      connectionParams.password
    ) {
      for (let key in errors) {
        if (errors[key] !== "") {
          flag = false;
          break;
        }
      }
      props.onFormUpdate(flag);
    } else {
      props.onFormUpdate(false);
    }
  }, [connectionParams, errors, props]);

  const handleSubmit = (e) => {
    const connection_settings = {
      dbType: connectionParams.dbType,
      url: connectionParams.url,
      username: connectionParams.username,
      password: connectionParams.password,
    };
    if (props.formValidity) {
      testConnection(connection_settings)
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
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 5 }}>
      <FormControl fullWidth error={errors.dbType ? true : false}>
        <InputLabel id="dbType">Connection DB Type</InputLabel>
        <Select
          labelId="dbType"
          id="dbType"
          fullWidth
          value={connectionParams.dbType}
          label="Connection DB Type"
          onChange={(e) => {
            validateConnectionForm("dbType", e.target.value);
            props.onFieldChange("dbType", e.target.value);
          }}
        >
          <MenuItem value="" selected>
            --Select--
          </MenuItem>
          <MenuItem value="mysql">MySQL</MenuItem>
          <MenuItem value="aws_mysql">AWS MySQL</MenuItem>
        </Select>
      </FormControl>
      <TextField
        margin="normal"
        helperText={errors.url}
        error={errors.url ? true : false}
        required
        fullWidth
        id="url"
        value={connectionParams.url}
        label="Database Connection URL"
        name="url"
        onChange={(e) => {
          validateConnectionForm("url", e.target.value);
          props.onFieldChange("url", e.target.value);
        }}
      />
      <TextField
        margin="normal"
        helperText={errors.username}
        error={errors.username ? true : false}
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        value={connectionParams.username}
        onChange={(e) => {
          validateConnectionForm("username", e.target.value);
          props.onFieldChange("username", e.target.value);
        }}
      />
      <TextField
        margin="normal"
        helperText={errors.password}
        error={errors.password ? true : false}
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        value={connectionParams.password}
        onChange={(e) => {
          validateConnectionForm("password", e.target.value);
          props.onFieldChange("password", e.target.value);
        }}
      />
      <Button
        type="submit"
        disabled={props.formValidity ? false : true}
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, py: 1.5 }}
      >
        Test Connection
      </Button>
      <Grid container>
        <Grid item>
          <div
            className={`connection__form__error-msg${
              formStatus !== 2 ? " hide" : ""
            }`}
          >
            Error connecting to the data source. Please check the connection
            parameters
          </div>
          <div
            className={`connection__form__success-msg${
              formStatus !== 1 ? " hide" : ""
            }`}
          >
            Successfully connected to the data source
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}
