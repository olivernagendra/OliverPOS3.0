// A mock function to mimic making an async request for data
import {serverRequest} from '../../../CommonServiceRequest/serverRequest'
export function attributeAPI( parameter) {
  return serverRequest.clientServiceRequest('GET', `/Attributes/Get`,'')
  .then(attribute => {     
      return attribute;
  }).catch(error => {
      return error
  });
}
