import React, { Component } from "react";
import PropTypes from "prop-types";
import Stepper from "../common/Stepper";
import Contact from "./Contact";
import PickupOptions from "./PickupOptions";
import "./shipment.scss";
import Location from "./Location";
import DropOffOptions from "./DropOffOptions";
import Summary from "../Summary";
import { toast } from "react-toastify";
import * as userService from "../../services/usersService";
import * as locationService from "../../services/locationService";
import * as contactService from "../../services/contactService";
import debug from "sabio-debug";

const _logger = debug.extend("ShipmentForm");
_logger("test");

export default class ShipmentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stepsArray: [
        "Pickup Contact",
        "Pickup Location",
        "Pickup Options",
        "Drop Off Contact",
        "Drop Off Location",
        "Drop Off Options",
        "Summary",
      ],
      currentStepNumber: 1,
      direction: "horizontal",
      contactId: 0,
      pickupContact: {},
      pickupLocation: {},
      pickupOptions: {},
      dropOffContact: {},
      dropOffLocation: {},
      dropOffOptions: {},
      shipmentData: {
        total: 30.0,
        messengerFee: 5.99,
        tip: 4.0,
        cost: 20.01,
      },
      contactList: [],
      customerLocationList: [],
      contactLocationList: [],
    };
    this.updateWindowWidth = this.updateWindowWidth.bind(this);
  }

  componentDidMount() {
    this.updateWindowWidth();
    window.addEventListener("resize", this.updateWindowWidth);
    if (this.props.currentUser.isLogged) {
      this.initializeFormData();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowWidth);
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.dropOffContact.id !== this.state.dropOffContact.id) {
      const contactLocations = await this.getContactLocations(
        this.state.dropOffContact.id
      );

      this.setState((prevState) => {
        return {
          ...prevState,
          dropOffLocation:
            contactLocations.length > 0 ? contactLocations[0] : {},
          contactLocationList: contactLocations,
        };
      });
    }
  }

  showStep = (step) => {
    switch (step) {
      case 1:
        return (
          <Contact
            handleNextPrev={this.handleNextPrev}
            formData={this.state.pickupContact}
            componentName="pickupContact"
            headerName="Pickup"
          />
        );
      case 2:
        return (
          <Location
            handleNextPrev={this.handleNextPrev}
            formData={this.state.pickupLocation}
            componentName="pickupLocation"
            headerName="Pickup"
            locationList={this.state.customerLocationList}
            setLocation={this.setLocation}
            customerId={this.state.customerId}
            appendLocationList={this.appendLocationList}
            updateLocationList={this.updateLocationList}
          />
        );
      case 3:
        return (
          <PickupOptions
            handleNextPrev={this.handleNextPrev}
            formData={this.state.pickupOptions}
            pickupData={{
              ...this.state.pickupContact,
              locationId: this.state.pickupLocation.id,
            }}
          />
        );
      case 4:
        return (
          <Contact
            handleNextPrev={this.handleNextPrev}
            formData={this.state.dropOffContact}
            componentName="dropOffContact"
            headerName="Drop Off"
            contactList={this.state.contactList}
            setContact={this.setContact}
            appendContactList={this.appendContactList}
            updateContactList={this.updateContactList}
            customerId={this.state.customerId}
          />
        );
      case 5:
        return (
          <Location
            handleNextPrev={this.handleNextPrev}
            formData={this.state.dropOffLocation}
            componentName="dropOffLocation"
            headerName="Drop Off"
            locationList={this.state.contactLocationList}
            setLocation={this.setLocation}
            appendLocationList={this.appendLocationList}
            updateLocationList={this.updateLocationList}
            contactId={this.state.dropOffContact.id}
            customerId={this.state.customerId}
          />
        );
      case 6:
        return (
          <DropOffOptions
            handleNextPrev={this.handleNextPrev}
            formData={this.state.dropOffOptions}
            dropOffData={{
              contactId: this.state.dropOffContact.id,
              locationId: this.state.dropOffLocation.id,
            }}
          />
        );
      case 7:
        return (
          <Summary
            handleNextPrev={this.handleNextPrev}
            formData={{
              pickupContact: this.state.pickupContact,
              pickupLocation: this.state.pickupLocation,
              pickupOptions: this.state.pickupOptions,
              dropOffContact: this.state.dropOffContact,
              dropOffLocation: this.state.dropOffLocation,
              dropOffOptions: this.state.dropOffOptions,
              shipmentData: {
                ...this.state.shipmentData,
                pickupId: this.state.pickupOptions.id,
                dropOffId: this.state.dropOffOptions.id,
              },
            }}
          />
        );
    }
  };

  initializeFormData = async () => {
    const user = await this.getCurrentUserDetails(this.props.currentUser.id);

    const customerLocations = await this.getCustomerLocations(user.customerId);

    const customerContacts = await this.getCustomerContacts(user.customerId);

    const contactLocations = await this.getContactLocations(
      customerContacts[0].id
    );

    this.setState((prevState) => {
      return {
        ...prevState,
        pickupContact: user,
        customerId: user.customerId,
        pickupLocation: customerLocations[0],
        customerLocationList: customerLocations,
        contactList: customerContacts,
        dropOffContact: customerContacts[0],
        dropOffLocation: contactLocations[0],
        contactLocationList: contactLocations,
      };
    });
  };

  handleNextPrev = (name, data, event) => {
    const { currentStepNumber } = this.state;
    const direction = event && event.target.name;

    let newStep = currentStepNumber;
    event && direction === "previous" ? newStep-- : newStep++;

    if (newStep < this.state.stepsArray.length + 1) {
      this.setState((prevState) => {
        return {
          ...prevState,
          currentStepNumber: newStep,
          [name]: data,
        };
      });
    }
  };

  getCurrentUserDetails = (userId) => {
    return userService
      .userCustomerDetails(userId)
      .then(this.onGetCurrentUserDetailsSuccess)
      .catch(this.onGetCurrentUserDetailsError);
  };

  getCustomerLocations = (customerId) => {
    return locationService
      .getByCustomer(customerId)
      .then(this.onGetCustomerLocationsSuccess)
      .catch(this.onGetCustomerLocationsError);
  };

  getCustomerContacts = () => {
    return contactService
      .getByCreatedBy(0, 20)
      .then(this.onGetContactsSuccess)
      .catch(this.onGetContactsError);
  };

  getContactLocations = (contactId) => {
    return locationService
      .getByContact(contactId)
      .then(this.onGetContactLocationSuccess)
      .catch(this.onGetContactLocationError);
  };

  onGetCurrentUserDetailsSuccess = (response) => response.item;

  onGetCustomerLocationsSuccess = (response) => response.items;

  onGetContactsSuccess = (response) => response.item.pagedItems;

  onGetContactLocationSuccess = (response) => response.items;

  onGetCurrentUserDetailsError = (error) => toast.error(error.message);

  onGetCustomerLocationsError = (error) => {
    toast.error(error.message);
    return [];
  };

  onGetContactsError = (error) => toast.error(error.message);

  onGetRequestError = (error) => toast.error(error.message);

  onGetContactLocationError = (error) => {
    if (error.response && error.response.status === 404) {
      return [];
    }
  };

  setLocation = (componentName, location) => {
    this.setState((prevState) => {
      return { ...prevState, [componentName]: location };
    });
  };

  appendLocationList = (componentName, location) => {
    let listName = this.getListName(componentName);
    this.setState((prevState) => {
      const list = [...prevState[listName], location];

      return { ...prevState, [listName]: list };
    });
  };

  updateLocationList = (componentName, location) => {
    let listName = this.getListName(componentName);
    const foundIndex = this.state[listName].findIndex(
      (locationOption) => locationOption.id === location.id
    );

    this.setState((prevState) => {
      const list = [...prevState[listName]];
      list[foundIndex] = location;
      return { ...prevState, [listName]: list };
    });
  };

  setContact = (contact) => {
    this.setState((prevState) => {
      return { ...prevState, dropOffContact: contact };
    });
  };

  appendContactList = (contact) => {
    this.setState((prevState) => {
      const list = [...prevState.contactList, contact];

      return {
        ...prevState,
        contactList: list,
        contactLocationList: [],
        dropOffLocation: { id: 0 },
      };
    });
  };

  updateContactList = (updatedContact) => {
    const foundIndex = this.state.contactList.findIndex(
      (contact) => contact.id === updatedContact.id
    );

    this.setState((prevState) => {
      const list = [...prevState.contactList];
      list[foundIndex] = updatedContact;
      return { ...prevState, contactList: list };
    });
  };

  getListName = (componentName) => {
    let listName = "";
    if (componentName === "pickupLocation") {
      listName = "customerLocationList";
    } else {
      listName = "contactLocationList";
    }
    return listName;
  };

  updateWindowWidth() {
    let direction = "horizontal";
    if (window.innerWidth < 1200) {
      direction = "vertical";
    }

    this.setState((prevState) => {
      return { ...prevState, direction };
    });
  }

  render() {
    return (
      <div className={`stepper-container-${this.state.direction}`}>
        <h1 className="mb-5 text-center">Checkout</h1>
        <p>{undefined}</p>
        <Stepper
          steps={this.state.stepsArray}
          direction={`${this.state.direction}`}
          currentStepNumber={this.state.currentStepNumber}
          displayForms={this.showStep}
          verticalStepSize="small"
        />
      </div>
    );
  }
}

ShipmentForm.propTypes = {
  currentUser: PropTypes.shape({
    isLogged: PropTypes.bool,
    id: PropTypes.number,
  }),
};