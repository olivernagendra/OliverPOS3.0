// A mock function to mimic making an async request for data
import { serverRequest } from '../../CommonServiceRequest/serverRequest'
import { get_UDid } from '../common/localSettings';
import moment from 'moment';
import ActiveUser from '../../settings/ActiveUser';
import Config from '../../Config';
export function checkStockAPI(cartlist) {
    var items = [];
    var data;
    var udid = get_UDid('UDID');
    if (cartlist != null) {
        cartlist && cartlist.map(value => {
            items.push({
                ProductId: value.variation_id == 0 ? value.product_id : value.variation_id,
                Quantity: value.quantity,
                possition: 0,
                success: false
            })
        })
    }
    data = {
        udid: udid,
        productinfos: items,
        WarehouseId: localStorage.getItem("WarehouseId") ? parseInt(localStorage.getItem("WarehouseId")) : 0
    }
    return serverRequest.clientServiceRequest('POST', `/Product/CheckStock`, data)
        .then(result => {
            return result
        })
}

export function getPaymentTypeNameAPI() {
    let registerId = localStorage.getItem('register') ? localStorage.getItem('register') : '';
    return serverRequest.clientServiceRequest('GET', `/PaymentType/Get?RegisterId=${registerId}`, '')
        .then(res => {
            localStorage.setItem("PAYMENT_TYPE_NAME", JSON.stringify(res.content))
            return res
        }).catch(error => {
            return error
        });
}
export function getExtensionsAPI() {
    return serverRequest.clientServiceRequest('GET', `/Extensions/Get`, '')
        .then(result => {
            localStorage.setItem('GET_EXTENTION_FIELD', JSON.stringify(result.content))
            return result.content;
        })
        .catch(error => {
            return error
        });
}

