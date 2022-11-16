import { serverRequest } from '../../../CommonServiceRequest/serverRequest'

export function getCashRoundingAPI(udid) {
    try {
        return serverRequest.clientServiceRequest('GET', `/orders/GetCashRounding?udid=${udid}`, '')
            .then(cashRes => {
                if (cashRes && cashRes.is_success == true) {
                    localStorage.setItem('CASH_ROUNDING', cashRes.content)
                }
                return cashRes;
            })
            .catch(error => console.log(error));
    }
    catch (error) {
        console.log(error);
    }
}