import React from "react";
import PropTypes from "prop-types";
import { formatMoney } from "../../../services/moneyService";

const EarningsRow = (props) => {
  const formatAddress = (address) => {
    return (
      <>
        <div>{address.lineOne}</div>
        <div>
          {address.city}, {address.state}
          {address.zip}
        </div>
      </>
    );
  };
  return (
    <div className="row tr">
      <div className="col-4 col-sm-2 td center-text">{props.order.id}</div>
      <div className="col-3 d-none d-sm-block td text-center">
        {formatAddress(props.order.pickupLocation)}
      </div>
      <div className="col-3 d-none d-sm-block td text-center">
        {formatAddress(props.order.dropOffLocation)}
      </div>
      <div className="col-4 col-sm-2 td center-text">
        {formatMoney(props.order.messengerFee)}
      </div>
      <div className="col-4 col-sm-2 td center-text">
        {formatMoney(props.order.tip)}
      </div>
    </div>
  );
};
export default EarningsRow;
EarningsRow.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number,
    pickupLocation: PropTypes.shape({}),
    dropOffLocation: PropTypes.shape({}),
    messengerFee: PropTypes.number,
    tip: PropTypes.number,
  }),
};