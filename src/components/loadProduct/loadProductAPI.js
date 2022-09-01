import { serverRequest } from '../../CommonServiceRequest/serverRequest'

export function productCountAPI(udid) {
    return serverRequest.clientServiceRequest('GET', `/product/count?udid=${udid}`)
        .then(countRes => {

            return countRes;
        }).catch(error => {
            return error
        });
}

export function loadProductAPI(parameter) {
    return serverRequest.clientServiceRequest('GET', `/Product/Records?pageNumber=${parameter.pageNumber}&pageSize=${parameter.PageSize}&WarehouseId=${parameter.WarehouseId}}`)

        .then(countRes => {

            return countRes;
        }).catch(error => {
            return error
        });
}