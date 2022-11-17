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


export function GetOpenRegisterAPI(RegisterId) {
    //console.log("Servicecall",RegisterId);
    // console.log("Param", RegisterId)
    return serverRequest.clientServiceRequest('GET', `/CashManagement/GetOpenRegister?registerId=${RegisterId}&salesPersonId=''`, '')
        .then(cashRegister => {
            console.log("cashDetail", cashRegister);
            if(cashRegister.content && cashRegister.content !=='' && cashRegister.content !==0){
                localStorage.setItem("IsCashDrawerOpen","true");
                localStorage.setItem("Cash_Management_ID",cashRegister.content.Id);                  
             }else{
                 localStorage.setItem("IsCashDrawerOpen","false");
                 localStorage.removeItem("Cash_Management_ID");
             }

            return cashRegister;
        })
}

export function addRemoveCashAPI(addRemoveCashParm) {

    return serverRequest.clientServiceRequest('POST', `/CashManagement/AddRemoveCash`, addRemoveCashParm)
        .then(result => {
            return result;
        });
}


export function addPaymentListLogAPI(PaymentLogs) {
    return serverRequest.clientServiceRequest('POST', `/CashManagement/addPaymentListLog`, PaymentLogs)
        .then(result => {
            return result;
        });
}