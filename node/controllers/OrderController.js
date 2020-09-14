const Responses = require("sabio-web-models").Responses;
const {RoutePrefix, Route} = require("sabio-routing");
const {orderAddSchema, orderTransactionAddSchema ,orderUpdateSchema, orderUpdateStatusSchema} = require("sabio-models").Schemas;
const BaseController = require("./BaseController");
const orderService = require("sabio-services").orderService
require('dotenv').config({path: './env'})
const stripePk = process.env.STRIPE_PUBLIC_KEY
// const logger = require('sabio-debug')


@RoutePrefix('/api/orders')
class OrderController extends BaseController {
    constructor() {
        super('OrderController')
    }

    @Route("POST", "", orderAddSchema )
    insertOrder(req, res) {
        const currentUser = req.user.id
        orderService.insertOrder(req.body, currentUser)
        .then(orderId => {
            const response = new Responses.ItemResponse(orderId);
            res.status(201).json(response)
        })
        .catch(error => {
            res.status(500).json(new Responses.ErrorResponse(error))
        })
    }

    @Route("POST", "transactions", orderTransactionAddSchema )
    insertOrderTransaction(req, res) {
        const currentUser = req.user.id
        const recipientAccountId = stripePk
        const recipientId = 1
        orderService.insertOrderTransaction(req.body, currentUser, recipientAccountId, recipientId)
        .then(orderId => {
            const response = new Responses.ItemResponse(orderId);
            res.status(201).json(response)
        })
        .catch(error => {
            res.status(500).json(new Responses.ErrorResponse(error))
        })
    }

    @Route("GET", "fees/messenger/:id(\\d+)")
    getByMessengerHistory(req, res, next) {
        orderService.getByMessengerForFees(req.query.pageIndex, req.query.pageSize, req.params.id, req.query.time)
        .then(responseObject => {
            let response = null;
            let code = 200;
            if(responseObject) {
                response = new Responses.ItemResponse(responseObject)
            } else {
                code = 404;
                response = new Responses.ErrorResponse("Records not found")
            }
            res.status(code).json(response)
        })
        .catch(error => {
            res.status(500).json(new Responses.ErrorResponse(error))
        })
    }

    
}

module.exports = {
    controller: OrderController
}