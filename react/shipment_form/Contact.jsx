import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field, Formik, Form } from "formik";
import { contactSchema } from "../../schemas/contactSchema";
import logger from "sabio-debug";
import FormRow from "./FormRow";
import * as contactService from "../../services/contactService";
import { toast } from "react-toastify";

const _logger = logger.extend("Contact");

_logger("from pickup contact");
export default class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactOptions: [],
    };
  }

  componentDidMount() {
    const contactOptions = this.props.contactList && this.props.contactList.map((contact) => {
      return (
        <option value={contact.id} key={contact.id}>
          {contact.firstName} {contact.lastName}
        </option>
      );
    });

    this.setState((prevState) => {
      return { ...prevState, contactOptions };
    });
  }

  propsToFormData(props) {
    const contact = props.formData;
    const item = {
      firstName: contact.firstName || "",
      mi: contact.mi || "",
      lastName: contact.lastName || "",
      email: contact.email || "",
      phone: contact.phone || "",
      id: contact.id || 0,
    };

    return item;
  }

  handleNext = (formValues) => {
    const payload = { ...formValues, isActive: true };

    if (this.props.componentName === "dropOffContact") {
      if (this.props.formData.id) {
        payload.id = this.props.formData.id;
        this.updateContact(payload);
      } else {
        delete payload.id;
        payload.customerId = this.props.customerId;
        this.addContact(payload);
      }
    } else {
      this.props.handleNextPrev(this.props.componentName, formValues);
    }
  };

  handleContactChange = (event) => {
    if (event.target.value === "0") {
      this.props.setContact({});
    } else {
      const contactSelected = this.props.contactList.find(
        (contact) => parseInt(contact.id) === parseInt(event.target.value)
      );

      this.props.setContact(contactSelected);
    }
  };

  addContact = (payload) => {
    contactService
      .add(payload)
      .then(this.onAddContactSuccess)
      .catch(this.onAddContactError);
  };

  updateContact = (payload) => {
    contactService
      .update(payload)
      .then(this.onUpdateContactSuccess)
      .catch(this.onUpdateContactError);
  };

  onAddContactSuccess = (response) => {
    const dropOffContactData = { ...response.formData, id: response.item };
    this.props.handleNextPrev(this.props.componentName, dropOffContactData);
    this.props.appendContactList(dropOffContactData);
  };

  onUpdateContactSuccess = (response) => {
    const dropOffContactData = { ...response.formData };
    this.props.handleNextPrev(this.props.componentName, dropOffContactData);

    this.props.updateContactList(dropOffContactData);
  };

  onAddContactError = (error) => toast.error(error.message);

  onUpdateContactError = (error) => toast.error(error.message);

  render() {
    return (
      <Formik
        enableReinitialize={true}
        validationSchema={contactSchema}
        initialValues={this.propsToFormData(this.props)}
        onSubmit={this.handleNext}
      >
        {(props) => {
          const { touched, errors, handleBlur, values } = props;
          const handlePrevious = (event) => {
            this.props.handleNextPrev(this.props.componentName, values, event);
          };
          return (
            <Form>
              <div className="row">
                <div className="col-md-12">
                  <div className="card-default card">
                    <div className="card-header"></div>
                    <div className="card-body">
                      {this.props.contactList &&
                        this.props.contactList.length !== 0 && (
                          <FormRow label="Choose Contact">
                            <Field
                              name="id"
                              component="select"
                              className="form-control"
                              onChange={this.handleContactChange}
                            >
                              {this.state.contactOptions}
                              <option value="0">Add New Contact</option>
                            </Field>
                          </FormRow>
                        )}
                      <FormRow label="First Name *">
                        <Field
                          name="firstName"
                          type="text"
                          onBlur={handleBlur}
                          placeholder="Enter First Name"
                          className={
                            errors.firstName && touched.firstName
                              ? "form-control error"
                              : "form-control"
                          }
                        />
                        {errors.firstName && touched.firstName && (
                          <span className="error-feedback">
                            {errors.firstName}
                          </span>
                        )}
                      </FormRow>
                      <FormRow label="Middle Initial">
                        <Field
                          name="mi"
                          type="text"
                          onBlur={handleBlur}
                          placeholder="Enter Middle Initial"
                          className={
                            errors.mi && touched.mi
                              ? "form-control error"
                              : "form-control"
                          }
                        />
                        {errors.mi && touched.mi && (
                          <span className="error-feedback">{errors.mi}</span>
                        )}
                      </FormRow>
                      <FormRow label="Last Name *">
                        <Field
                          name="lastName"
                          type="text"
                          onBlur={handleBlur}
                          placeholder="Enter Last Name"
                          className={
                            errors.lastName && touched.lastName
                              ? "form-control error"
                              : "form-control"
                          }
                        />
                        {errors.lastName && touched.lastName && (
                          <span className="error-feedback">
                            {errors.lastName}
                          </span>
                        )}
                      </FormRow>
                      <FormRow label="Email">
                        <Field
                          name="email"
                          type="email"
                          onBlur={handleBlur}
                          placeholder="Enter Email"
                          className={
                            errors.email && touched.email
                              ? "form-control error"
                              : "form-control"
                          }
                        />
                        {errors.email && touched.email && (
                          <span className="error-feedback">{errors.email}</span>
                        )}
                      </FormRow>
                      <FormRow label="Phone Number">
                        <Field
                          name="phone"
                          type="text"
                          onBlur={handleBlur}
                          placeholder="e.g. 555-123-456"
                          className={
                            errors.phone && touched.phone
                              ? "form-control error"
                              : "form-control"
                          }
                        />
                        {errors.phone && touched.phone && (
                          <span className="error-feedback">{errors.phone}</span>
                        )}
                      </FormRow>
                    </div>
                    <div className="text-center card-footer">
                      <button
                        className={
                          this.props.headerName === "Drop Off"
                            ? "btn btn-info mr-5"
                            : "btn btn-info d-none"
                        }
                        name="previous"
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

Contact.propTypes = {
  headerName: PropTypes.string,
  componentName: PropTypes.string,
  customerId: PropTypes.number,
  handleNextPrev: PropTypes.func,
  contactList: PropTypes.arrayOf(PropTypes.shape({})),
  setContact: PropTypes.func,
  appendContactList: PropTypes.func,
  updateContactList: PropTypes.func,
  formData: PropTypes.shape({
    id: PropTypes.number,
  }),
};