import {serverRequest} from '../../../CommonServiceRequest/serverRequest'

export function getCloudPrintersAPI(locationId) {
    try {
        return serverRequest.clientServiceRequest('GET', `/CloudPrinter/GetPrinterByLocation?id=${locationId}`, '')
            .then(cloudPrinters => {
                if(cloudPrinters && cloudPrinters.is_success == true && cloudPrinters.content ){
                    localStorage.setItem("cloudPrinters", JSON.stringify(cloudPrinters.content));
                }
                return cloudPrinters;
            }).catch(error => {
                return error
            });
    }
    catch (error) {
        return error
    }
}

export function sendOrderToCloudPrinterAPI(data) {
    try {
        var param = {}
        if (data.type == 'activity' || data.type == 'refundComplete') {
            param = {
                printerIds : data.printerId,
                OrderNumber : data.orderId
            }
        }
        else{
             param = {
                printerIds : data.printerId,
                OliverRecieptId : data.orderId
            }
        }
        var url = data.type == 'activity' || data.type == 'refundComplete'  ? `/CloudPrinter/OrderPrint`
            : data.type == 'saleComplete' ? `/CloudPrinter/TempOrderPrint` : ''

        return serverRequest.clientServiceRequest('POST', url, param)
            .then(response => {
                return response;
            }).catch(error => {
                return error
            });;
    }
    catch (error) {
        return error
    }
}