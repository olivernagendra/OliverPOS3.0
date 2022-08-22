// A mock function to mimic making an async request for data
import {serverRequest} from '../../CommonServiceRequest/serverRequest'
export function locationAPI( parameter) {
  return serverRequest.clientServiceRequest('GET', `/Locations/GetAll`, parameter)
  .then(locationsRes => {
    localStorage.setItem('UserLocations', JSON.stringify(locationsRes.content));
      return locationsRes;
  }).catch(error => {
      return error
  });
}
