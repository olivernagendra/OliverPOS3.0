import { serverRequest } from '../../../CommonServiceRequest/serverRequest'


export function productWarehouseQuantityAPI(productId) {

    return serverRequest.clientServiceRequest('GET', `/Product/GetWarehouseQuantity?wpid=${productId}`, '')
        .then(productdetail => {
            return productdetail;
        })
        .catch(error => {
            return error
        });
}

export function updateInventoryAPI(data) {

    return serverRequest.clientServiceRequest('POST', `/Product/UpdateInventory`, { 'wpid': data.wpid, "Quantity": parseInt(data.quantity), "WarehouseId": data.WarehouseId })
        .then(response => {
            return response;
        });
}
function addInventoryQuantity(data) {
    // return serverRequest.clientServiceRequest('GET', `/ShopData/GetUpdateInventory?udid=${data.udid}&wpid=${data.wpid}&quantity=${data.quantity}`, '')


}