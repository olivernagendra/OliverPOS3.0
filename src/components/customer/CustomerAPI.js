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