export function getMakePaymentAPI(registerId, paycode, amount, command, transId) {

    var parma = { "registerId": registerId, "paycode": paycode, "amount": amount, "command": command, "refId": transId };
    // var parma={"registerId":registerId,"paycode":'test_tip',"amount":amount,"command":command, "refId" : transId};
    return serverRequest.clientServiceRequest('POST', `/Payments/RunTransaction`, parma)
        .then(res => {
            return res
        })
        .catch(error => {
            return { "is_success": false, "message": error !== "" && error.Message ? error.Message : 'An error has occurred.', "content": null, "exceptions": null, "status_code": 202, "subscription_expired": false }
        })
}
// online payment service
export function makeOnlinePaymentsAPI(cardData) {
    return serverRequest.clientServiceRequest('POST', `/OnlinePayments/RunTransaction`, cardData)

        //  return serverRequest.clientServiceRequest('POST', `/OnlinePayments/ChargeCreditCard`,cardData)
        .then(res => {

            if (res.is_success == true) {
                var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                if (demoUser) {
                    //GTM_OliverDemoUser("ShopView: Add Tile to Favourite")
                }
                localStorage.setItem('ONLINE_PAYMENT_RESPONSE', JSON.stringify(res));
                localStorage.setItem('PAYMENT_RESPONSE', JSON.stringify(res));

                //dispatch(success(res));
            } else {

                //dispatch(failure(res.message));
            }

            return res
        })
}
export function saveAPI(shopOrder, path , updatedBy="") {

    return serverRequest.clientServiceRequest('POST', `/orders/CreateOliverOrder`, shopOrder)
        .then(shop_order => {
            if (shop_order.is_success == true) {
                localStorage.removeItem('extensionUpdateCart');
                localStorage.removeItem('TIKERA_SELECTED_SEATS');
                localStorage.removeItem("TIKERA_SEAT_CHART");
                localStorage.removeItem("selectedGroupSale");
                var taxData = localStorage.getItem("SELECTED_TAX") && JSON.parse(localStorage.getItem("SELECTED_TAX"));
                if (taxData) {
                    localStorage.setItem("TAXT_RATE_LIST", JSON.stringify(taxData[0]));
                }
                var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                if (demoUser) {
                    //GTM_OliverDemoUser("CheckoutView: Order placed ")
                }
                //if parked by extension app, it is returning temp order id to the app 
                if (updatedBy == "byExtApp") {
                    //handleAppEvent({method:"post",command:"ParkSale",tempOrderId:shop_order.content?shop_order.content.tempOrderId:0},null);
                }

                //dispatch(success(shop_order));

                //Created By : Nagendra
                // Modified Date: 03/07/2020
                // Desc : Save the payment log 
                try {
                    var d = new Date();
                    var orderPayments = localStorage.getItem("oliver_order_payments") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : "";
                    var cashmanagementID = localStorage.getItem("Cash_Management_ID")
                    var dateStringWithTime = moment(d).format('YYYY-MM-DD HH:mm:ss Z');
                    var getLocalTimeZoneOffsetValue = d.getTimezoneOffset();
                    var localTimeZoneType = moment.tz.guess(true);
                    var user = JSON.parse(localStorage.getItem("user"));

                    var paymentLog = [];
                    if (orderPayments && orderPayments.length) {
                        orderPayments.map(item => {
                            if (item.Id == 0) { // only new payment should be log
                                paymentLog.push({
                                    CashManagementId: cashmanagementID,
                                    AmountIn: item.payment_amount,
                                    AmountOut: 0,
                                    LocalDateTime: dateStringWithTime,
                                    LocalTimeZoneType: localTimeZoneType,
                                    TimeZoneOffsetValue: getLocalTimeZoneOffsetValue,
                                    SalePersonId: user && user.user_id ? user.user_id : '',
                                    SalePersonName: user && user.display_name ? user.display_name : '',
                                    SalePersonEmail: user && user.user_email ? user.user_email : '',
                                    OliverPOSReciptId: shop_order.content && shop_order.content.tempOrderId && shop_order.content.tempOrderId,
                                    PaymentTypeName: item.payment_type,
                                    PaymentTypeSlug: item.payment_type,
                                    EODReconcilliation: true,
                                    Notes: item.description
                                })
                            }
                        })
                        console.log("paymentLog", paymentLog)
                        if (paymentLog.length > 0) {
                            //dispatch(cashManagementAction.addPaymentListLog(paymentLog));
                        }
                    }
                    //----------------------------------------------------------

                } catch (error) {
                    console.log("cashManagementLog Error", error)
                }



                //update Refund qty for product......................
                // dispatch(idbProductActions.updateOrderProductDB(line_items));
                //----------------------------------------------------  
                setTimeout(function () {
                    if (shop_order.content && shop_order.content.tempOrderId && shop_order.content.tempOrderId != '') {
                        localStorage.setItem('tempOrder_Id', JSON.stringify(shop_order.content.tempOrderId));
                        //OrderID=shop_order.content.tempOrderId
                        //Create localstorage to store temporary orders--------------------------

                        // inventory check lay-away and park sale
                        var pending_payments = localStorage.getItem('PENDING_PAYMENTS') ? JSON.parse(localStorage.getItem('PENDING_PAYMENTS')) : null
                        var checklist = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null
                        var list_item = []
                        var itemExists = []
                        if (pending_payments && checklist && pending_payments.orderId == checklist.orderId) {
                            pending_payments && pending_payments.ListItem && pending_payments.ListItem.filter((pending) => {
                                return checklist && checklist.ListItem && checklist.ListItem.filter((check) => {
                                    if (pending.line_item_id == check.line_item_id) {
                                        itemExists.push(pending)
                                        return pending
                                    }
                                })
                            })
                            list_item = pending_payments && pending_payments.ListItem && pending_payments.ListItem.filter((item) => !itemExists.includes(item))

                            checklist && checklist.ListItem && checklist.ListItem.map((itm) => {
                                list_item && list_item.map((list) => {
                                    var checkProId = itm.variation_id == 0 ? itm.product_id : itm.variation_id ? itm.variation_id : itm.product_id
                                    var listProId = list.variation_id == 0 ? list.product_id : list.variation_id ? list.variation_id : list.product_id

                                    if (checkProId == listProId && list.quantity && itm.quantity && list.quantity > itm.quantity) {
                                        if (list.quantity > itm.quantity) {
                                            list.quantity = list.quantity - itm.quantity
                                        }
                                    }
                                })
                            })

                            // if (list_item && list_item.length) {
                            //     var udid = get_UDid('UDID')
                            //     var productList = []
                            //     const dbPromise = openDb('ProductDB', 1, upgradeDB => {
                            //         upgradeDB.createObjectStore(udid);
                            //     });
                            //     const idbKeyval = {
                            //         async get(key) {
                            //             const db = await dbPromise;
                            //             return db.transaction(udid).objectStore(udid).get(key);
                            //         },
                            //         // async set(key, val) {
                            //         //     const db = await dbPromise;
                            //         //     const tx = db.transaction(udid, 'readwrite');
                            //         //     tx.objectStore(udid).put(val, key);
                            //         //     return tx.complete;
                            //         // },
                            //     };
                            //     idbKeyval.get('ProductList').then(val => {
                            //         productList = val;
                            //         list_item && list_item.map(itm => {
                            //             productList && productList.find(value => {
                            //                 var pro_id = itm.variation_id == 0 ? itm.product_id : itm.variation_id ? itm.variation_id : itm.product_id
                            //                 if (value.WPID === pro_id) {
                            //                     itm['StockQuantity'] = value['StockQuantity'];

                            //                     var qtyData = {
                            //                         udid: get_UDid('UDID'),
                            //                         // adjust quanity while parksale item remove and add new this bug is resolve Product inventory is automatically updated  using park sale
                            //                         //quantity: value && value['StockQuantity'] ? value['StockQuantity'] + itm.quantity : itm.quantity,
                            //                         quantity: value && value['StockQuantity'] ? value['StockQuantity'] - itm.quantity : itm.quantity,
                            //                         wpid: pro_id
                            //                     }

                            //                     dispatch(cartProductActions.addInventoryQuantity(qtyData, list_item));
                            //                     return true;
                            //                 }
                            //             })
                            //         })
                            //     })

                            // }
                        }
                        //**************  ************//




                        var TempOrders = [];
                        if (localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`)) {
                            TempOrders = JSON.parse(localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`));
                        }
                        TempOrders.push({ "TempOrderID": shop_order.content.tempOrderId, "Status": "false", "Index": TempOrders.length, "OrderID": 0, 'order_status': "completed", 'date': moment().format(Config.key.NOTIFICATION_FORMAT), 'Sync_Count': 0, 'new_customer_email': '', 'isCustomerEmail_send': false, 'order_status_DB': shopOrder.status });  //order_status_DB is added for app command order status
                        localStorage.setItem(`TempOrders_${ActiveUser.key.Email}`, JSON.stringify(TempOrders));
                        //-----------------------------------------------------------------------
                    }
                    // path = 1  is payment complete
                    // path = 2  is payments lay.park sale
                    if (path == 1) {
                        var OrderID;
                        //Call GTM Checkout---------------------------
                        if (process.env.ENVIRONMENT == 'production') {
                            //GTM_oliverOrderComplete()
                        }
                        //trackOliverOrderComplete();
                        //------------------------------------------------
                        localStorage.setItem("ORDER_ID", JSON.stringify(0));
                        if (JSON.parse(localStorage.getItem("user")).display_sale_refund_complete_screen == false) {
                            localStorage.removeItem('PRODUCT');
                            localStorage.removeItem("CART");
                            localStorage.removeItem('CHECKLIST');
                            localStorage.removeItem('AdCusDetail');
                            localStorage.removeItem('CARD_PRODUCT_LIST');
                            localStorage.removeItem("PRODUCTX_DATA");
                            localStorage.removeItem("PENDING_PAYMENTS");
                            // window.location = '/shopview';

                            if (updatedBy == "byExtApp") {
                                setTimeout(() => {
                                    //window.location = '/shopview';
                                }, 1000);
                            }
                            else {
                                ///window.location = '/shopview';          
                            }

                        } else {
                            // localStorage.removeItem("PRODUCTX_DATA");
                            // window.location = '/salecomplete';
                            //history.push('/salecomplete');

                        }
                    } else {
                        localStorage.removeItem("PRODUCTX_DATA");
                        localStorage.removeItem('PRODUCT');
                        localStorage.removeItem("CART");
                        localStorage.removeItem('CHECKLIST');
                        localStorage.removeItem('AdCusDetail');
                        localStorage.removeItem('CARD_PRODUCT_LIST');
                        // window.location = '/shopview';

                        if (updatedBy == "byExtApp") //sending to shopview with app commonAppHandler
                        {
                            // setTimeout(() => {
                            //   window.location = '/shopview';
                            // }, 1000);
                        }
                        else {
                            //window.location = '/shopview';          
                        }
                    }
                }, 500)
                alert('save custmoer order successfully');
            }
            return shop_order;
        });
}