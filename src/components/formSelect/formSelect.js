import "./formSelect.css";

function FormSelect(props) {
  return (
    <div
      id={props.selectId}
      className={`form-input${props.errorText === "" ? "" : " invalid-input"}`}
    >
      <label>{props.selectLabel}</label>
      <select value={props.selectValue} onChange={props.onSelectChange}>
        {props.children}
      </select>
      {props.errorText && <span className="error-msg">{props.errorText}</span>}
    </div>
  );
}

export default FormSelect;
