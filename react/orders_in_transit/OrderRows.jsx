import React, { useState } from "react";
import PropTypes from "prop-types";
import Details from "./Details";
import * as dateService from "../../services/dateService";
import * as moneyService from "../../services/moneyService";
import { Badge } from "reactstrap";
import { withRouter } from "react-router-dom";

const OrderRows = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [durationColor, setDurationColor] = useState("success");
  const defaultAvatar =
    "https://www.pngitem.com/pimgs/m/421-4212341_default-avatar-svg-hd-png-download.png";

  const toggle = () => setIsOpen(!isOpen);

  const viewDetailsHandler = () => {
    props.history.push(
      `/orders/details/${props.order.id}`,
      formatOrder(props.order)
    );
  };

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
  const formatOrder = (prevOrder) => {
    const order = {
      ...prevOrder,
      dropOff: {
        Contact: {
          FirstName: prevOrder.dropOff.contact.firstName,
          LastName: prevOrder.dropOff.contact.lastName,
          Email: prevOrder.dropOff.contact.email,
          Phone: prevOrder.dropOff.contact.phone,
        },
        ShippingAddress: {
          LineOne: prevOrder.dropOff.shippingAddress.lineOne,
          LineTwo: prevOrder.dropOff.shippingAddress.lineTwo,
          State: prevOrder.dropOff.shippingAddress.State,
          City: prevOrder.dropOff.shippingAddress.city,
          Zip: prevOrder.dropOff.shippingAddress.zip,
        },
      },
      pickUp: {
        FirstName: prevOrder.pickup.firstName,
        LastName: prevOrder.pickup.lastName,
        Email: prevOrder.pickup.email,
        Phone: prevOrder.pickup.phone,
        LineOne: prevOrder.pickup.lineOne,
        LineTwo: prevOrder.pickup.lineTwo,
        State: prevOrder.pickup.State,
        City: prevOrder.pickup.city,
        Zip: prevOrder.pickup.zip,
      },
      messenger: {
        FirstName: prevOrder.messenger.firstName,
        LastName: prevOrder.messenger.lastName,
        Phone: prevOrder.messenger.phone,
        AvatarUrl: prevOrder.messenger.avatarUrl
      }
    };
    return order;
  };
  const setStatus = (statusId) => {
    switch (statusId) {
      case 1:
        return <span className="badge badge-warning">Open</span>;
      case 2:
        return <span className="badge badge-warning">Assigned</span>;
      case 3:
        return <span className="badge badge-info">In Transit</span>;
      case 4:
        return <span className="badge badge-info">Picked up</span>;
      case 5:
        return <span className="badge badge-purple">Delivered</span>;
      case 6:
        return <span className="badge badge-success">Completed</span>;
      case 7:
        return <span className="badge badge-danger">Cancelled</span>;
      case 8:
        return <span className="badge badge-inverse">Draft</span>;
      case 9:
        return <span className="badge badge-danger">Disputed</span>;
    }
  };

  return (
    <>
      <div className="order-rows mb-1">
        <div className="row tr" onClick={toggle}>
          <div className="col-2 col-lg-1  td">{props.order.id}</div>
          <div className="d-none col-3 d-lg-block col-lg-2 td">
            <img
              src={
                props.order.messenger
                  ? props.order.messenger.avatarUrl
                  : defaultAvatar
              }
              className="messenger-thumbnail"
            />
            <div>
              {props.order.messenger ? (
                <span>
                  {props.order.messenger.firstName}{" "}
                  {props.order.messenger.lastName}
                </span>
              ) : (
                  "Unassigned"
                )}
            </div>
          </div>
          <div className="col-5 col-lg-2  td">
            <div className="d-flex flex-column">
              <div>{setStatus(props.order.statusId)}</div>
              <div>{dateService.formatDateTime(props.order.dateModified)}</div>
            </div>
          </div>
          <div className="col-2 d-none d-lg-flex td">
            {formatAddress(props.order.pickup)}
          </div>
          <div className="col-2 d-none d-lg-flex td">
            {formatAddress(props.order.dropOff.shippingAddress)}
          </div>
          <div className="col-3 col-lg-2  td">
            <Badge color={props.order.timeElapse.color} className="duration">
              {props.order.timeElapse.time}
            </Badge>
          </div>
          <div className="d-none col-2 d-sm-flex col-lg-1 td money">
            {moneyService.formatMoney(props.order.total)}
          </div>
          <div className="col-2 d-sm-none td" onClick={viewDetailsHandler}>
            <i
              id="tb-dropdown"
              className="fa fa-ellipsis-h"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      {props.order && <Details isOpen={isOpen} order={props.order} />}
    </>
  );
};
OrderRows.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number,
    statusId: PropTypes.number,
    dateModified: PropTypes.string,
    timeElapse: PropTypes.shape({
      color: PropTypes.string,
      time: PropTypes.string,
    }),
    statusLog: PropTypes.arrayOf(PropTypes.shape({})),
    total: PropTypes.number,
    messengerFee: PropTypes.number,
    tip: PropTypes.number,
    trackingCode: PropTypes.string,
    trackingUrl: PropTypes.string,
    chargeId: PropTypes.string,
    messenger: PropTypes.shape({
      avatarUrl: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    pickup: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      lineOne: PropTypes.string,
      speedType: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
    }),
    dropOff: PropTypes.shape({
      contact: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
      }),
      shippingAddress: PropTypes.shape({}),
    }),
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};
export default withRouter(OrderRows);