import { useEffect, useState } from "react";
import FormInput from "../../components/formInput/formInput";
import FormSelect from "../../components/formSelect/formSelect";
import "./connectionContainer.css";

function ConnectionContainer(props) {
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
      fetch("http://localhost:8080/connection/test", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(connection_settings),
      }).then((response) => {
        if (response.status === 200) {
          setFormStatus(1);
        } else {
          setFormStatus(2);
        }
      });
    }
    e.preventDefault();
  };

  return (
    <div className="connection__form-container">
      <div className="connection__form-header">Enter {props.type} details</div>
      <form className="connection__form" onSubmit={handleSubmit}>
        <FormSelect
          selectId="dbType"
          selectLabel={`Choose the ${props.type} type`}
          selectValue={connectionParams.dbType}
          onSelectChange={(e) => {
            validateConnectionForm("dbType", e.target.value);
            props.onFieldChange("dbType", e.target.value);
          }}
          errorText={errors.dbType}
        >
          <option value="">--Select--</option>
          <option value="mysql">MySQL</option>
          <option value="aws_mysql">AWS MySQL</option>
        </FormSelect>
        <FormInput
          inputPlaceholder="Database connection URL"
          inputId="url"
          inputLabel="Connection URL"
          inputType="text"
          inputName="url"
          inputValue={connectionParams.url}
          onInputChange={(e) => {
            validateConnectionForm("url", e.target.value);
            props.onFieldChange("url", e.target.value);
          }}
          errorText={errors.url}
        />
        <FormInput
          inputId="username"
          inputPlaceholder="Database account username"
          inputLabel="Username"
          inputType="text"
          inputName="username"
          inputValue={connectionParams.username}
          onInputChange={(e) => {
            validateConnectionForm("username", e.target.value);
            props.onFieldChange("username", e.target.value);
          }}
          errorText={errors.username}
        />
        <FormInput
          inputId="password"
          inputPlaceholder="Password"
          inputLabel="Password"
          inputType="password"
          inputName="password"
          inputValue={connectionParams.password}
          onInputChange={(e) => {
            validateConnectionForm("password", e.target.value);
            props.onFieldChange("password", e.target.value);
          }}
          errorText={errors.password}
        />
        <input
          className={`submit-btn${props.formValidity ? "" : " btn-invalid"}`}
          type="submit"
          value="Test Connection"
        />
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
      </form>
    </div>
  );
}

export default ConnectionContainer;
