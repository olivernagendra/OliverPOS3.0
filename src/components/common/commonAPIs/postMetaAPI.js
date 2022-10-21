// A mock function to mimic making an async request for data
import { serverRequest } from '../../../CommonServiceRequest/serverRequest'
export function postMetaAPI(parameter) {
  //var parma = { "Slug": slug, "Value": value };
  return serverRequest.clientServiceRequest('POST', '/postmeta/Save', parameter)
    .then(group => {
      return group;
    }).catch(error => {
      return error
    });
}

export function getPostMetaAPI(slug) {
  return serverRequest.clientServiceRequest('GET', `/postmeta/GetDetail?slug=${slug}`)
    .then(group => {
      return group;
    }).catch(error => {
      return error
    });
}