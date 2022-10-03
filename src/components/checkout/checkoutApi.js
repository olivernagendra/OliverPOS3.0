// A mock function to mimic making an async request for data
import { serverRequest } from '../../CommonServiceRequest/serverRequest'
import { get_UDid } from '../common/localSettings';

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