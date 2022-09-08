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
import ConnectionContainer from "../../containers/connectionContainer/connectionContainer";
import "./connection.css";

const theme = createTheme();

export default function Connection() {
  const [connectionName, setConnectionName] = useState("");
  const [isConnectionValid, setIsConnectionValid] = useState(false);
  const [formStatus, setFormStatus] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [sourceConnection, setSourceConnection] = useState({
    dbType: "",
    url: "",
    username: "",
    password: "",
  });
  const [destinationConnection, setDestinationConnection] = useState({
    dbType: "",
    url: "",
    username: "",
    password: "",
  });
  const [isSourceFormValid, setIsSourceFormValid] = useState(false);
  const [isDestinationFormValid, setIsDestinationFormValid] = useState(false);
  const onSourceFieldChange = (field, value) => {
    setSourceConnection({
      ...sourceConnection,
      [field]: value,
    });
  };
  const onDestinationFieldChange = (field, value) => {
    setDestinationConnection({
      ...destinationConnection,
      [field]: value,
    });
  };

  useEffect(() => {
    setFormStatus(false);
    if (connectionName && isSourceFormValid && isDestinationFormValid) {
      setIsConnectionValid(true);
    } else {
      setIsConnectionValid(false);
    }
  }, [connectionName, isSourceFormValid, isDestinationFormValid]);

  const handleSubmit = (e) => {
    const connection_params = {
      connectionName: connectionName,
      sourceConnection: sourceConnection,
      destinationConnection: destinationConnection,
    };
    if (isConnectionValid) {
      fetch("http://localhost:8080/connection/save", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(connection_params),
      }).then((response) => {
        if (response.status === 200) {
          setFormStatus(true);
        } else if (response.status === 409) {
          setErrorText("Connection name already exists");
        }
      });
    }
    e.preventDefault();
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid item xs={12} sm={12} md={12} alignItems="left">
          <Grid item xs={12} sm={6} md={6}>
            <Box
              sx={{
                my: 8,
                ml: 21,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <TextField
                margin="none"
                helperText={errorText}
                error={errorText ? true : false}
                required
                fullWidth
                size="small"
                name="connectionName"
                label="Connection Name"
                id="connectionName"
                onChange={(e) => {
                  setConnectionName(e.target.value);
                  if (e.target.value.length === 0)
                    setErrorText("Connection name cannot be empty");
                  else setErrorText("");
                }}
              />
              <Grid container>
                <Grid item sx={{ mt: 0.25, mb: 2, ml: 3 }}>
                  <Button
                    onClick={handleSubmit}
                    disabled={isConnectionValid ? false : true}
                    fullWidth
                    variant="contained"
                  >
                    Create Connection
                  </Button>
                </Grid>
                <Grid item sx={{ mt: 0.25, mb: 2, ml: 3 }}>
                  <div
                    className={`connection-params__form__success-msg${
                      !formStatus ? " hide" : ""
                    }`}
                  >
                    Successfully created connection record
                  </div>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
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
          <Grid item xs={12} sm={4} md={4} component={Paper}>
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
                Source connection
              </Typography>
              <ConnectionContainer
                type="source"
                connectionParams={sourceConnection}
                onFieldChange={onSourceFieldChange}
                formValidity={isSourceFormValid}
                onFormUpdate={setIsSourceFormValid}
              ></ConnectionContainer>
            </Box>
          </Grid>
          {/* <Divider orientation="vertical" flexItem></Divider> */}
          <Grid item xs={12} sm={4} md={4} component={Paper}>
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
                Destination connection
              </Typography>
              <ConnectionContainer
                type="destination"
                connectionParams={destinationConnection}
                onFieldChange={onDestinationFieldChange}
                formValidity={isDestinationFormValid}
                onFormUpdate={setIsDestinationFormValid}
              ></ConnectionContainer>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
