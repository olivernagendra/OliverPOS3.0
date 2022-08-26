// A mock function to mimic making an async request for data
import {serverRequest} from '../../../CommonServiceRequest/serverRequest'
export function categoryAPI( parameter) {
  return serverRequest.clientServiceRequest('GET', `/Category/Get`,'')
  .then(category => {     
      return category;
  }).catch(error => {
      return error
  });
}
