// A mock function to mimic making an async request for data
import {serverRequest} from '../../CommonServiceRequest/serverRequest'
export function taxSettingAPI( parameter) {
  return serverRequest.clientServiceRequest('GET', `/Tax/Privileges`,'')
  .then(taxSetting => {     
      return taxSetting;
  }).catch(error => {
      return error
  });
}
