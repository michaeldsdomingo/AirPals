import React, { Component } from "react";
import PropTypes from "prop-types";
import { Formik, Field, Form } from "formik";
import FileUpload from "../files/FileUpload";
import FormRow from "./FormRow";
import { pickupOptionsSchema } from "../../schemas/pickupOptions";
import logger from "sabio-debug";
import * as lookupService from "../../services/lookupService";
import * as fileService from "../../services/fileServices";
import * as pickupService from "../../services/pickupService";
import * as _dateService from "../../services/dateService";
import { toast } from "react-toastify";

const _logger = logger.extend("PickupOptions");
_logger("from pickup options");

export default class PickupOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speedInfo: [],
    };
  }

  componentDidMount() {
    this.getAllDeliveryTypes();
  }

  propsToFormData(props) {
    const options = props.formData;

    const item = {
      pickupDateOnly:
        options.pickupDateOnly || _dateService.getCurrentDate(new Date()),
      startTime:
        options.startTime || _dateService.getCurrentMilitaryTime(new Date()),
      endTime:
        options.startTime || _dateService.getCurrentMilitaryTime(new Date()),
      speedType:
        options.speedType || "ASAP",
      packageImageFile: options.packageImageFile || [],
      instructions: options.instructions || "",
      id: options.id || 0,
    };

    return item;
  }

  handleNext = (formValues) => {
    const options = { ...formValues };

    this.setState(
      (prevState) => {
        return { ...prevState, submittedFormValues: options };
      },
      () => {
        if (options.packageImageFile.length === 1) {
          this.fileUpload(options.packageImageFile);
        } else {
          if (this.props.formData.id) {
            this.updatePickup(this.formatPayload(options));
          } else {
            this.addPickup(this.formatPayload(options));
          }
        }
      }
    );
  };

  getAllDeliveryTypes = () => {
    lookupService
      .getAllTypes("SpeedTypes")
      .then(this.onGetAllTypesSuccess)
      .catch(this.onGetAllTypesError);
  };

  fileUpload = (packageImageFile) => {
    const formData = new FormData();

    packageImageFile.forEach((file) => {
      formData.append("files", file);
    });

    fileService
      .upload(formData)
      .then(this.onFileUploadSuccess)
      .catch(this.onFileUploadError);
  };

  addPickup = (payload) => {
    pickupService
      .add(payload)
      .then(this.onAddPickupSuccess)
      .catch(this.onAddPickupError);
  };

  updatePickup = (payload) => {
    pickupService
      .update(payload)
      .then(this.onUpdatePickupSuccess)
      .catch(this.onUpdatePickupError);
  };

  onGetAllTypesSuccess = (response) => {
    const speedTypes = response.items;
    const typesJSX = speedTypes.map((speedType) => {
      return (
        <option value={speedType.name} key={speedType.id}>
          {speedType.name}
        </option>
      );
    });

    this.setState((prevState) => {
      return { ...prevState, speedType: typesJSX, speedInfo: speedTypes };
    });
  };

  onFileUploadSuccess = (response) => {
    const payload = this.formatPayload({
      ...this.state.submittedFormValues,
      packageImage: response.items[0].url,
    });
    if (this.props.formData.id) {
      this.updatePickup(payload);
    } else {
      this.addPickup(payload);
    }
  };

  onAddPickupSuccess = (response) => {
    const pickupData = { ...response.formData, id: response.item };
    this.props.handleNextPrev("pickupOptions", pickupData);
  };

  onUpdatePickupSuccess = (response) => {
    const pickupData = { ...response.formData };
    this.props.handleNextPrev("pickupOptions", pickupData);
  };

  onGetAllTypesError = (error) => toast.error(error);

  onFileUploadError = (error) => toast.error(error);

  onAddPickupError = (error) => toast.error(error);

  onUpdatePickupError = (error) => toast.error(error);

  formatPayload = (data) => {
    const pickupOptions = { ...data };

    pickupOptions.speedTypeId = this.state.speedInfo.find(
      (speed) => speed.name === pickupOptions.speedType
    ).id;

    if (!pickupOptions.packageImage) {
      pickupOptions.packageImage = "";
    }

    const pickupDate = `${pickupOptions.pickupDateOnly}T${pickupOptions.startTime}`;

    const pickupWindow = `${pickupOptions.pickupDateOnly}T${pickupOptions.endTime}`;

    const payload = {
      ...this.props.pickupData,
      ...pickupOptions,
      pickupDate,
      pickupWindow,
    };

    return payload;
  };

  render() {
    return (
      <React.Fragment>
        <Formik
          enableReinitialize={true}
          validationSchema={pickupOptionsSchema}
          initialValues={this.propsToFormData(this.props)}
          onSubmit={this.handleNext}
        >
          {(props) => {
            const { touched, errors, handleBlur, values } = props;
            const handlePrevious = (event) => {
              this.props.handleNextPrev("pickupOptions", values, event);
            };
            return (
              <Form>
                <div className="row">
                  <div className="col-md-12">
                    <div className="card-default card">
                      <div className="card-header"></div>
                      <div className="card-body">
                        <FormRow label="Pickup Date *">
                          <Field
                            name="pickupDateOnly"
                            type="date"
                            onBlur={handleBlur}
                            className={
                              errors.pickupDateOnly && touched.pickupDateOnly
                                ? "form-control error"
                                : "form-control"
                            }
                          />
                          {errors.pickupDateOnly && touched.pickupDateOnly && (
                            <span className="error-feedback">
                              {errors.pickupDateOnly}
                            </span>
                          )}
                        </FormRow>
                        <FormRow label="Time Window *">
                          <div className="row">
                            <div className="col-md-6">
                              <Field
                                name="startTime"
                                type="time"
                                onBlur={handleBlur}
                                className={
                                  errors.startTime && touched.startTime
                                    ? "form-control error"
                                    : "form-control"
                                }
                              />
                              {errors.startTime && touched.startTime && (
                                <span className="error-feedback">
                                  {errors.startTime}
                                </span>
                              )}
                            </div>
                            <div className="col-md-6">
                              <Field
                                name="endTime"
                                type="time"
                                onBlur={handleBlur}
                                className={
                                  errors.endTime && touched.endTime
                                    ? "form-control error"
                                    : "form-control"
                                }
                              />
                              {errors.endTime && touched.endTime && (
                                <span className="error-feedback">
                                  {errors.endTime}
                                </span>
                              )}
                            </div>
                          </div>
                        </FormRow>
                        <FormRow label="Delivery Speed *">
                          <Field
                            component="select"
                            name="speedType"
                            className={
                              errors.speedType && touched.speedType
                                ? "form-control error"
                                : "form-control"
                            }
                          >
                            {this.state.speedType}
                          </Field>
                          {errors.speedType && touched.speedType && (
                            <span className="error-feedback">
                              {errors.speedType}
                            </span>
                          )}
                        </FormRow>
                        <FormRow label="Package Image">
                          <Field
                            component={FileUpload}
                            name="packageImageFile"
                            onBlur={handleBlur}
                            accept="image/png, image/jpeg"
                            isPreviewDisplay={true}
                            imgWrapperClasses="col-md-4"
                            imgClasses="test"
                            className={
                              errors.packageImageFile &&
                              touched.packageImageFile
                                ? "form-control error"
                                : "form-control"
                            }
                          />
                          {errors.packageImageFile &&
                            touched.packageImageFile && (
                              <span className="error-feedback">
                                {errors.packageImageFile}
                              </span>
                            )}
                        </FormRow>
                        <FormRow label="Instructions">
                          <Field
                            name="instructions"
                            component="textarea"
                            onBlur={handleBlur}
                            placeholder="Enter Instructions"
                            className={
                              errors.instructions && touched.instructions
                                ? "form-control error"
                                : "form-control"
                            }
                          />
                          {errors.instructions && touched.instructions && (
                            <span className="error-feedback">
                              {errors.instructions}
                            </span>
                          )}
                        </FormRow>
                      </div>
                      <div className="text-center card-footer">
                        <button
                          name="previous"
                          className="btn btn-info mr-5"
                          onClick={handlePrevious}
                        >
                          Previous
                        </button>
                        <button
                          className="btn btn-info"
                          name="next"
                          type="submit"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </React.Fragment>
    );
  }
}

PickupOptions.propTypes = {
  handleNextPrev: PropTypes.func,
  formData: PropTypes.shape({
    id: PropTypes.number,
  }),
  pickupData: PropTypes.shape({
    pickupContact: PropTypes.shape({
      firstName: PropTypes.string,
      mi: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
    }),
    location: PropTypes.shape({
      locationType: PropTypes.string,
      lineOne: PropTypes.string,
      lineTwo: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      zip: PropTypes.string,
      locationId: PropTypes.number,
    }),
  }),
};