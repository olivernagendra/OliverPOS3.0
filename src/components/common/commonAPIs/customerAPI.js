// A mock function to mimic making an async request for data
import {serverRequest} from '../../../CommonServiceRequest/serverRequest'
export function customerAPI( parameter) {
  return serverRequest.clientServiceRequest('GET', `/customers/GetPage?pageSize=${parameter.pageSize}&pageNumber=${parameter.pageNumber}`,'')
  .then(customer => {     
      return customer;
  }).catch(error => {
      return error
  });
}
