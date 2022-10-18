import { postmessage } from "../commonAppHandler";
import { PrintAppData } from '../../commonComponents/PrintAppData'

export const productPriceUpdate = (RequestData, isbackgroudApp, whereToview) => {
    var clientJSON = ""

    var validationResponse = validateRequest(RequestData)
    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
    }
    if (RequestData.method == 'post') {
        return "product_price_update"
    }

}
export const sendProductQuantity = (RequestData, isbackgroudApp, whereToview) => {
    var clientJSON = ""

    // var validationResponse = validateRequest(RequestData)
    // if (validationResponse.isValidationSuccess == false) {
    //   clientJSON = validationResponse.clientJSON;
    // }
    // if(RequestData.method=='post'){
    //    return "product_price_update" 
    // }     
    clientJSON = {
        command: RequestData.command,
        method: RequestData.method,
        version: "1.0",
        status_code: 200,
        quantity: RequestData.quantity
    }
    postmessage(clientJSON);
}
const validateRequest = (RequestData) => {

    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    var urlReg = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;

    var isValidationSuccess = true;
    var clientJSON = {
        command: RequestData.command,
        version: RequestData.version,
        method: RequestData.method,
        status: 406,
    }
    if (RequestData.command.toLowerCase() == ('productPriceUpdate').toLowerCase()) {
        if (RequestData && (!RequestData.method || !RequestData.method == 'post')) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        }
    }
    else {// no command found
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Value" //GR[5]          
    }
    return { isValidationSuccess, clientJSON };
}