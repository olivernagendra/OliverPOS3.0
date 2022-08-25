import { serverRequest } from '../../CommonServiceRequest/serverRequest'

export function productCountAPI(udid) {
    return serverRequest.clientServiceRequest('POST', `/product/count?udid=${udid}`)
        .then(countRes => {

            return countRes;
        }).catch(error => {
            return error
        });
}

export function loadProductAPI(udid) {
    return serverRequest.clientServiceRequest('POST', `/product/count?udid=${udid}`)
        .then(countRes => {

            return countRes;
        }).catch(error => {
            return error
        });
}