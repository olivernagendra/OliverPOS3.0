import { serverRequest } from '../../../CommonServiceRequest/serverRequest';
export function updateOrderStatusAPI(shop_order) {
    return serverRequest.clientServiceRequest('POST', `/orders/ChangeStatus`, shop_order)
        .then(shop_order => {
            return shop_order;
        });
}