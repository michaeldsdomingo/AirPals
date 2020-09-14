import React from "react";
import PropTypes from "prop-types";

const FormRow = (props) => {
  return (
    <fieldset>
      <div className="form-group row align-items-center pl-sm-5">
        <label className="col-md-2 col-form-label">{props.label}</label>
        <div className="col-md-6">
          {props.children}
        </div>
        <div className="col-md-4" />
      </div>
    </fieldset>
  );
};

FormRow.propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node]),
    label: PropTypes.string
}

export default FormRow