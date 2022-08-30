import {serverRequest} from '../../CommonServiceRequest/serverRequest'


export function cashRecordsAPI(parameter) {

    return serverRequest.clientServiceRequest('GET', `/CashManagement/Records?registerId=${parameter.registerId}&pageSize=${parameter.pageSize}&pageNumber=${parameter.pageNumber}`, '')
        .then(singleCashDrawerList => {
            return singleCashDrawerList;
        }).catch(error => {
            return error
        })
}

export function getDetailsAPI(cashManagementId) {

    return serverRequest.clientServiceRequest('GET', `/CashManagement/GetDetail?id=${cashManagementId}`, '')
        .then(cashDetail => {
            return cashDetail;
        })
}
export function getSummeryAPI(CashManagementId, RegisterId, LoggenInUserId) {

    return serverRequest.clientServiceRequest('GET', `/CashManagement/GetSummery?id=${CashManagementId}&registerId=${RegisterId}&salesPersonId=${LoggenInUserId}`, '')
        .then(cashDetail => {
            return cashDetail;
        })
}

export function openRegisterAPI(open_register_param) {
    return serverRequest.clientServiceRequest('POST', `/CashManagement/OpenRegister`, open_register_param)
        .then(result => {
            return result;
        });
}

export function closeRegisterAPI(closeRegisterParm) {
    return serverRequest.clientServiceRequest('POST', `/CashManagement/CloseRegister`, closeRegisterParm)

        .then(result => {
            return result;
        });
}
export function SaveClosingNoteAPI(prameters) {

    return serverRequest.clientServiceRequest('POST', `/CashManagement/SaveClosingNote`, prameters)
        .then(result => {
            return result;
        });
}

