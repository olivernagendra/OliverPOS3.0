// A mock function to mimic making an async request for data
import {serverRequest} from '../../CommonServiceRequest/serverRequest'
export function registerAPI( parameter) {

  return serverRequest.clientServiceRequest('GET', `/Registers/GetForLocation?id=${parameter.id}`)
  .then(registerRes => {
      return registerRes;
  }).catch(error => {
      return error
  });
}
