// A mock function to mimic making an async request for data
import {serverRequest} from '../../CommonServiceRequest/serverRequest'
export function receiptSettingAPI( parameter) {
  return serverRequest.clientServiceRequest('GET', `/PrintSettings/Get`, '',2)
  .then(receiptSetting => {     
      return receiptSetting;
  }).catch(error => {
      return error
  });
}
