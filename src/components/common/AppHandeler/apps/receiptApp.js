import { postmessage } from "../commonAppHandler";
import { PrintAppData } from '../../commonComponents/PrintAppData'
//Print the app data on the exsting receit
export const DataToReceipt = (RequestData, whereToview, isbackgroudApp) => {
    var clientJSON = ""

    var validationResponse = validateRequest(RequestData)

    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
    }
    else {
        clientJSON = {
            command: RequestData.command,
            version: "1.0",
            method: RequestData.method,
            status: 200,
            error: null
        }

    }
    // const { single_cutomer_list } = this.props
    if (clientJSON !== "") {

        // if(isbackgroudApp==true)
        //   TriggerCallBack("product-detail",clientJSON);
        // else
        postmessage(clientJSON)

        if (validationResponse.isValidationSuccess == false)
            return null;
        else return RequestData;
    }

}
//Print new receipt with app data only
export const PrintReceiptWithAppData = (RequestData, whereToview, isbackgroudApp) => {
    var clientJSON = ""

    var validationResponse = validateRequest(RequestData)

    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
    }
    else {


        clientJSON = {
            command: RequestData.command,
            version: "1.0",
            method: RequestData.method,
            status: 200,
            error: null
        }
        //call print function
        PrintAppData.Print(RequestData);
    }
    // const { single_cutomer_list } = this.props
    if (clientJSON !== "") {
        // if(isbackgroudApp==true)
        //   TriggerCallBack("product-detail",clientJSON);
        // else
        postmessage(clientJSON)
    }

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
    if (RequestData.command.toLowerCase() == ('DataToReceipt').toLowerCase() || RequestData.command.toLowerCase() == ('Receipt').toLowerCase()) {
        if (RequestData && (!RequestData.method || !RequestData.method == 'post')) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        } else if (RequestData && !RequestData.url) {
            isValidationSuccess = false;
            clientJSON['error'] = "Missing Attribute(s)" //GR[3]

        } else if (RequestData && !urlReg.test(RequestData.url)) {
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Value" //GR[5]  
        }

    } else if (RequestData.command == 'ReceiptData') {
        if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        }
        else if (RequestData && (!RequestData.method || !RequestData.method == 'get')) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Method"
        }


    }
    else {// no command found
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Value" //GR[5]          
    }
    return { isValidationSuccess, clientJSON };
}