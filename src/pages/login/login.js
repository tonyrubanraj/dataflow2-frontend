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
import { authenticateUser } from "../../services/userServices";
import "./login.css";

const theme = createTheme();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidForm, setIsValidForm] = useState(false);
  const [isValidCredential, setIsValidCredential] = useState(true);
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const navigate = useNavigate();

  const validateLoginForm = (field, value) => {
    switch (field) {
      case "email":
        if (
          !new RegExp(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ).test(value)
        ) {
          setErrors({
            ...errors,
            email: true,
          });
        } else {
          setErrors({
            ...errors,
            email: false,
          });
        }
        break;
      case "password":
        if (value.length === 0) {
          setErrors({
            ...errors,
            password: true,
          });
        } else {
          setErrors({
            ...errors,
            password: false,
          });
        }
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    let flag = true;
    setIsValidCredential(true);
    if (email && password) {
      for (let key in errors) {
        if (errors[key]) {
          flag = false;
          break;
        }
      }
      setIsValidForm(flag);
    } else {
      setIsValidForm(false);
    }
  }, [errors, email, password]);

  const handleSubmit = (event) => {
    const user = {
      email: email,
      password: password,
    };
    if (isValidForm) {
      authenticateUser(user)
        .then(() => {
          setIsValidCredential(true);
          navigate("/");
        })
        .catch(() => {
          setIsValidCredential(false);
        });
    }
    event.preventDefault();
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
              Login
            </Typography>
            <Box
              component="form"
              noValidate={false}
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                error={errors.email ? true : false}
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                autoFocus
                onChange={(e) => {
                  validateLoginForm("email", e.target.value);
                  setEmail(e.target.value);
                }}
              />
              <TextField
                margin="normal"
                error={errors.password ? true : false}
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  validateLoginForm("password", e.target.value);
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
                Login
              </Button>
              <Grid container>
                <Grid item sx={{ mb: 2 }}>
                  <div
                    className={`login-form__error-msg${
                      isValidCredential ? " hide" : ""
                    }`}
                  >
                    Your email or password is incorrect. Please try again
                  </div>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
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
