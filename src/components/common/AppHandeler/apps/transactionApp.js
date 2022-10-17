import { postmessage } from "../commonAppHandler";
import { get_UDid } from "../../localSettings";
import { store } from "../../../../app/store";
//app 2.0 implementation------
// *** Payment Detail ***************
export const transactionApp = (RequestData, isbackgroudApp) => {
    var clientJSON = ""

    var validationResponse = validateRequest(RequestData)

    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
        postmessage(clientJSON)
    }
    else {
        if (RequestData.method == 'post')  //for payment through APP
        {
            return 'app_do_transaction'   //on checkoutview, we check this value and process according      
        }
        else if (RequestData.method == 'get') {
            var UID = get_UDid('UDID');

            const state = store.getState();

            var refundPayments = null;

            var orderPayments = localStorage.getItem("oliver_order_payments") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : null;
            if (orderPayments == null) {
                if (state.single_Order_list && state.single_Order_list.items && state.single_Order_list.items.content) {
                    orderPayments = state.single_Order_list.items.content.order_payments;
                    if (state.single_Order_list.items.content.order_Refund_payments) {
                        refundPayments = state.single_Order_list.items.content.order_Refund_payments;
                    }

                }
            }

            var _totalAmount = 0;
            var _payments = []
            if (orderPayments) {

                // All sale payments ---------------------
                orderPayments && orderPayments.map(payment => {

                    var obj = {
                        "processor": payment.type ? payment.type : payment.payment_type,
                        "amount": (payment.amount ? payment.amount : payment.payment_amount) * 100,  // *100 for lowest denomination                      
                        "transaction_type": "sale"
                    }
                    if (payment.transection_id) {
                        obj["transaction_id"] = payment.transection_id;
                    }
                    if (payment.emv_data && payment.emv_data != "") {
                        obj["emv_data"] = payment.emv_data;
                    }

                    _payments.push(obj);
                })
                // // All refund payments ---------------------
                refundPayments && refundPayments.length > 0 && refundPayments.map(payment => {

                    var obj = {
                        "processor": payment.type ? payment.type : payment.payment_type,
                        "amount": (payment.amount ? payment.amount : payment.payment_amount) * 100,
                        "transaction_type": "refund"
                    }
                    if (payment.transection_id) {
                        obj["transaction_id"] = payment.transection_id;
                    }
                    if (payment.emv_data && payment.emv_data != "") {
                        obj["emv_data"] = payment.emv_data;
                    }
                    _payments.push(obj);
                })
                //if request has processor then remove other payment except the processor
                if (RequestData.processor && RequestData.processor !== "") {
                    _payments = _payments.filter(p => p.processor == RequestData.processor)
                }
                //if request has transaction_type then remove other payment except the transaction_type
                if (RequestData.transaction_type && RequestData.transaction_type !== "") {
                    _payments = _payments.filter(p => p.transaction_type == RequestData.transaction_type)
                }

                if (_payments) {
                    _payments && _payments.map(p => {
                        _totalAmount += p.amount;
                    })
                }

            }
            clientJSON = {
                command: RequestData.command,
                version: "2.0",
                method: RequestData.method,
                status: 200,
                error: null,
                data: {
                    total_amount: _totalAmount,
                    payments: _payments ? _payments : []
                }
            }

            postmessage(clientJSON);

        }

    }
}
export const transactionStatus = (RequestData, whereToview, isbackgroudApp) => {
    var clientJSON = ""
    clientJSON = {
        command: RequestData.command,
        version: "2.0",
        method: RequestData.method,
        status: 200,
    }
    var validationResponse = validateRequest(RequestData)

    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
        postmessage(clientJSON)
    }
    else {
        //   if(whereToview=="RefundComplete" /*|| (whereToview=="ActivityView" )*/)
        //   {
        //    // var refund_data =localStorage.getItem("REFUND_DATA") ? JSON.parse(localStorage.getItem("REFUND_DATA")) : [];
        //    const state = store.getState();
        //    if(state.single_Order_list && state.single_Order_list.items && state.single_Order_list.items.content){
        //     var _order= state.single_Order_list.items.content
        //      if(_order){
        //        clientJSON['data']={
        //         transaction_status: _order.order_status,
        //      }
        //      }
        //      //postmessage(clientJSON) ;
        //   }
        // }
        // else
        // {
        //   var tempOrdrId=localStorage.getItem("tempOrder_Id")?JSON.parse(localStorage.getItem("tempOrder_Id")):null ;
        // const { Email } = ActiveUser.key;
        //               var TempOrders = localStorage.getItem(`TempOrders_${Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${Email}`)) : []; if (TempOrders && TempOrders.length > 0) {
        //             var filteredOrder=null;
        //               if(TempOrders && TempOrders.length>0){
        //                 filteredOrder= TempOrders && TempOrders.filter(tOrder=>tOrder.TempOrderID==tempOrdrId)
        //             }   
        if (RequestData.method == 'get') {
            var transStatus = localStorage.getItem("CurrentTransactionStatus") ? JSON.parse(localStorage.getItem("CurrentTransactionStatus")) : "";

            if (transStatus) {
                clientJSON['data'] = { transaction_status: transStatus.status }
            }
            else {
                clientJSON['error'] = "no transaction found"
            }

            // postmessage(clientJSON) ;

        }
        else if (RequestData.method == 'put') {
            if (RequestData.data && RequestData.data.transaction_status == "cancel") {
                return 'app_cancle_transaction'
            }

            // var _orderID=tempOrdrId;
            // if(filteredOrder && filteredOrder.length>0 &&  filteredOrder[0].OrderID !==0){
            //   _orderID= filteredOrder[0].OrderID;
            // }

            //   //setTimeout(() => {
            //       if (tempOrdrId && tempOrdrId !== '' && tempOrdrId > 0) { 
            //           var option = { "udid": get_UDid('UDID'), "orderId": _orderID, "status": RequestData.data.transaction_status }
            //           store.dispatch(checkoutActions.updateOrderStatus(option));    
            //   }
            //  // }, 500);
        }

        // }

        //}
        postmessage(clientJSON);

    }
}
const validateRequest = (RequestData) => {

    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    var urlReg = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;

    var isValidationSuccess = true;
    var clientJSON = {
        command: RequestData.command,
        version: RequestData.version,
        method: RequestData.method,
        status: 406,
    }
    if (RequestData.command.toLowerCase() == ('Transaction').toLowerCase()) {
        if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        }
        if (RequestData.method == 'post') {
            if (RequestData && (RequestData.method &&
                (!RequestData.data || !RequestData.data || !RequestData.data.processor || !RequestData.data.amount || RequestData.data.amount == 0))) { //missing attribut/invalid attribute name
                isValidationSuccess = false;
                clientJSON['error'] = "Missing Attribute(s)"
            }
        }
    }
    else if (RequestData.command.toLowerCase() == ('TransactionStatus').toLowerCase()) {
        if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        }
        if (RequestData.method == 'put') {
            if (RequestData && (RequestData.method &&
                (!RequestData.data || !RequestData.data || !RequestData.data.transaction_status))) { //missing attribut/invalid attribute name
                isValidationSuccess = false;
                clientJSON['error'] = "Invalid Attribute"
            }
        }
    }
    else {// no command found
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Value" //GR[5]          
    }
    return { isValidationSuccess, clientJSON };
}