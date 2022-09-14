// A mock function to mimic making an async request for data
import { serverRequest } from '../../../CommonServiceRequest/serverRequest'
export function userListAPI() {
    return serverRequest.clientServiceRequest('GET', `/users/GetUsers`, '')
        .then(user => {
            if (user && user.content) { localStorage.setItem('user_List', JSON.stringify(user.content)); }
            return user;
        }).catch(error => {
            return error
        });
}
