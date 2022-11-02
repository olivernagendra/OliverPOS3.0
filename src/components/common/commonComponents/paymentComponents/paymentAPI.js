import { serverRequest } from '../../../../CommonServiceRequest/serverRequest'


export function make_payconiq_paymentAPI(requestParam) {
    return serverRequest.clientServiceRequest('POST', `/UPIPayment/RunTransaction`, requestParam)
        .then(payconiq_payment => {
            if (payconiq_payment && payconiq_payment.is_success) {
                var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                if (demoUser) {
                    //GTM_OliverDemoUser("ShopView: Add Tile to Favourite")
                }
                // localStorage.setItem('PAYCONIQ_PAYMENT_RESPONSE', JSON.stringify(payconiq_payment));
                // dispatch(success(payconiq_payment));
                return payconiq_payment;
            }
            else if (payconiq_payment && payconiq_payment.is_success == false) {
                // dispatch(failure(payconiq_payment.message));
                return payconiq_payment;
            }
        },
            error => {
                return error.toString();
                // dispatch(failure(error.toString()));
            })
        .catch(error => {
            return { "is_success": false, "message": error !== "" && error.Message ? error.Message : 'An error has occurred.' }
        })
}
export function check_payconiq_pay_statusAPI(sessionId) {
    return serverRequest.clientServiceRequest('GET', `/UPIPayment/GetStatus?_S=${sessionId}`, '')
        .then(payconiq_status => {
            if (payconiq_status && payconiq_status.is_success) {
                if (payconiq_status.content && payconiq_status.content.RefrenceID && payconiq_status.content.Status == 'SUCCEEDED') {
                    localStorage.setItem('PAYCONIQ_PAYMENT_RESPONSE', JSON.stringify(payconiq_status));
                    localStorage.setItem('PAYMENT_RESPONSE', JSON.stringify(payconiq_status));
                }
                return payconiq_status;
                //dispatch(success(payconiq_status));
            } else if (payconiq_status && payconiq_status.is_success == false) {
                return payconiq_status;
                //dispatch(failure(payconiq_status.message));
            }
        },
            error => {
                return error.toString();
                //dispatch(failure(error.toString()));
            })
        .catch(error => {
            return { "is_success": false, "message": error !== "" && error.Message ? error.Message : 'An error has occurred.' }
        })
}
export function cancel_payconiq_paymentAPI(data) {
    return serverRequest.clientServiceRequest('POST', `/UPIPayment/CancelPayment`, data)
        .then(payconiq_cancel_res => {
            if (payconiq_cancel_res && payconiq_cancel_res.is_success) {
                return payconiq_cancel_res;
                // dispatch(success(payconiq_cancel_res));
            } else if (payconiq_cancel_res && payconiq_cancel_res.is_success == false) {
                return payconiq_cancel_res;
                // dispatch(failure(payconiq_cancel_res.message));
            }
        },
            error => {
                return error.toString();
                //dispatch(failure(error.toString()));
            })
        .catch(error => {
            return { "is_success": false, "message": error !== "" && error.Message ? error.Message : 'An error has occurred.' }
        })
}