import { serverRequest } from '../../CommonServiceRequest/serverRequest'
import { useIndexedDB } from 'react-indexed-db';

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

//updateOrderProductDB

export function UpdateProductInventoryDBAPI(productIds) {
    const { update, getByID } = useIndexedDB("products");
    var WarehouseId = localStorage.getItem("WarehouseId") ? parseInt(localStorage.getItem("WarehouseId")) : 0
    return serverRequest.clientServiceRequest('POST', `/Product/Inventories`, { "wpids": productIds, "WarehouseId": WarehouseId })
        .then(qtyList => {
            var quantityList = qtyList.content;
            quantityList && quantityList.map(prodQty => {
                getByID(prodQty.WPID).then((product) => {
                    product['StockQuantity'] = prodQty.Quantity;
                    update(product).then(() => {
                        console.log("---updated product---" + product.StockQuantity);
                    });
                });
            })
            return 'Success';
        });

}
