import * as React from "react";
import { TextField } from "@mui/material";
import { useState, useEffect } from "react";

function MySQLForm({ onFieldChange }) {
  const [mySQLConnection, setMySQLConnection] = useState({
    url: "",
    username: "",
    password: "",
  });
  const [mySQLErrors, setMySQLErrors] = useState({
    url: "",
    username: "",
    password: "",
  });
  const onMySQLConnectionChange = (field, value) => {
    setMySQLConnection({
      ...mySQLConnection,
      [field]: value,
    });
  };

  useEffect(() => {
    const { url, username, password } = mySQLConnection;
    let flag = false;
    if (url && username && password) {
      flag = true;
      for (let key in mySQLErrors) {
        if (mySQLErrors[key] !== "") {
          flag = false;
          break;
        }
      }
    }
    onFieldChange(mySQLConnection, flag);
  }, [mySQLConnection, onFieldChange, mySQLErrors]);

  const validateForm = (field, value) => {
    switch (field) {
      case "url":
        if (value.length === 0) {
          setMySQLErrors({
            ...mySQLErrors,
            url: "URL cannot be empty",
          });
        } else {
          setMySQLErrors({
            ...mySQLErrors,
            url: "",
          });
        }
        break;
      case "username":
        if (value.length === 0) {
          setMySQLErrors({
            ...mySQLErrors,
            username: "Username cannot be empty",
          });
        } else {
          setMySQLErrors({
            ...mySQLErrors,
            username: "",
          });
        }
        break;
      case "password":
        if (value.length === 0) {
          setMySQLErrors({
            ...mySQLErrors,
            password: "Password cannot be empty",
          });
        } else {
          setMySQLErrors({
            ...mySQLErrors,
            password: "",
          });
        }
        break;
      default:
        break;
    }
  };
  return (
    <React.Fragment>
      <TextField
        margin="normal"
        helperText={mySQLErrors.url}
        error={mySQLErrors.url ? true : false}
        required
        fullWidth
        id="url"
        value={mySQLConnection.url}
        label="Database Connection URL"
        name="url"
        onChange={(e) => {
          validateForm("url", e.target.value);
          onMySQLConnectionChange("url", e.target.value);
        }}
      />
      <TextField
        margin="normal"
        helperText={mySQLErrors.username}
        error={mySQLErrors.username ? true : false}
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        value={mySQLConnection.username}
        onChange={(e) => {
          validateForm("username", e.target.value);
          onMySQLConnectionChange("username", e.target.value);
        }}
      />
      <TextField
        margin="normal"
        helperText={mySQLErrors.password}
        error={mySQLErrors.password ? true : false}
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        value={mySQLConnection.password}
        onChange={(e) => {
          validateForm("password", e.target.value);
          onMySQLConnectionChange("password", e.target.value);
        }}
      />
    </React.Fragment>
  );
}

export default MySQLForm;
