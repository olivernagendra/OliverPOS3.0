// A mock function to mimic making an async request for data
import {serverRequest} from '../../../CommonServiceRequest/serverRequest'
export function groupAPI( parameter) {
  return serverRequest.clientServiceRequest('GET', `/TableRecord/GetAll?LocationId=${parameter.locationId}&groupname=${parameter.group_sales}`,'')
  .then(group => {     
      return group;
  }).catch(error => {
      return error
  });
}
