// A mock function to mimic making an async request for data
import {serverRequest} from '../../CommonServiceRequest/serverRequest'
export function registerAPI( parameter) {
  // const res = await fetch('https://fakestoreapi.com/products');
  //   const data = await res.json();
  //   return data;

  return serverRequest.clientServiceRequest('GET', `/Registers/GetForLocation`, parameter)
  .then(locationsRes => {
    localStorage.setItem('UserLocations', JSON.stringify(locationsRes.content));
      return locationsRes;
  }).catch(error => {
      return error
  });
}
