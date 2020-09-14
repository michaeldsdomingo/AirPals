import React from "react";
import { Formik, Field, Form } from "formik";
import FormRow from "./FormRow";
import { locationSchema } from "../../schemas/locationSchema";
import PropTypes from "prop-types";

const LocationForm = (props) => {
  return (
    <Formik
      enableReinitialize={true}
      validationSchema={locationSchema}
      initialValues={props.initialValues}
      onSubmit={props.handleNext}
    >
      {(formikProps) => {
        const { touched, errors, handleBlur, values } = formikProps;
        const handlePrevious = (event) => {
          values.stateId = props.getIdByName("state", values.state);
          values.locationTypeId = props.getIdByName(
            "locationType",
            values.locationType
          );

          props.handleNextPrev(props.componentName, values, event);
        };
        return (
          <Form>
            <div className="row">
              <div className="col-md-12">
                <div className="card-default card">
                  <div className="card-header"></div>
                  <div className="card-body">
                    {props.locationList.length !== 0 && (
                      <FormRow label="Choose Location">
                        <Field
                          component="select"
                          name="id"
                          className="form-control"
                          onChange={props.handleLocationChange}
                        >
                          {props.locationOptions}
                          <option value="0">Add New Location</option>
                        </Field>
                      </FormRow>
                    )}
                    <FormRow label="Location Type *">
                      <Field
                        component="select"
                        name="locationType"
                        placeholder=""
                        className={
                          errors.locationType && touched.locationType
                            ? "form-control error"
                            : "form-control"
                        }
                      >
                        {props.locationTypeOptions}
                      </Field>
                      {errors.locationType && touched.locationType && (
                        <span className="error-feedback">
                          {errors.locationType}
                        </span>
                      )}
                    </FormRow>
                    <FormRow label="Address Line One *">
                      <Field
                        name="lineOne"
                        type="text"
                        onBlur={handleBlur}
                        placeholder="Enter Address Line One"
                        className={
                          errors.lineOne && touched.lineOne
                            ? "form-control error"
                            : "form-control"
                        }
                      />
                      {errors.lineOne && touched.lineOne && (
                        <span className="error-feedback">{errors.lineOne}</span>
                      )}
                    </FormRow>
                    <FormRow label="Address Line Two">
                      <Field
                        name="lineTwo"
                        type="text"
                        onBlur={handleBlur}
                        placeholder="Enter Address Line Two"
                        className={
                          errors.lineTwo && touched.lineTwo
                            ? "form-control error"
                            : "form-control"
                        }
                      />
                      {errors.lineTwo && touched.lineTwo && (
                        <span className="error-feedback">{errors.lineTwo}</span>
                      )}
                    </FormRow>
                    <FormRow label="City *">
                      <Field
                        name="city"
                        type="text"
                        onBlur={handleBlur}
                        placeholder="Enter City"
                        className={
                          errors.city && touched.city
                            ? "form-control error"
                            : "form-control"
                        }
                      />
                      {errors.city && touched.city && (
                        <span className="error-feedback">{errors.city}</span>
                      )}
                    </FormRow>
                    <FormRow label="State *">
                      <Field
                        component="select"
                        name="state"
                        className={
                          errors.state && touched.state
                            ? "form-control error"
                            : "form-control"
                        }
                      >
                        {props.stateOptions}
                      </Field>
                      {errors.state && touched.state && (
                        <span className="error-feedback">{errors.state}</span>
                      )}
                    </FormRow>
                    <FormRow label="Zip Code">
                      <Field
                        name="zip"
                        type="text"
                        onBlur={handleBlur}
                        value={values.zip || ""}
                        placeholder="Enter Zip Code"
                        className={
                          errors.zip && touched.zip
                            ? "form-control error"
                            : "form-control"
                        }
                      />
                      {errors.zip && touched.zip && (
                        <span className="error-feedback">{errors.zip}</span>
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
                    <button className="btn btn-info" name="next" type="submit">
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
};

LocationForm.propTypes = {
  initialValues: PropTypes.shape({}),
  handleNext: PropTypes.func,
  headerName: PropTypes.string.isRequired,
  handleLocationChange: PropTypes.func,
  locationList: PropTypes.arrayOf(PropTypes.shape({})),
  locationTypeOptions: PropTypes.arrayOf(PropTypes.element),
  locationOptions: PropTypes.arrayOf(PropTypes.element),
  stateOptions: PropTypes.arrayOf(PropTypes.element),
  handleNextPrev: PropTypes.func,
  componentName: PropTypes.string,
  getIdByName: PropTypes.func,
};

export default LocationForm;