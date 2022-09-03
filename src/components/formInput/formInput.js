import "./formInput.css";

function FormInput(props) {
  return (
    <div
      id={props.inputId}
      className={`form-input${props.errorText === "" ? "" : " invalid-input"}`}
    >
      <label>{props.inputLabel}</label>
      <input
        type={props.inputType}
        name={props.inputName}
        value={props.inputValue}
        onChange={props.onInputChange}
        placeholder={props.inputPlaceholder}
      />
      {props.errorText && <span className="error-msg">{props.errorText}</span>}
    </div>
  );
}
export default FormInput;
