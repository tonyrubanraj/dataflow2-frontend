import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../../components/formInput/formInput";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidForm, setIsValidForm] = useState(false);
  const [isValidCredential, setIsValidCredential] = useState(true);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
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
    setIsValidCredential(true);
    if (email && password) {
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
  }, [errors, email, password]);

  const handleSubmit = (e) => {
    const user = {
      email: email,
      password: password,
    };
    if (isValidForm) {
      fetch("http://localhost:8080/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }).then((response) => {
        if (response.status === 200) {
          setIsValidCredential(true);
          navigate("/");
        } else if (response.status === 404 || response.status === 401) {
          setIsValidCredential(false);
        }
      });
    }
    e.preventDefault();
  };

  return (
    <div className="login-page">
      <div className="login__form-container">
        <div className="login__form-header">
          <span className="text--primary">DataFlow</span> Member Login
        </div>
        <form className="login__form" onSubmit={handleSubmit}>
          <FormInput
            inputId="email"
            inputPlaceholder="Email"
            inputLabel="Email"
            inputType="text"
            inputName="email"
            inputValue={email}
            onInputChange={(e) => {
              validateLoginForm("email", e.target.value);
              setEmail(e.target.value);
            }}
            errorText={errors.email}
          />
          <FormInput
            inputId="password"
            inputPlaceholder="Password"
            inputLabel="Password"
            inputType="password"
            inputName="password"
            inputValue={password}
            onInputChange={(e) => {
              validateLoginForm("password", e.target.value);
              setPassword(e.target.value);
            }}
            errorText={errors.password}
          />
          <input
            className={`submit-btn${isValidForm ? "" : " btn-invalid"}`}
            type="submit"
            value="Login"
          />
          <div
            className={`login-form__error-msg${
              isValidCredential ? " hide" : ""
            }`}
          >
            Your email or password is incorrect. Please try again
          </div>
        </form>
        <div className="login__form-footer">
          Not have an existing account?{" "}
          <Link to="/signup">
            <span className="text--primary">Sign up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
