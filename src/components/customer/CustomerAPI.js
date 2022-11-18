import { serverRequest } from '../../CommonServiceRequest/serverRequest'
import Config from '../../Config';
import ActiveUser from '../../settings/ActiveUser';
import { get_UDid } from '../common/localSettings';
export function saveAPI(customer) {
    return serverRequest.clientServiceRequest('POST', `/customers/Save`, customer)
        .then(res => {
            return res
        })
}

export function updateAPI(customer) {
    return serverRequest.clientServiceRequest('POST', `/customers/Update`, customer)
        .then(res => {
            return res
        })
}

export function getDetailAPI(id, uid) {
    return serverRequest.clientServiceRequest('GET', `/Customers/Details?wpid=${id}`, '')
        .then(singleList => {
            return singleList;
        })
}


export function getPageAPI(parameter) {
    var customer_list = [];
    return serverRequest.clientServiceRequest('GET', `/customers/GetPage?pageSize=${parameter.pageSize}&pageNumber=${parameter.pageNumber}`, '')
        .then(result => {
            var new_list = result && result.content;
            if (new_list && new_list.Records && new_list.Records.length > 0) {
                new_list.Records.map(item => {
                    if (item.WPId !== "" && item.WPId !== 0) {
                        customer_list.push(item)
                    }
                })
               // console.log("result",result)
                result.content['Records'] = customer_list;
                //console.log("customer_list[0].WPId",customer_list[0].WPId)
                sessionStorage.setItem("CUSTOMER_ID", customer_list[0].WPId)
            }

            return result;
        });
}


export function getAllEventsAPi(id, uid) {
    var param = {
        wpid: id,
        Udid: uid
    }
    return serverRequest.clientServiceRequest('POST', `/Customers/GetCustomerEvents`, param)
        .then(singleList => {
            return singleList;
        })
}

export function updateCustomerNoteAPI(data) {
    return serverRequest.clientServiceRequest('POST', `/customers/SaveNote`, data)
        .then(res => {
            return res
        })
}
export function deleteCustomerNoteAPI(order_id) {
    return serverRequest.clientServiceRequest('POST', `/customers/DeleteNote?Id=${order_id}`)
        .then(res => {
            return res
        })
}

export function updateCreditScoreAPI(parameter) {

    return serverRequest.clientServiceRequest('POST', `/customers/AdjustStoreCredit`, parameter)
        .then(res => {
            return res
        })
}

export function saveCustomerToTempOrderAPI(order_id, email_id) {
    var notificationLimit = Config.key.NOTIFICATION_LIMIT;
    return serverRequest.clientServiceRequest('GET', `/orders/SaveCustomerInTempOrder?OrderId=${order_id}&CustomerEmail=${email_id}`, '')
        .then(response => {
            var _status = "true";
            var _emailSend = true;
            // Add Customer order success ------------------------------------
            var TempOrders = localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`)) : [];
            if (TempOrders && TempOrders.length > 0) {
                if (TempOrders.length > notificationLimit) {
                    TempOrders.splice(0, 1);
                }
                TempOrders.map(ele => {
                    if (ele.TempOrderID == order_id && ele.new_customer_email !== "") {
                        ele.Status = _status;
                        ele.isCustomerEmail_send = _emailSend;
                        ele.Sync_Count = ele.Sync_Count + 1
                        //  recheckTempOrderSync(udid,ele.TempOrderID)                                
                    }
                })
                localStorage.setItem(`TempOrders_${ActiveUser.key.Email}`, JSON.stringify(TempOrders))
            }
            //--------------------------------------------------------------
            return response;
        }
        );
}

export function getCountryListAPI() {
    var UID = get_UDid('UDID');
    //Added by Aatifa 15/7/2020
    try {
        return serverRequest.clientServiceRequest('GET', `/Country/Get`, '')
            .then(countrylist => {
                return countrylist;
            })
            .catch(error => {
                return error
            });
    }
    catch (error) {
        console.log(error);
    }
}

export function getStateListAPI() {
    var UID = get_UDid('UDID');
    try {
        return serverRequest.clientServiceRequest('GET', `/States/Get`, '')
            .then(statelist => {
                return statelist;
            })
            .catch(error => {
                return error
            });
    }
    catch (error) {
        console.log(error)
    }
}