import React, { Component } from "react";
import PropTypes from "prop-types";
import { Formik, Field, Form } from "formik";
import { dropOffOptionsSchema } from "../../schemas/dropOffOptionsSchema";
import FormRow from "./FormRow";
import * as dropOffService from "../../services/dropOffService";
import * as _dateService from "../../services/dateService";
import debug from "sabio-debug";
import { toast } from "react-toastify";

const _logger = debug.extend("DropOffOptions");
_logger('from dropoff options')

export default class DropOffOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  propsToFormData(props) {
    const options = props.formData;
    const item = {
      dropOffDate:
        options.dropOffDate || _dateService.formatISOTime(new Date()),
      instructions: options.instructions || "",
      id: options.id || 0,
    };

    return item;
  }

  handleNext = (formValues) => {
    const payload = {
      ...formValues,
      contactId: this.props.dropOffData.contactId,
      locationId: this.props.dropOffData.locationId,
    };

    if (this.props.formData.id) {
      payload.id = this.props.formData.id;
      this.updateDropOff(payload);
    } else {
      this.addDropOff(payload);
    }
  };

  addDropOff = (payload) => {
    dropOffService
      .add(payload)
      .then(this.onAddDropOffSuccess)
      .catch(this.onAddDropOffError);
  };

  updateDropOff = (payload) => {
    dropOffService
      .update(payload)
      .then(this.onUpdateDropOffSuccess)
      .catch(this.onUpdateDropOffError);
  };

  onAddDropOffSuccess = (response) => {
    const dropOffData = { ...response.formData, id: response.item };
    this.props.handleNextPrev("dropOffOptions", dropOffData);
  };

  onUpdateDropOffSuccess = (response) => {
    const dropOffData = { ...response.formData };
    this.props.handleNextPrev("dropOffOptions", dropOffData);
  };

  onAddDropOffError = (error) => toast.error(error);

  onUpdateDropOffError = (error) => toast.error(error);

  render() {
    const { handleNextPrev } = this.props;

    return (
      <Formik
        enableReinitialize={true}
        validationSchema={dropOffOptionsSchema}
        initialValues={this.propsToFormData(this.props)}
        onSubmit={this.handleNext}
      >
        {(props) => {
          const { touched, errors, handleBlur, values } = props;
          const handlePrevious = (event) => {
            handleNextPrev("dropOffOptions", values, event);
          };
          return (
            <Form>
              <div className="row">
                <div className="col-md-12">
                  <div className="card-default card">
                    <div className="card-header"></div>
                    <div className="card-body">
                      <FormRow label="Drop Off Date">
                        <Field
                          name="dropOffDate"
                          type="datetime-local"
                          onBlur={handleBlur}
                          value={values.dropOffDate || ""}
                          className={
                            errors.dropOffDate && touched.dropOffDate
                              ? "form-control error"
                              : "form-control"
                          }
                        />
                        {errors.dropOffDate && touched.dropOffDate && (
                          <span className="error-feedback">
                            {errors.dropOffDate}
                          </span>
                        )}
                      </FormRow>
                      <FormRow label="Instructions">
                        <Field
                          name="instructions"
                          component="textarea"
                          onBlur={handleBlur}
                          placeholder="Enter Instructions"
                          values={values.instructions || ""}
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
    );
  }
}

DropOffOptions.propTypes = {
  handleNextPrev: PropTypes.func,
  formData: PropTypes.shape({
    id: PropTypes.number,
  }),
  dropOffData: PropTypes.shape({
    contactId: PropTypes.number,
    locationId: PropTypes.number,
  }),
};