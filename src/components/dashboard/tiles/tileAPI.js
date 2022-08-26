import {serverRequest} from '../../../CommonServiceRequest/serverRequest'
export function tileAPI( parameter) {
  return serverRequest.clientServiceRequest('GET', `/Favorites/Get?Registerid=${parameter.id}`)
  .then(favList => {
    // localStorage.setItem('UserLocations', JSON.stringify(favList.content));
      return favList;
  }).catch(error => {
      return error
  });
}
