import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/formInput/formInput";
import "./signup.css";

function Signup() {
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
      fetch("http://localhost:8080/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }).then((response) => {
        if (response.status === 201) {
          navigate("/");
        } else if (response.status === 409) {
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
    <div className="signup-page">
      <div className="signup__form-container">
        <div className="signup__form-header">
          Sign up to create a <span className="text--primary">DataFlow</span>{" "}
          account
        </div>
        <form className="signup__form" onSubmit={handleSubmit}>
          <div className="signup__form-top">
            <FormInput
              inputPlaceholder="First Name"
              inputId="firstName"
              inputLabel="First Name"
              inputType="text"
              inputName="firstName"
              inputValue={firstName}
              onInputChange={(e) => {
                validateSignupForm("firstName", e.target.value);
                setFirstName(e.target.value);
              }}
              errorText={errors.firstName}
            />
            <FormInput
              inputId="lastName"
              inputPlaceholder="Last Name"
              inputLabel="Last Name"
              inputType="text"
              inputName="lastName"
              inputValue={lastName}
              onInputChange={(e) => {
                validateSignupForm("lastName", e.target.value);
                setLastName(e.target.value);
              }}
              errorText={errors.lastName}
            />
          </div>
          <FormInput
            inputId="email"
            inputPlaceholder="Email"
            inputLabel="Email"
            inputType="text"
            inputName="email"
            inputValue={email}
            onInputChange={(e) => {
              validateSignupForm("email", e.target.value);
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
              validateSignupForm("password", e.target.value);
              setPassword(e.target.value);
            }}
            errorText={errors.password}
          />
          <input
            className={`submit-btn${isValidForm ? "" : " btn-invalid"}`}
            type="submit"
            value="Create Account"
          />
        </form>
        <div className="signup__form-footer">
          Already have an existing account?{" "}
          <Link to="/login">
            <span className="text--primary">Log In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
