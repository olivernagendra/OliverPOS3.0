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

export function addTileAPI( parameter) {
  return serverRequest.clientServiceRequest('POST', `/Favorites/Save`,parameter)
  .then(favList => {
      return favList;
  }).catch(error => {
      return error
  });
}
export function deleteTileAPI( parameter) {
  return serverRequest.clientServiceRequest('GET', `/Favorites/Delete?Id=${parameter.favid}`)
  .then(favList => {
      return favList;
  }).catch(error => {
      return error
  });
}

