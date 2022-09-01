// A mock function to mimic making an async request for data
import { serverRequest } from '../../CommonServiceRequest/serverRequest'
export function loginAPI(parameter) {
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


// External Login API 

export function OliverExternalLogin(externalLoginParam) {
    return serverRequest.clientServiceRequest('POST', '/account/LoginExternaly', externalLoginParam)
        .then(response => {
            console.log('OliverExternalLogin services respons--', response);
            if (response) {
                return response;
            }
        }).catch(function (error) {
            console.log(error);
            return 'Unable to fetch';
        })
}


export function GetUserProfile(profileGetParam) {
    var requestOptions = {
        method: 'GET',
        // headers: {
        //     "access-control-allow-origin": "*",
        //     "access-control-allow-credentials": "true",
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json',
        // }
        mode: 'cors',
    };
    return fetch(`https://people.googleapis.com/v1/people/${profileGetParam.userId}/?personFields=ageRanges,names,photos,addresses,locations,birthdays,genders,phoneNumbers,metadata&alt=json&access_token=${profileGetParam.access_token}`)
        // .then(response => {
        //     console.log('---res----', response);
        //     return response
        // })
        // .then(handleResponse)
        .then(profileInfo => {
            console.log('--------service -Res--', profileInfo);
            return profileInfo;
        })
        .catch(function (error) {
            console.log(error);
            return 'Unable to get';
        })
}