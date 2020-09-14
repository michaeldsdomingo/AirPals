import React, { Component } from "react";
import PropTypes from "prop-types";
import * as orderService from "../../services/orderService";
import OrderRows from "./OrderRows";
import "./in_transit.scss";
import Pagination from "rc-pagination";
import HeaderDashboard from '../common/HeaderDashboard'
import { toast } from "react-toastify";
import localeInfo from "rc-pagination/lib/locale/en_US";

export default class OrdersInTransit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageSize: 10,
      order: {},
      orderRows: [],
      total: 0,
      count: 0,
    };
  }
  componentDidMount() {
    if (this.props.currentUser.roles[0] === "Customer") {
      this.getCustomerOrders(this.state.currentPage, this.state.pageSize)
    } else {
      this.getOrders(this.state.currentPage, this.state.pageSize);
    }
  }

  getOrders = (page, pageSize) => {
    orderService
      .getAllByInTransit(page - 1, pageSize)
      .then(this.onGetAllSuccess)
      .catch(this.onGetAllError);
  };

  getCustomerOrders = (page, pageSize) => {
    orderService.getInTransitCreatedBy(page - 1, pageSize)
      .then(this.onGetAllSuccess)
      .catch(this.onGetAllError)
  }

  onGetAllSuccess = (response) => {
    const orders = response.item.pagedItems;
    const orderRows = orders.map(this.mapOrderRow);
    orders.forEach((order) => {
      order.timeElapse = this.timeElapse(order.dateCreated);
    });
    this.setState((prevState) => {
      return {
        ...prevState,
        orders,
        orderRows,
        total: response.item.totalCount,
        currentPage: +response.item.pageIndex + 1,
      };
    });
  };

  onGetAllError = () => {
    toast.error("Unable to get orders");
  };

  mapOrderRow = (order) => {
    return <OrderRows key={order.id} order={order} count={this.state.count} />;
  };

  timeElapse = (time) => {
    const created = new Date(time).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - created) / 1000 / 60);
    return this.formatTimeElapsed(elapsed);
  };

  formatTimeElapsed = (time) => {
    let formattedTime = "";
    let color = "success";

    if (time / 1440 >= 1) {
      const timeInHours = time / 60;
      const days = Math.floor(timeInHours / 24);
      const hours = time % 24;
      color = "danger";
      formattedTime = `${days}d ${hours}hr`;
    } else if (time / 60 >= 1) {
      const hours = Math.floor(time / 60);
      const min = time % 60;
      color = "warning";
      formattedTime = `${hours}hr ${min}min`;
    } else {
      formattedTime = `${time}min`;
    }
    return { time: formattedTime, color };
  };

  handlePageChange = (page) => {
    if (this.props.currentUser.roles[0] === "Customer") {
      this.getCustomerOrders(page, this.state.pageSize)
    } else {
      this.getOrders(page, this.state.pageSize);
    }
  };

  render() {
    return (
      <div className="content-wrapper" id="in-transit-orders">
        <HeaderDashboard label='In Transit Orders' />
        <div className="in-transit-table">
          <div className="table-headers row">
            <div className="col-2 col-lg-1 thead">Order</div>
            <div className="d-none col-3 d-lg-block col-lg-2 thead">
              Messenger
            </div>
            <div className="col-5 col-lg-2 thead">Status</div>
            <div className="d-none d-lg-block col-2 thead">Pickup</div>
            <div className=" d-none d-lg-block col-2 thead">
              Drop Off Location
            </div>
            <div className="col-3 col-lg-2 thead">Duration</div>
            <div className="d-none d-sm-block col-sm-2 col-lg-1 thead">Cost</div>
          </div>
          <div>{this.state.orderRows}</div>
          {this.state.total > 0 && (
            <div className="m-2 ml-auto mr-auto">
              <Pagination
                total={this.state.total}
                current={this.state.currentPage}
                pageSize={this.state.pageSize}
                onChange={this.handlePageChange}
                locale={localeInfo}
                className="d-flex justify-content-center"
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

OrdersInTransit.propTypes = {
  currentUser: PropTypes.shape({
    roles: PropTypes.arrayOf(PropTypes.string)
  })
}