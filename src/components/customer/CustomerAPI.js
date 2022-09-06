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
                console.log("customer_list",customer_list)
                sessionStorage.setItem("CUSTOMER_ID", customer_list[0].WPId)
            }
           
            return result;
        });
}