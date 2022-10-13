import {serverRequest} from '../../../../CommonServiceRequest/serverRequest'


export function make_payconiq_paymentAPI (requestParam) {
    return serverRequest.clientServiceRequest('POST', `/UPIPayment/RunTransaction`, requestParam)
        .then(res => {
            return res
        })
        .catch(error => {
            return { "is_success": false, "message": error !== "" && error.Message ? error.Message : 'An error has occurred.' }
        })
}
export function check_payconiq_pay_statusAPI (sessionId) {
    return serverRequest.clientServiceRequest('GET', `/UPIPayment/GetStatus?_S=${sessionId}`, '')
        .then(res => {
            return res
        })
        .catch(error => {
            return { "is_success": false, "message": error !== "" && error.Message ? error.Message : 'An error has occurred.' }
        })
}
export function cancel_payconiq_paymentAPI (data) {
    return serverRequest.clientServiceRequest('POST', `/UPIPayment/CancelPayment`, data)
        .then(res => {
            return res
        })
        .catch(error => {
            return { "is_success": false, "message": error !== "" && error.Message ? error.Message : 'An error has occurred.' }
        })
}