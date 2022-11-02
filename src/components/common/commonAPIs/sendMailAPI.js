// A mock function to mimic making an async request for data
import { serverRequest } from '../../../CommonServiceRequest/serverRequest'
export function sendMailAPI(data) {
    return serverRequest.clientServiceRequest('POST', `/Mail/Send`, data)
        .then(response => {
            return response;
        });
}
export function sendExternalMailAPI(data) {
    return serverRequest.clientServiceRequest('POST', `/Mail/ExternalSend`, data)
        .then(response => {
            return response;
        });
}