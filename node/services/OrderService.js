const debug = require("sabio-debug");
const chalk = require("chalk");
const {dataProvider, TYPES} = require("sabio-data");
const _logger = debug.extend("orderEndpoint");
const {Paged} = require("sabio-models");

const { sendUpdateStatusEmail, sendPaymentConfirmationEmail } = require("./EmailService");




/**
 * @summary services endpoint to Orders table. 
 * 
 */
class OrderService {
    ping() {
        _logger('ping-from OrderService.js')
        return dataProvider.ping()
            .then(internalSuccess)
            .catch(internalCatch)
    }
    

    insertOrder(requestObject, currentUser) {
        return new Promise(executor);
        function executor(resolve, reject) {
            const procName = "dbo.Orders_Insert"
            let orderId = null;
            dataProvider.executeNonQuery(procName, inputParamMapper, returnParamMapper, onCompleted)
            function inputParamMapper(request) {
                request.output('Id', TYPES.Int)
                request.input('ShipmentId', TYPES.Int, requestObject.shipmentId)
                request.input('StatusId', TYPES.Int, requestObject.statusId)
                request.input('MessengerId', TYPES.Int, requestObject.messengerId)
                request.input('TrackingCode', TYPES.VarChar, requestObject.trackingCode)
                request.input('TrackingUrl', TYPES.VarChar, requestObject.trackingUrl)
                request.input('ChargeId', TYPES.VarChar, requestObject.chargeId)
                request.input('PaymentAccountId', TYPES.Int, requestObject.paymentAccountId)
                request.input('CreatedBy', TYPES.Int, currentUser)
                request.input('ModifiedBy', TYPES.Int, currentUser)
            
            }
            function returnParamMapper(returnParams) {
                orderId = returnParams.id
            }
            function onCompleted(error, data) {
                if(error) {
                    reject(error)
                    return; 
                }
                resolve(orderId)
                debug(orderId)
            }
        }
    }

    insertOrderTransaction(requestObject, currentUser, recipientAccountId, recipientId) {
        return new Promise(executor);
        function executor(resolve, reject) {
            const procName = "dbo.Orders_Insert_V3"
            let orderId = null;
            dataProvider.executeNonQuery(procName, inputParamMapper, returnParamMapper, onCompleted)
            function inputParamMapper(request) {
                request.output('Id', TYPES.Int)
                request.input('ShipmentId', TYPES.Int, requestObject.shipmentId)
                request.input('StatusId', TYPES.Int, requestObject.statusId)
                request.input('MessengerId', TYPES.Int, requestObject.messengerId)
                request.input('TrackingCode', TYPES.VarChar, requestObject.trackingCode)
                request.input('TrackingUrl', TYPES.VarChar, requestObject.trackingUrl)
                request.input('ChargeId', TYPES.VarChar, requestObject.chargeId)
                request.input('PaymentAccountId', TYPES.Int, requestObject.paymentAccountId)
                request.input('CreatedBy', TYPES.Int, currentUser)
                request.input('ModifiedBy', TYPES.Int, currentUser)
                
                request.input('RecipientAccountId', TYPES.NVarChar, recipientAccountId)
				request.input('SenderAccountId' , TYPES.NVarChar, requestObject.senderAccountId)
				request.input('RecipientId', TYPES.Int, recipientId)
				request.input('SenderId', TYPES.Int, requestObject.senderId)
				request.input('Amount', TYPES.Decimal, requestObject.amount)
				request.input('TransactionToken', TYPES.NVarChar, requestObject.transactionToken)
            
            }
            function returnParamMapper(returnParams) {
                orderId = returnParams.id
            }
            function onCompleted(error, data) {
                sendPaymentConfirmationEmail(requestObject.amount / 100)

                if(error) {
                    reject(error)
                    return; 
                }
                resolve(orderId)
                debug(orderId)
            }
        }
    }

    getByMessengerForFees(pageIndex, pageSize, messengerId, time) {
        return new Promise(executor)
        function executor(resolve, reject) {
            let ordersArr = null;
            let totalCount = null;
            let totalPages = null;
            const procName = "dbo.Orders_SelectAll_By_MessengerHistory_V2_FilterByTime"
            const returnParamMapper = null;
            dataProvider.executeCmd(procName, inputParamMapper, singleRecordMapper, returnParamMapper, onCompleted)

            function inputParamMapper(request) {
                request.input('pageIndex', TYPES.Int, pageIndex)
                request.input('pageSize', TYPES.Int, pageSize)
                request.input('MessengerId', TYPES.Int, messengerId)
                request.input('Time', TYPES.VarChar, time)
            }

            function singleRecordMapper(data) {
                if(!ordersArr) {
                    ordersArr = [];
                } totalCount = data.totalCount;
                delete data.totalCount;
                ordersArr.push(data)
            }
            function onCompleted(error, data) {
                if(error) {
                    reject(error);
                    return;
                }
                if(ordersArr) {
               
                    totalPages = new Paged(ordersArr, pageIndex, pageSize, totalCount)
                    totalPages.pagedItems.forEach((item)=> {
                        item.messenger = JSON.parse(item.messenger);
                        item.pickupLocation = JSON.parse(item.pickupLocation);
                        item.dropOffLocation = JSON.parse(item.dropOffLocation)
                    })
                }
                resolve(totalPages)
            }
        }
    }
}



function internalSuccess(...args) {
    _logger(chalk.green.bold("Internal Success" + args));
}

function internalCatch(error) {
    _logger(chalk.red.bold("Internal Catch" + error));
}

const service = new OrderService();

module.exports = service;