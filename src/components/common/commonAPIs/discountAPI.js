import { serverRequest } from '../../../CommonServiceRequest/serverRequest';
export function discountAPI() {
    try {
        return serverRequest.clientServiceRequest('GET', `/Discounts/Get`, '')
        .then(discountlst => {
            localStorage.setItem('discountlst', JSON.stringify(discountlst.content))
            return discountlst.content;
        }).catch(error => console.log(error));
    }
    catch (error) {
        console.log(error);
        return error;
    }
}