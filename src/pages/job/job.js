import { useEffect, useState } from "react";
import axios from "axios";
import FormSelect from "../../components/formSelect/formSelect";
import "./job.css";
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Job() {
  const [connectionId, setConnectionId] = useState(-1);
  const [sourceSchema, setSourceSchema] = useState("");
  const [destinationSchema, setDestinationSchema] = useState("");
  const [connections, setConnections] = useState([]);
  const [sourceSchemas, setSourceSchemas] = useState([]);
  const [destinationSchemas, setDestinationSchemas] = useState([]);
  const [sourceTablesList, setSourceTablesList] = useState([]);
  const [destinationTablesList, setDestinationTablesList] = useState([]);
  const [sourceTables, setSourceTables] = useState([
    {
      id: 0,
      value: "",
    },
  ]);
  const [destinationTables, setDestinationTables] = useState([
    {
      id: 0,
      value: "",
    },
  ]);
  const [jobType, setJobType] = useState("");
  const [isValidForm, setIsValidForm] = useState(false);
  const [formStatus, setFormStatus] = useState(0);

  const [errors, setErrors] = useState({
    connectionId: "",
    sourceSchema: "",
    destinationSchema: "",
    sourceTables: "",
    destinationTables: "",
    jobType: "",
  });

  const addTableField = () => {
    setSourceTables([
      ...sourceTables,
      {
        id: sourceTables.length,
        value: "",
      },
    ]);
    setDestinationTables([
      ...destinationTables,
      {
        id: destinationTables.length,
        value: "",
      },
    ]);
  };

  const removeTableField = () => {
    let sourceTableCount = sourceTables.length - 1;
    setSourceTables(
      sourceTables.filter((table) => table.id !== sourceTableCount)
    );
    let destinationTableCount = destinationTables.length - 1;
    setDestinationTables(
      destinationTables.filter((table) => table.id !== destinationTableCount)
    );
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/connection/list", {
        withCredentials: true,
      })
      .then((res) => setConnections(res.data));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/connection/source/schemas", {
        withCredentials: true,
        params: {
          connectionId: connectionId,
        },
      })
      .then((response) => {
        setSourceSchemas(response.data);
      });
    axios
      .get("http://localhost:8080/connection/destination/schemas", {
        withCredentials: true,
        params: {
          connectionId: connectionId,
        },
      })
      .then((response) => {
        setDestinationSchemas(response.data);
      });
  }, [connectionId]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/connection/source/tables", {
        withCredentials: true,
        params: {
          connectionId: connectionId,
          schema: sourceSchema,
        },
      })
      .then((response) => {
        setSourceTablesList(response.data);
      });
    axios
      .get("http://localhost:8080/connection/destination/tables", {
        withCredentials: true,
        params: {
          connectionId: connectionId,
          schema: destinationSchema,
        },
      })
      .then((response) => {
        setDestinationTablesList(response.data);
      });
  }, [connectionId, sourceSchema, destinationSchema]);

  const validateJobForm = (field, value) => {
    switch (field) {
      case "connectionId": {
        if (parseInt(value) === -1) {
          setErrors({
            ...errors,
            connectionId: "Connection name cannot be empty",
            sourceSchema: "",
            destinationSchema: "",
            sourceTables: "",
            destinationTables: "",
          });
        } else {
          setErrors({
            ...errors,
            connectionId: "",
            sourceSchema: "",
            destinationSchema: "",
            sourceTables: "",
            destinationTables: "",
          });
        }
        break;
      }
      case "sourceSchema": {
        if (value.length === 0) {
          setErrors({
            ...errors,
            sourceSchema: "Source schema cannot be empty",
            sourceTables: "",
          });
        } else {
          setErrors({
            ...errors,
            sourceSchema: "",
            sourceTables: "",
          });
        }
        break;
      }
      case "destinationSchema": {
        if (value.length === 0) {
          setErrors({
            ...errors,
            destinationSchema: "Destination schema cannot be empty",
            destinationTables: "",
          });
        } else {
          setErrors({
            ...errors,
            destinationSchema: "",
            destinationTables: "",
          });
        }
        break;
      }
      case "sourceTables": {
        if (value.length === 0) {
          setErrors({
            ...errors,
            sourceTables: "Source table cannot be empty",
          });
        } else {
          setErrors({
            ...errors,
            sourceTables: "",
          });
        }
        break;
      }
      case "destinationTables": {
        if (value.length === 0) {
          setErrors({
            ...errors,
            destinationTables: "Destination table cannot be empty",
          });
        } else {
          setErrors({
            ...errors,
            destinationTables: "",
          });
        }
        break;
      }
      case "jobType": {
        if (value.length === 0) {
          setErrors({
            ...errors,
            jobType: "Job type cannot be empty",
          });
        } else {
          setErrors({
            ...errors,
            jobType: "",
          });
        }
        break;
      }
      default:
        break;
    }
  };

  const isValidTable = (tables) => {
    for (const table of tables) {
      if (table.value === "") {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    setFormStatus(0);
    let flag = true;
    if (
      parseInt(connectionId) !== -1 &&
      sourceSchema &&
      destinationSchema &&
      isValidTable(sourceTables) &&
      isValidTable(destinationTables) &&
      jobType
    ) {
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
  }, [
    errors,
    connectionId,
    destinationSchema,
    destinationTables,
    jobType,
    sourceSchema,
    sourceTables,
  ]);

  const handleSubmit = (e) => {
    const job_settings = {
      connectionId: connectionId,
      sourceSchema: sourceSchema,
      destinationSchema: destinationSchema,
      sourceTables: sourceTables.map((table) => table.value),
      destinationTables: destinationTables.map((table) => table.value),
      jobType: jobType,
    };
    if (isValidForm) {
      fetch("http://localhost:8080/job/migrate", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(job_settings),
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
    <div className="job-page">
      <div className="job__form-container">
        <div className="job__form-header">Data Transfer Job Settings</div>
        <form className="job__form" onSubmit={handleSubmit}>
          <FormSelect
            selectId="connectionId"
            selectLabel="Choose the Connection setting"
            selectValue={connectionId}
            onSelectChange={(e) => {
              validateJobForm("connectionId", e.target.value);
              setSourceSchema("");
              setDestinationSchema("");
              setConnectionId(e.target.value);
            }}
            errorText={errors.connectionId}
          >
            <option value="-1">--Select--</option>
            {connections.map(({ name, id }) => {
              return (
                <option key={id} value={id}>
                  {name}
                </option>
              );
            })}
          </FormSelect>
          <div className="job__form-columns">
            <div className="job__form--source-fields">
              <FormSelect
                selectId="sourceSchema"
                selectLabel="Choose the Source schema"
                selectValue={sourceSchema}
                onSelectChange={(e) => {
                  validateJobForm("sourceSchema", e.target.value);
                  setSourceSchema(e.target.value);
                }}
                errorText={errors.sourceSchema}
              >
                <option value="">--Select--</option>
                {sourceSchemas.map((schema) => {
                  return (
                    <option key={schema} value={schema}>
                      {schema}
                    </option>
                  );
                })}
              </FormSelect>
            </div>
            <div className="job__form--destination-fields">
              <FormSelect
                selectId="destinationSchema"
                selectLabel="Choose the Destination schema"
                selectValue={destinationSchema}
                onSelectChange={(e) => {
                  validateJobForm("destinationSchema", e.target.value);
                  setDestinationSchema(e.target.value);
                }}
                errorText={errors.destinationSchema}
              >
                <option value="">--Select--</option>
                {destinationSchemas.map((schema) => {
                  return (
                    <option key={schema} value={schema}>
                      {schema}
                    </option>
                  );
                })}
              </FormSelect>
            </div>
          </div>

          <div className="job__form-columns">
            <div className="job__form--source-fields">
              Source tables
              {sourceTables.map((input) => (
                <FormSelect
                  key={input.id}
                  selectClassName="job__form--source-tables"
                  selectId={`sourceTable-${input.id}`}
                  selectValue={input.value}
                  onSelectChange={(e) => {
                    validateJobForm("sourceTables", e.target.value);
                    setSourceTables(
                      sourceTables.map((table) => {
                        if (table.id === input.id) {
                          table.value = e.target.value;
                        }
                        return table;
                      })
                    );
                  }}
                >
                  <option value="">--Select--</option>
                  {sourceTablesList.map((table) => {
                    return (
                      <option key={table} value={table}>
                        {table}
                      </option>
                    );
                  })}
                </FormSelect>
              ))}
              <div
                className={`source-table--error-msg${
                  errors.sourceTables === "" ? " hide" : ""
                }`}
              >
                {errors.sourceTables}
              </div>
            </div>
            <div className="job__form--destination-fields">
              Destination tables
              {destinationTables.map((input) => (
                <FormSelect
                  key={input.id}
                  selectClassName="job__form--destination-tables"
                  selectId={`destinationTable-${input.id}`}
                  selectValue={input.value}
                  onSelectChange={(e) => {
                    validateJobForm("destinationTables", e.target.value);
                    setDestinationTables(
                      destinationTables.map((table) => {
                        if (table.id === input.id) {
                          table.value = e.target.value;
                        }
                        return table;
                      })
                    );
                  }}
                >
                  <option value="">--Select--</option>
                  {destinationTablesList.map((table) => {
                    return (
                      <option key={table} value={table}>
                        {table}
                      </option>
                    );
                  })}
                </FormSelect>
              ))}
              <div
                className={`destination-table--error-msg${
                  errors.destinationTables === "" ? " hide" : ""
                }`}
              >
                {errors.destinationTables}
              </div>
            </div>
          </div>
          <div className="job__form__table-btns">
            <FontAwesomeIcon onClick={addTableField} icon={faPlusCircle} />
            <FontAwesomeIcon
              className={`${sourceTables.length > 1 ? "" : " hide"}`}
              onClick={removeTableField}
              icon={faMinusCircle}
            />
          </div>
          <FormSelect
            selectId="jobType"
            selectLabel="Choose the Job type"
            selectValue={jobType}
            onSelectChange={(e) => {
              validateJobForm("jobType", e.target.value);
              setJobType(e.target.value);
            }}
            errorText={errors.jobType}
          >
            <option value="">--Select--</option>
            <option value="bulk">Bulk</option>
            <option value="cdc">CDC</option>
          </FormSelect>
          <input
            className={`submit-btn${isValidForm ? "" : " btn-invalid"}`}
            type="submit"
            value="Execute Job"
          />
          <div
            className={`job__form__error-msg${formStatus !== 2 ? " hide" : ""}`}
          >
            Error in initiating the data migration job. Please check your
            settings again.
          </div>
          <div
            className={`job__form__success-msg${
              formStatus !== 1 ? " hide" : ""
            }`}
          >
            Successfully initiated data migration job.
          </div>
        </form>
      </div>
    </div>
  );
}

export default Job;
