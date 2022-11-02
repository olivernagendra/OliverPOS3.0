import { serverRequest } from '../../CommonServiceRequest/serverRequest'

export function getAllAPI(parameter) {
    const d = new Date();
    var time=d.getTime();
    return serverRequest.clientServiceRequest('GET', `/orders/GetPage?pagesize=${parameter.pageSize}&pagenumber=${parameter.pageNumber}&time=${time}`, '')
        .then(activityorderRes => {
            var activities = activityorderRes.content && activityorderRes.content.Records;
            localStorage.setItem("CUSTOMER_TO_ACTVITY", activities && activities[0] && activities[0].order_id)
            localStorage.removeItem('CUSTOMER_TO_OrderId')

        //    console.log("activities",activities)
            return activityorderRes;
        });
}

export function getDetailAPI(ordid, uid) {
    return serverRequest.clientServiceRequest('GET', `/orders/Details?OrderNumber=${ordid}`, '')
        .then(res => { return res})
}

export function deleteDuplicateOrderAPI(ordid) {
    return serverRequest.clientServiceRequest('GET', `/Orders/DeleteSale?OrderId=${ordid}`, '')
        .then(res => { return res})
}

export function getFilteredActivitiesAPI(_filterParameter) {
    return serverRequest.clientServiceRequest('POST', `/orders/GetPage`, _filterParameter)
        .then(activityorderRes => {
            var activities = activityorderRes.content && activityorderRes.content.Records;
            localStorage.setItem("CUSTOMER_TO_ACTVITY", activityorderRes && activityorderRes.content && activityorderRes.content.Records[0].order_id )
            return activities;
        });
}