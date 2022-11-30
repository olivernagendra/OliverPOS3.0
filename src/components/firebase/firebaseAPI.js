// A mock function to mimic making an async request for data
import { serverRequest } from '../../CommonServiceRequest/serverRequest'
export function sendTokenAPI(token, clientID) {
  try {
    console.log("call service");
    var postParameter = { "ClientId": clientID, "FirbaseDeviceToken": token };
    return serverRequest.clientServiceRequest('POST', '/Firebase/Subscribe', postParameter)
      .then(response => {

        if (response.is_success == true) {

          return response.is_success;
        } else {
          return response.message;
        }
      })
    // .catch(function (error) {
    //     return 'failed';
    // })
  }
  catch (error) {
    console.log(error);
  }
}
export function removeSubscriptionAPI(token) {
  try {
    console.log("call service Unsubscribe");

    return serverRequest.clientServiceRequest('GET', `/Firebase/Unsubscribe?token=${token}`, '')
      .then(response => {

        if (response.is_success == true) {

          return response.is_success;
        } else {
          return response.message;
        }
      })
    // .catch(function (error) {
    //     return 'failed';
    // })
  }
  catch (error) {
    console.log(error);
  }
}
export function registerAccessedAPI(parameters) {
  try {
    console.log("call service");

    return serverRequest.clientServiceRequest('POST', `/Firebase/RegisterAccessed`, parameters)
      .then(response => {

        if (response.is_success == true) {

          return response.is_success;
        } else {
          return response.message;
        }
      })
    // .catch(function (error) {
    //     return 'failed';
    // })
  }
  catch (error) {
    console.log(error);
  }
}
export function pingRegisterAPI(parameters) {
  try {
    console.log("call service");

    return serverRequest.clientServiceRequest('POST', `/Firebase/Ping`, parameters)
      .then(response => {

        if (response.is_success == true) {

          return response.is_success;
        } else {
          return response.message;
        }
      })
    // .catch(function (error) {
    //     return 'failed';
    // })
  }
  catch (error) {
    console.log(error);
  }
}