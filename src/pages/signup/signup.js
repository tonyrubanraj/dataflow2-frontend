import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createUser } from "../../services/userServices";

const theme = createTheme();

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidForm, setIsValidForm] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const validateSignupForm = (field, value) => {
    switch (field) {
      case "firstName":
        if (value.length === 0) {
          setErrors({
            ...errors,
            firstName: "First Name cannot be empty",
          });
        } else {
          setErrors({
            ...errors,
            firstName: "",
          });
        }
        break;
      case "lastName":
        if (value.length === 0) {
          setErrors({
            ...errors,
            lastName: "Last Name cannot be empty",
          });
        } else {
          setErrors({
            ...errors,
            lastName: "",
          });
        }
        break;
      case "email":
        if (
          !new RegExp(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ).test(value)
        ) {
          setErrors({
            ...errors,
            email: "Invalid email address",
          });
        } else {
          setErrors({
            ...errors,
            email: "",
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
    if (firstName && lastName && email && password) {
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
  }, [errors, email, firstName, lastName, password]);

  const handleSubmit = (e) => {
    const user = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };
    if (isValidForm) {
      createUser(user)
        .then((response) => {
          navigate("/");
        })
        .catch((error) => {
          if (error.response.status === 409) {
            setErrors({
              ...errors,
              email: "User already exists with the same email address",
            });
          }
        });
    }
    e.preventDefault();
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={8}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate={false}
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                helperText={errors.firstName}
                error={errors.firstName ? true : false}
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoFocus
                value={firstName}
                onChange={(e) => {
                  validateSignupForm("firstName", e.target.value);
                  setFirstName(e.target.value);
                }}
              />
              <TextField
                margin="normal"
                helperText={errors.lastName}
                error={errors.lastName ? true : false}
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                value={lastName}
                onChange={(e) => {
                  validateSignupForm("lastName", e.target.value);
                  setLastName(e.target.value);
                }}
              />
              <TextField
                margin="normal"
                helperText={errors.email}
                error={errors.email ? true : false}
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => {
                  validateSignupForm("email", e.target.value);
                  setEmail(e.target.value);
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
                value={password}
                onChange={(e) => {
                  validateSignupForm("password", e.target.value);
                  setPassword(e.target.value);
                }}
              />
              <Button
                type="submit"
                disabled={isValidForm ? false : true}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                Sign up
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/login" variant="body2">
                    {"Already have an account? Login"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
