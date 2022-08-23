// A mock function to mimic making an async request for data
import {serverRequest} from '../../CommonServiceRequest/serverRequest'
export function pinAPI( parameter) {

  return serverRequest.clientServiceRequest('GET', `/account/VerifyPin?udid=` + parameter.UDID + '&pin=' + parameter.pin + '&userid=' + parameter.userid)
  .then(userRes => {    
      return userRes;
  }).catch(error => {
      return error
  });
}
export function createPinAPI( parameter) {

  return serverRequest.clientServiceRequest('POST', `/Users/RegisterPinReset`, parameter)
  .then(userRes => {    
      return userRes;
  }).catch(error => {
      return error
  });
}
