import { serverRequest } from '../../CommonServiceRequest/serverRequest';
import { addPaymentListLog } from '../../components/cashmanagement/CashmanagementSlice';
import Config from '../../Config';
import moment from 'moment';
import { store } from '../../app/store';
import { UpdateProductInventoryDB } from '../loadProduct/loadProductSlice';
// import { postMeta } from '../common/commonAPIs/postMetaSlice';
export function refundOrderAPI(data) {
    var CurrentUserActive = localStorage.getItem('user') ? (JSON.parse(localStorage.getItem('user'))) : '';
    return serverRequest.clientServiceRequest('POST', `/orders/Refund`, data)
        .then(
            // refundOrderResponse => dispatch(success( refundOrderResponse )),  
            refundOrderResponse => {
                //update Refund qty for product......................

                var productIds = [];
                data && data.RefundItems && data.RefundItems.map(value => {
                    var pid = value.product_id;//.variation_id == 0 ? value.product_id : value.variation_id ? value.variation_id : value.WPID
                    if (pid != 0) { productIds.push(pid) }
                })
                if (productIds.length > 0) { store.dispatch(UpdateProductInventoryDB(productIds)) }

                //---------------------------------------------------- 
                var TempOrders = [];
                if (localStorage.getItem(`TempOrders_${CurrentUserActive && CurrentUserActive.user_email}`)) {
                    TempOrders = JSON.parse(localStorage.getItem(`TempOrders_${CurrentUserActive && CurrentUserActive.user_email}`));
                }
                var orderDetails = localStorage.getItem('getorder') && JSON.parse(localStorage.getItem('getorder'))
                var reciptId = orderDetails && orderDetails.OliverReciptId
                localStorage.setItem('tempOrder_Id', JSON.stringify(reciptId));
                TempOrders.push({ "TempOrderID": reciptId, "Status": "true", "Index": TempOrders.length, "OrderID": refundOrderResponse.content, 'order_status': 'refunded', 'date': moment().format(Config.key.NOTIFICATION_FORMAT), 'order_status_DB': data.status });
                localStorage.setItem(`TempOrders_${CurrentUserActive && CurrentUserActive.user_email}`, JSON.stringify(TempOrders));

                //Saving post meta for Pay_by_Product
                //    if (localStorage.getItem("paybyproduct")) {
                //     var _tempOrder_Id = reciptId;
                //     var parma = { "Slug": _tempOrder_Id + "_paybyproduct_refund", "Value": localStorage.getItem("paybyproduct"), "Id": 0, "IsDeleted": 0 };
                //     store.dispatch(postMeta(parma));
                //     setTimeout(() => {
                //         localStorage.removeItem("paybyproduct");
                //         localStorage.removeItem("paybyproduct_unpaid");
                //     }, 100);
                //     }
                if (refundOrderResponse.is_success === true) {
                    setTimeout(function () {
                        localStorage.setItem("REFUND_DATA", JSON.stringify(data))
                        try {
                            var d = new Date();
                            var refundPayments = localStorage.getItem("REFUND_DATA") ? JSON.parse(localStorage.getItem("REFUND_DATA")) : "";
                            // console.log('refundPayments', refundPayments)
                            var cashmanagementID = localStorage.getItem("Cash_Management_ID")
                            var dateStringWithTime = moment(d).format('YYYY-MM-DD HH:mm:ss Z');
                            var getLocalTimeZoneOffsetValue = d.getTimezoneOffset();
                            var localTimeZoneType = moment.tz.guess(true);
                            var user = JSON.parse(localStorage.getItem("user"));

                            var refundLog = [];
                            var refundPaymentStatus = {}
                            if (refundPayments && refundPayments.order_refund_payments && refundPayments.order_refund_payments.length) {

                                refundPayments.order_refund_payments.map(item => {
                                    refundPaymentStatus = { "paymentType": item.payment_type, "status": "completed" }
                                    refundLog.push({
                                        CashManagementId: cashmanagementID,
                                        AmountIn: 0,
                                        AmountOut: item.amount,
                                        LocalDateTime: dateStringWithTime,
                                        LocalTimeZoneType: localTimeZoneType,
                                        TimeZoneOffsetValue: getLocalTimeZoneOffsetValue,
                                        SalePersonId: user && user.user_id ? user.user_id : '',
                                        SalePersonName: user && user.display_name ? user.display_name : '',
                                        SalePersonEmail: user && user.user_email ? user.user_email : '',
                                        OliverPOSReciptId: refundPayments && refundPayments.order_id,
                                        PaymentTypeName: item.payment_type,
                                        PaymentTypeSlug: item.payment_type,
                                        EODReconcilliation: true,
                                        Notes: ''
                                    }
                                    )
                                })
                                // console.log("refundLog",refundLog)

                                var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                                // if(demoUser){                   
                                //     GTM_OliverDemoUser("Refund: Adding refund payment list")
                                // }
                                // set the current trnasaction status, Used for APP Command "TransactionStatus"
                                localStorage.setItem("CurrentTransactionStatus", JSON.stringify(refundPaymentStatus))
                                store.dispatch(addPaymentListLog(refundLog));
                            }
                            //----------------------------------------------------------

                        } catch (error) {
                            console.log("cashManagementLog Error", error)
                            localStorage.setItem("CurrentTransactionStatus", JSON.stringify({ "paymentType": "", "status": "cancelled" }))
                        }
                    }, 1000)
                }

                // myFunction(refundOrderResponse.Message),
                //dispatch(failure(refundOrderResponse))
                // error => dispatch(failure(error.toString()))
                return refundOrderResponse;
            });



}