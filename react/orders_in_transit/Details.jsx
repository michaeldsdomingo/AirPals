import React from "react";
import { Collapse, CardBody, Card } from "reactstrap";
import PropTypes from "prop-types";
import StatusLog from "../order/StatusLog";
import Info from "./Info";
import * as moneyService from "../../services/moneyService";

const Details = (props) => {
  const defaultAvatar =
    "https://www.pngitem.com/pimgs/m/421-4212341_default-avatar-svg-hd-png-download.png";

  return (
    <Collapse isOpen={props.isOpen} className="mt-3 row">
      <div className="d-flex flex-grow-1 collapsible">
        <Card className="card-container mr-4 pl-5 pr-5" id="tracker-card">
          <CardBody className="">
            <div className="card-body-inner row">
              <div className="">
                <div className="">
                  {props.order.statusLog && (
                    <StatusLog statusLog={props.order.statusLog} size="small" />
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="card-container order-details-container d-none d-sm-flex">
          <CardBody className="order-details flex-container">

            <div className="detail-row-container">
              <div className="row no-gutters " id="messenger-info">
                <img
                  src={
                    props.order.messenger
                      ? props.order.messenger.avatarUrl
                      : defaultAvatar
                  }
                  className="messenger-avatar"
                />
                <div>
                  <h2 className="ml-3 mt-3">
                    {props.order.messenger
                      ? `${props.order.messenger.firstName} ${props.order.messenger.lastName}`
                      : "Unassigned"}{" "}
                  </h2>
                    {
                      props.order.messenger &&
                      <h3 className=" text-left ml-3">{props.order.messenger.phone}</h3> 
                    }
                  <h3 className="label-faded text-left ml-3">Messenger</h3>
                </div>
              </div>
              <div className="row no-gutters align-items-center ">
                <div className="pickup contact-container pink">
                  <div className="">
                    {props.order.pickup.firstName} {props.order.pickup.lastName}
                  </div>
                  <div className="">{props.order.pickup.email}</div>
                  <div className="">{props.order.pickup.phone}</div>
                </div>
                <em className="fa-5x fas fa-arrow-right ml-3 mr-3"></em>
                <div className="dropOff contact-container blue">
                  <div className="">
                    {props.order.dropOff.contact.firstName}{" "}
                    {props.order.dropOff.contact.lastName}
                  </div>
                  <div className="">{props.order.dropOff.contact.email}</div>
                  <div className="">{props.order.dropOff.contact.phone}</div>
                </div>
              </div>
              <div className="break" />
              <div className="order-content row no-gutters ">
                <Info
                  value={props.order.pickup.speedType}
                  label="Speed Type"
                  flexDirection="flex-column"
                  classContainer="pl-5 pr-5"
                />
                <div className="divider-container d-flex align-items-center">
                  <div className="divider"></div>
                </div>
                <Info
                  value={moneyService.formatMoney(props.order.total)}
                  label="Total"
                  classContainer="pl-5 pr-5"
                />
                <div className="divider-container d-flex align-items-center">
                  <div className="divider"></div>
                </div>
                <div className="details-break"></div>
                <Info
                  value={moneyService.formatMoney(props.order.messengerFee)}
                  label="Messenger Fee"
                  classContainer="pl-5 pr-5"
                />
                <div className="divider-container d-flex align-items-center">
                  <div className="divider"></div>
                </div>
                <Info
                  value={moneyService.formatMoney(props.order.tip)}
                  label="Tip"
                  classContainer="pl-5 pr-5"
                />

              </div>
            </div>
            <div className="details-side">
              <Info value={props.order.trackingCode} label="Tracking Code" classValue="font-size-small" classContainer="pl-1 pr-1" />
              <Info value={props.order.trackingUrl} label="Tracking URL" classContainer="pl-1 pr-1" classValue="font-size-small" />
              <Info value={props.order.chargeId} label="Charge ID" classContainer="pl-1 pr-1" classValue="font-size-small" />

            </div>
          </CardBody>
        </Card>
      </div>
    </Collapse>
  );
};

export default Details;

Details.propTypes = {
  isOpen: PropTypes.bool,
  order: PropTypes.shape({
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
      phone: PropTypes.string,
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
};