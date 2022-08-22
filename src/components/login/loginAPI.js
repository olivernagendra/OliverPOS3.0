// A mock function to mimic making an async request for data
import {serverRequest} from '../../CommonServiceRequest/serverRequest'
export function loginAPI( parameter) {
  // const res = await fetch('https://fakestoreapi.com/products');
  //   const data = await res.json();
  //   return data;

  return serverRequest.clientServiceRequest('POST', `/account/Login`, parameter)
  .then(userRes => {
      //var data = userRes.content;
      return userRes;
  }).catch(error => {
      return error
  });
}
