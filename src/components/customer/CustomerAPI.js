import {serverRequest} from '../../CommonServiceRequest/serverRequest'

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
            if (new_list && new_list.Records && new_list.Records.length>0) {
                new_list.Records.map(item => {
                    if (item.WPId !== "" && item.WPId !== 0) {
                        customer_list.push(item)
                    }
                })
                result.content['Records'] = customer_list;
                //console.log("customer_list[0].WPId",customer_list[0].WPId)
                sessionStorage.setItem("CUSTOMER_ID", customer_list[0].WPId)
            }
           
            return result;
        });
}


export function getAllEventsAPi(id, uid) {
    var param = {
        wpid : id,
        Udid:uid
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

export function updateCreditScoreAPI(CustomerWpid, AddPoint, DeductPoint, Notes, Udid) {

    return serverRequest.clientServiceRequest('POST', `/customers/AdjustStoreCredit`, {
        "CustomerWpid": CustomerWpid,
        "AddPoint": AddPoint,
        "DeductPoint": DeductPoint,
        "Notes": Notes,
        "Udid": Udid,
    })
        .then(res => {
            return res
        })
}