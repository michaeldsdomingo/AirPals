  
import React from "react";
import PropTypes from "prop-types"

const Info = (props) => {
  const formatValue = (value) => {
    return value.length > 13 ? `${value.substring(0,10)}...` : value
  }

  return (
    <div className={`d-flex flex-column justify-content-center ${props.classContainer}`}>
      <h2 className={`order-value ${props.classValue}`}>{formatValue(props.value)}</h2>
      <h4 className="label-faded">{props.label}</h4>
    </div>
  );
};

export default Info
Info.propTypes = {
    value: PropTypes.string,
    label: PropTypes.string,
    classContainer: PropTypes.string,
    classValue: PropTypes.string,
}