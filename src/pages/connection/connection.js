import { useEffect, useState } from "react";
import FormInput from "../../components/formInput/formInput";
import ConnectionContainer from "../../containers/connectionContainer/connectionContainer";
import "./connection.css";

function Connection() {
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
    <div className="connection-page">
      <div className="container-page__header__wrapper">
        <div className="container-page__header">
          <form className="connection-params__form" onSubmit={handleSubmit}>
            <div className="connection-params__form--left">
              <FormInput
                inputId="connectionName"
                inputPlaceholder="Connection Name"
                inputLabel="Connection Name"
                inputType="text"
                inputName="connectionName"
                inputValue={connectionName}
                onInputChange={(e) => {
                  setConnectionName(e.target.value);
                  if (e.target.value.length === 0)
                    setErrorText("Connection name cannot be empty");
                  else setErrorText("");
                }}
                errorText={errorText}
              />
            </div>
            <div className="connection-params__form--right">
              <input
                className={`submit-btn${
                  isConnectionValid ? "" : " btn-invalid"
                }`}
                type="submit"
                value="Create Connection"
              />
              <div
                className={`connection-params__form__success-msg${
                  !formStatus ? " hide" : ""
                }`}
              >
                Successfully created connection record
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="connection-container">
        <ConnectionContainer
          type="source"
          connectionParams={sourceConnection}
          onFieldChange={onSourceFieldChange}
          formValidity={isSourceFormValid}
          onFormUpdate={setIsSourceFormValid}
        ></ConnectionContainer>
        <div className="vertical-divider"></div>
        <ConnectionContainer
          type="destination"
          connectionParams={destinationConnection}
          onFieldChange={onDestinationFieldChange}
          formValidity={isDestinationFormValid}
          onFormUpdate={setIsDestinationFormValid}
        ></ConnectionContainer>
      </div>
    </div>
  );
}

export default Connection;
