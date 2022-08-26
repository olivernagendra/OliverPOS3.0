import {serverRequest} from '../../CommonServiceRequest/serverRequest'
export function openRegisterAPI(open_register_param) {
    return serverRequest.clientServiceRequest('POST', `/CashManagement/OpenRegister`, open_register_param)
        .then(result => {
            return result;
        });
}