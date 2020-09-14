import React, { Component } from "react";
import PropTypes from "prop-types";
import * as dateService from "../../services/dateService";
import * as moneyService from "../../services/moneyService";
import StripeCard from "../stripe/StripeCard";
import debug from "../file_upload/node_modules/sabio-debug";

const _logger = debug.extend("Summary");
_logger("test");

export default class Summary extends Component {
  
  render() {
    const {
      pickupContact,
      pickupLocation,
      pickupOptions,
      dropOffContact,
      dropOffLocation,
      dropOffOptions,
      shipmentData,
    } = this.props.formData;

    const handleNextPrevious = (event) => {
      this.props.handleNextPrev("summary", {}, event);
    };

    return (
      <div className="row">
        <div className="card-default card">
          <div className="card-body">
            <div className="row">
              <div className="col-xl-12">
                <p className="lead bb">Pickup Contact</p>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Full Name:</div>
                  <div className="col-md-8">
                    <strong>
                      {pickupContact.firstName} {pickupContact.mi}{" "}
                      {pickupContact.lastName}
                    </strong>
                  </div>
                </div>
                {pickupContact.phone && (
                  <div className="position-relative row form-group">
                    <div className="col-md-4">Phone Number: </div>
                    <div className="col-md-8">
                      <strong>{pickupContact.phone}</strong>
                    </div>
                  </div>
                )}
                {pickupContact.email && (
                  <div className="position-relative row form-group">
                    <div className="col-md-4">Email:</div>
                    <div className="col-md-8">
                      <strong>{pickupContact.email}</strong>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-xl-12">
                <p className="lead bb">Pickup Information</p>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Address:</div>
                  <div className="col-md-8">
                    <strong>
                      <div>{pickupLocation.locationType}</div>
                      <div>
                        {pickupLocation.lineOne} {pickupLocation.lineTwo}
                      </div>
                      <div>
                        {pickupLocation.city}, {pickupLocation.state}{" "}
                        {pickupLocation.zip}
                      </div>
                    </strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Pickup Date:</div>
                  <div className="col-md-8">
                    <strong>
                      {dateService.formatDate(pickupOptions.pickupDate)}
                    </strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Time Window:</div>
                  <div className="col-md-8">
                    <strong>
                      {dateService.convertToRegularTime(
                        pickupOptions.startTime
                      )}{" "}
                      -{" "}
                      {dateService.convertToRegularTime(pickupOptions.endTime)}
                    </strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Delivery Speed:</div>
                  <div className="col-md-8">
                    <strong>{pickupOptions.speedType}</strong>
                  </div>
                </div>
                {pickupOptions.packageImageFile.length === 1 && (
                  <div className="position-relative row form-group">
                    <div className="col-md-4">Package Image: </div>
                    <div className="col-md-8">
                      <div className="row">
                        <div className="col-md-3">
                          <img
                            src={URL.createObjectURL(
                              pickupOptions.packageImageFile[0]
                            )}
                            className="img-fluid mb-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {pickupOptions.instructions && (
                  <div className="position-relative row form-group">
                    <div className="col-md-4">Instructions:</div>
                    <div className="col-md-8">
                      <strong>{pickupOptions.instructions}</strong>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-xl-12">
                <p className="lead bb">Drop Off Contact</p>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Full Name:</div>
                  <div className="col-md-8">
                    <strong>
                      {dropOffContact.firstName} {dropOffContact.mi}{" "}
                      {dropOffContact.lastName}
                    </strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Phone Number: </div>
                  <div className="col-md-8">
                    <strong>{dropOffContact.phone}</strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Email:</div>
                  <div className="col-md-8">
                    <strong>{dropOffContact.email}</strong>
                  </div>
                </div>
              </div>
              <div className="col-xl-12">
                <p className="lead bb">Drop Off Information</p>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Address: </div>
                  <div className="col-md-8">
                    <strong>
                      <div>{dropOffLocation.locationType}</div>
                      <div>
                        {dropOffLocation.lineOne} {dropOffLocation.lineTwo}
                      </div>
                      <div>
                        {dropOffLocation.city}, {dropOffLocation.state}{" "}
                        {dropOffLocation.zip}
                      </div>
                    </strong>
                  </div>
                </div>
                {dropOffOptions.dropOffDate && (
                  <div className="position-relative row form-group">
                    <div className="col-md-4">Delivery Date:</div>
                    <div className="col-md-8">
                      <strong>
                        {dateService.formatDate(dropOffOptions.dropOffDate)}
                      </strong>
                    </div>
                  </div>
                )}
                {dropOffOptions.instructions && (
                  <div className="position-relative row form-group">
                    <div className="col-md-4">Instructions:</div>
                    <div className="col-md-8">
                      <strong>{dropOffOptions.instructions}</strong>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-xl-12">
                <p className="lead bb">Shipment Costs</p>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Costs: </div>
                  <div className="col-md-8">
                    <strong>
                      {moneyService.formatMoney(shipmentData.cost)}
                    </strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Messenger Fee:</div>
                  <div className="col-md-8">
                    <strong>
                      {moneyService.formatMoney(shipmentData.messengerFee)}
                    </strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Tip:</div>
                  <div className="col-md-8">
                    <strong>
                      {moneyService.formatMoney(shipmentData.tip)}
                    </strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Total:</div>
                  <div className="col-md-8">
                    <strong>
                      {moneyService.formatMoney(shipmentData.total)}
                    </strong>
                  </div>
                </div>
                <StripeCard shipmentData={this.props.formData.shipmentData}/>
              </div>
            </div>
          </div>
          <div className="text-center card-footer">
            <button
              name="previous"
              className="btn btn-info mr-5"
              onClick={handleNextPrevious}
            >
              Previous
            </button>
            
          </div>
        </div>
      </div>
    );
  }
}

Summary.propTypes = {
  handleNextPrev: PropTypes.func,
  formData: PropTypes.shape({
    pickupContact: PropTypes.shape({
      firstName: PropTypes.string,
      mi: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
    }),
    pickupLocation: PropTypes.shape({
      locationType: PropTypes.string,
      lineOne: PropTypes.string,
      lineTwo: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      zip: PropTypes.string,
    }),
    pickupOptions: PropTypes.shape({
      pickupDate: PropTypes.string,
      startTime: PropTypes.string,
      endTime: PropTypes.string,
      pickupEndTime: PropTypes.string,
      speedType: PropTypes.string,
      packageImageFile: PropTypes.arrayOf(PropTypes.shape({})),
      instructions: PropTypes.string,
    }),
    dropOffContact: PropTypes.shape({
      firstName: PropTypes.string,
      mi: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
    }),
    dropOffLocation: PropTypes.shape({
      locationType: PropTypes.string,
      lineOne: PropTypes.string,
      lineTwo: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      zip: PropTypes.string,
    }),
    dropOffOptions: PropTypes.shape({
      dropOffDate: PropTypes.string,
      instructions: PropTypes.string,
    }),
    shipmentData: PropTypes.shape({
      total: PropTypes.number,
      messengerFee: PropTypes.number,
      tip: PropTypes.number,
      cost: PropTypes.number,
      pickupId: PropTypes.number.isRequired,
      dropOffId: PropTypes.number.isRequired,
    }),
  }),
};