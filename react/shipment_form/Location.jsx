import React, { Component } from "react";
import PropTypes from "prop-types";
import LocationForm from "./LocationForm";
import logger from "sabio-debug";
import * as locationService from "../../services/locationService";
import * as lookupService from "../../services/lookupService";
import { toast } from "react-toastify";

const _logger = logger.extend("Location");
_logger("From Location");

export default class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stateOptions: [],
      statesInfo: [],
      locationTypesInfo: [],
      locationOptions: [],
      locationList: [],
    };
  }

  componentDidMount() {
    this.initializeLocationTypeStates();
  }

  mapLocationList = (list, statesInfo) => {
  
    const locationOptions = list.length > 0 && list.map((location) => {
      let stateName = "";
      if (statesInfo.length !== 0) {
        const stateFound = statesInfo.find(
          (state) => state.id === location.stateId
        );
        stateName = stateFound.name;
      }
      return (
        <option key={location.id} value={location.id}>
          {`${location.lineOne} ${location.lineTwo} ${location.city}, ${stateName}`}
        </option>
      );
    });

 
    return locationOptions
    
  };

  initializeLocationTypeStates = async () => {
 
    const locationType = await this.getAllLocationTypes("LocationTypes");

    const states = await this.getAllStates();

    const locationOptions = this.mapLocationList(this.props.locationList, states.statesInfo);

    this.setState((prevState) => {
      return {
        ...prevState,
        locationTypesInfo: locationType.locationTypesInfo,
        locationTypeOptions: locationType.locationTypeOptions,
        stateOptions: states.stateOptions,
        statesInfo: states.statesInfo,
        locationOptions: locationOptions
      };
    });
  };

  propsToFormData(props) {
    const location = props.formData;
    if (location) {

      const locationTypeObj = this.findObjById(
        this.state.locationTypesInfo,
        location.locationTypeId
      );
  
      const stateObj = this.state.statesInfo && this.findObjById(this.state.statesInfo, location.stateId);
  
      const item = {
        locationType: locationTypeObj ? locationTypeObj.name : "Home",
        lineOne: location.lineOne || "",
        lineTwo: location.lineTwo || "",
        city: location.city || "",
        state: stateObj ? stateObj.name : "New York",
        zip: location.zip || "",
        id: location.id || 0,
      };
  
      return item;
    }
    return {}
  }

  handleNext = (formValues) => {
    const locationType = this.findObjByName(
      this.state.locationTypesInfo,
      formValues.locationType
    );

    const state = this.findObjByName(this.state.statesInfo, formValues.state);

    const payload = {
      ...formValues,
      locationTypeId: locationType.id,
      stateId: state.id,
    };

    if (this.props.formData.id) {
      payload.id = this.props.formData.id;
      this.updateLocation(payload);
    } else {
      this.addLocation(payload);
    }
  };

  handleLocationChange = (event) => {
    if (event.target.value === "0") {
      this.props.setLocation(this.props.componentName, {});
    } else {
      const locationSelected = this.findObjById(
        this.props.locationList,
        parseInt(event.target.value)
      );
      this.props.setLocation(this.props.componentName, locationSelected);
    }
  };

  getAllLocationTypes = (type) => {
    return lookupService
      .getAllTypes(type)
      .then(this.onGetAllLocationTypesSuccess)
      .catch(this.onGetAllLocationTypesError);
  };

  getAllStates = () => {
    return locationService
      .getAllStates()
      .then(this.onGetAllStatesSuccess)
      .catch(this.onGetAllStatesError);
  };

  addLocation = (payload) => {
    if (this.props.componentName === "pickupLocation") {
      if (this.props.customerId) {
        payload.customerId = this.props.customerId;
        locationService
          .addByCustomer(payload)
          .then(this.onAddLocationSuccess)
          .catch(this.onAddLocationError);
      } else {
        locationService
          .addLocation(payload)
          .then(this.onAddLocationSuccess)
          .catch(this.onAddLocationError);
      }
    } else {
      payload.contactId = this.props.contactId;
      locationService
        .addByContact(payload)
        .then(this.onAddLocationSuccess)
        .catch(this.onAddLocationError);
    }
  };

  updateLocation = (payload) => {
    locationService
      .update(payload)
      .then(this.onUpdateLocationSuccess)
      .catch(this.onUpdateLocationError);
  };

  onGetAllStatesSuccess = (response) => {
    const statesInfo = response.items;
    const stateOptions = statesInfo.map((stateInfo) => {
      return (
        <option value={stateInfo.name} key={stateInfo.id}>
          {stateInfo.name}
        </option>
      );
    });

    return { statesInfo, stateOptions };
  };

  onGetAllLocationTypesSuccess = (response) => {
    const locationTypesInfo = response.items;
    const locationTypeOptions = locationTypesInfo.map((locationType) => {
      return (
        <option value={locationType.name} key={locationType.id}>
          {locationType.name}
        </option>
      );
    });

    return { locationTypesInfo, locationTypeOptions };
  };

  onAddLocationSuccess = (response) => {
    const locationData = { ...response.formData, id: response.item };
    this.props.handleNextPrev(this.props.componentName, locationData);
    if (this.props.customerId) {
      this.props.appendLocationList(this.props.componentName, locationData);
    }
  };

  onUpdateLocationSuccess = (response) => {
    const locationData = { ...response.formData };
    this.props.handleNextPrev(this.props.componentName, locationData);
    this.props.updateLocationList(this.props.componentName, locationData);
  };

  onGetAllLocationTypesError = (error) => toast.error(error.message);

  onGetAllStatesError = (error) => toast.error(error.message);

  onUpdateLocationError = (error) => toast.error(error.message);

  onAddLocationError = (error) => toast.error(error.message);

  onGetAllStatesError = (error) => toast.error(error.message);

  findObjById = (array, id) => {
    const foundObj = array.find((item) => item.id === id);

    return foundObj;
  };

  findObjByName = (array, name) => {
    const foundObj = array.find((item) => item.name === name);

    return foundObj;
  };

  getIdByName = (type, name) => {
    let id = 0;
    if (type === "state") {
      id = this.findObjByName(this.state.statesInfo, name).id;
    } else {
      id = this.findObjByName(this.state.locationTypesInfo, name).id;
    }
    return id;
  };

  render() {
    return (
      <LocationForm
        initialValues={this.propsToFormData(this.props)}
        handleNext={this.handleNext}
        headerName={this.props.headerName}
        componentName={this.props.componentName}
        handleLocationChange={this.handleLocationChange}
        locationList={this.props.locationList}
        locationOptions={this.state.locationOptions}
        locationTypeOptions={this.state.locationTypeOptions}
        stateOptions={this.state.stateOptions}
        handleNextPrev={this.props.handleNextPrev}
        getIdByName={this.getIdByName}
      />
    );
  }
}

Location.propTypes = {
  handleNextPrev: PropTypes.func,
  handlePrev: PropTypes.func,
  componentName: PropTypes.string,
  headerName: PropTypes.string,
  locationList: PropTypes.arrayOf(PropTypes.shape({})),
  decreaseStep: PropTypes.func,
  setLocation: PropTypes.func,
  appendLocationList: PropTypes.func,
  updateLocationList: PropTypes.func,
  customerId: PropTypes.number,
  contactId: PropTypes.number,
  formData: PropTypes.shape({
    id: PropTypes.number,
  }),
};