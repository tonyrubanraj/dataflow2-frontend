import { TextField } from "@mui/material";
import "./formInput.css";

function FormInput(props) {
  return (
    <div
      id={props.inputId}
      className={`form-input${props.errorText === "" ? "" : " invalid-input"}`}
    >
      <TextField
        error={props.errorText ? true : false}
        id="outlined-error"
        label={props.inputLabel}
        type={props.inputType}
        name={props.inputName}
        value={props.inputValue}
        onChange={props.onInputChange}
      />
    </div>
  );
}
export default FormInput;
