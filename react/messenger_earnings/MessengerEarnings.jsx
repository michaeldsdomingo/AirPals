import React, { Component } from "react";
import * as orderService from "../../../services/orderService";
import Pagination from "rc-pagination";
import EarningsRow from "./EarningsRow";
import "./earnings.scss";
import "rc-pagination/assets/index.css";
// import { toast } from "react-toastify";
import { formatMoney } from "../../../services/moneyService";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import localeInfo from "rc-pagination/lib/locale/en_US";
const _logger = debug.extend("MessengerEarnings");
_logger("test");

export default class MessengerEarnings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageSize: 10,
      messengerId: 24,
      total: 0,
      timeFilter: "daily",
      totalEarnings: 0,
    };
  }
  componentDidMount() {
    this.getOrderByMessenger(
      this.state.currentPage,
      this.state.timeFilter,
      this.state.pageSize
    );
  }

  getOrderByMessenger = (page, timeFilter, pageSize) => {
    orderService
      .messengerForFees(page - 1, pageSize, this.props.messengerId, timeFilter)
      .then(this.onGetOrderSuccess)
      .catch(this.onGetOrderError);
  };

  onGetOrderSuccess = (response) => {
    const orders = response.item.pagedItems;
    const messenger = orders[0].messenger;
    const orderRows = this.createOrderRows(orders);
    const totalMoney = orders[0].totalEarnings + orders[0].totalTip;

    this.setState((prevState) => {


      return {
        ...prevState,
        orders,
        messenger,
        orderRows,
        total: response.item.totalCount,
        currentPage: +response.item.pageIndex + 1,
        totalMoney,
        pageSize: response.item.pageSize,
      };
    });
  };

  onGetOrderError = () => {
    const orderRows = <h1 className="mt-5 mb-5">No Orders Found</h1>;
    this.setState((prevState) => {
      return { ...prevState, orderRows, total: 0 };
    });
  };

  createOrderRows = (orders) => {
    return orders.map(this.mapOrderRows);
  };

  mapOrderRows = (order) => {
    return <EarningsRow order={order} key={order.id} />;
  };

  handlePageChange = (page) => {
    this.getOrderByMessenger(page, this.state.timeFilter, this.state.pageSize);
  };

  handleTimeFilter = (event) => {
    const value = event.target.value;

    this.getOrderByMessenger(
      1,
      value,
      this.state.pageSize
    );

    this.setState((prevState) => {
      return { ...prevState, timeFilter: value };
    });
  };

  handlePageSize = (event) => {
    const pageSize = event.target.value;
    this.getOrderByMessenger(
      1,
      this.state.timeFilter,
      pageSize
    );
  };

  render() {
    return (
      <div id="messenger-earnings">
        <div id="table-container">
          <h3 className="card-header messenger-more-details text-center">
            Completed Deliveries
          </h3>
          <div className=" row no-gutters card-header align-items-center mp-sides-0">
            <div className="col-4 row no-gutters justify-content-start  align-items-center">
              <select
                className=" form-control messenger-select "
                onChange={this.handlePageSize}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <h4 className="col-4 center-text" id="total-money">
              Total: {formatMoney(this.state.totalMoney)}
            </h4>
            <div className="col-4 row no-gutters justify-content-end  align-items-center">
              <select
                className="form-control messenger-select "
                onChange={this.handleTimeFilter}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <div className="table">
            <div className="row" id="column-headers">
              <div className="col-4 col-sm-2 thead center-text">Order Id</div>
              <div className="col-3 d-none d-sm-block thead text-center">
                Pickup Location
              </div>
              <div className="col-3 d-none d-sm-block thead text-center">
                Drop Off Location
              </div>
              <div className="col-4 col-sm-2 thead text-center">Earnings</div>
              <div className="col-4 col-sm-2 thead text-center">Tip</div>
            </div>

            <div>{this.state.orderRows}</div>
          </div>
        </div>
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
    );
  }
}

MessengerEarnings.propTypes = {
  messengerId: PropTypes.number,
};