import { postmessage } from "../commonAppHandler";
export const lockEnvironment = (RequestData, isbackgroudApp, whereToview) => {
    var clientJSON = ""

    var validationResponse = validateRequest(RequestData)
    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
    } else {

        clientJSON = {
            command: RequestData.command,
            method: RequestData.method,
            version: "1.0",
            status_code: 200,
            error: null
        }


    }

    if (RequestData.method == 'get') {
        return "app-get-lock-env"
    }
    else {
        postmessage(clientJSON);
        if (RequestData.state == 'lock')
            return "app-modificaiton-lock-env"
        else
            return "app-modificaiton-unlock-env"

    }
}
export const Environment = (RequestData, isbackgroudApp, whereToview) => {
    var clientJSON = ""

    var validationResponse = validateRequest(RequestData)
    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
    } else {

        clientJSON = {
            command: RequestData.command,
            method: RequestData.method,
            version: "1.0",
            status_code: 200,
            error: null,
            note_id: RequestData.note_id
        }

        var registerId = localStorage.getItem('register') ? localStorage.getItem('register') : null;
        var registerName = localStorage.getItem('registerName') ? localStorage.getItem('registerName') : null;
        var locationId = localStorage.getItem('Location') ? localStorage.getItem('Location') : null;
        var LocationName = localStorage.getItem('LocationName') ? localStorage.getItem('LocationName') : null;

        var clientDetails = localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")) : null;
        var pdf_format = localStorage.getItem("pdf_format") ? JSON.parse(localStorage.getItem("pdf_format")) : null;
        clientJSON['Print_size'] = pdf_format && pdf_format.length > 0 && pdf_format[0].recipt_format_value;
        clientJSON['register_id'] = registerId;
        clientJSON['location_data'] = { location_id: locationId, outlet: LocationName }
        clientJSON['employee_data'] = {
            admin_id: clientDetails && clientDetails.user_id,
            designation: clientDetails && clientDetails.user_role
        }
    }
    postmessage(clientJSON)

}
export const sendClientsDetails = (RequestData) => {
    var validationResponse = validateRequest(RequestData)
    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
        postmessage(clientJSON)
    }
    else {
        var clientDetails = localStorage.getItem('clientDetail') ? JSON.parse(localStorage.getItem('clientDetail')) : 0
        var guid = clientDetails && clientDetails.subscription_detail ? clientDetails.subscription_detail.client_guid : '';
        var account_type = clientDetails && clientDetails.subscription_detail ? clientDetails.subscription_detail.subscription_name : '';
        var store_url = clientDetails && clientDetails.subscription_detail ? clientDetails.subscription_detail.url : '';
        var business_name = clientDetails && clientDetails.subscription_detail ? clientDetails.subscription_detail.company_name : '';
        var account_monthly_price = clientDetails && clientDetails.subscription_detail ? clientDetails.subscription_detail.MonthlyPrice : ''
        var email = clientDetails && clientDetails.user_email ? clientDetails.user_email : ''
        var currency = clientDetails && clientDetails.currency ? clientDetails.currency : '';
        var account_creation_date = clientDetails && clientDetails.register_unix_date ? clientDetails.register_unix_date : '';

        var clientJSON =
        {
            oliverpos:
            {
                command: RequestData.command,
                method: RequestData.method,
                version: "2.0",
                status: 200,
            },
            data:
            {
                guid: guid,
                account_creation_date: account_creation_date,
                account_type: account_type,
                account_monthly_price: account_monthly_price,
                store_url: store_url,
                email: email,
                currency: currency,
                business_name: business_name
            }
        };
        postmessage(clientJSON);
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
    if (RequestData.command.toLowerCase() == ('lockEnvironment').toLowerCase()) {
        if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        }
        else if (RequestData && (RequestData.method == 'post' || RequestData.method == 'get')) {
            if (RequestData && RequestData && (RequestData.command == null || RequestData.command == '')) {
                isValidationSuccess = false;
                clientJSON['error'] = "Invalid Command" //GR[2]
            }
            else if (RequestData && RequestData && RequestData.method == 'post' && (RequestData.state == null || RequestData.state == '')) {
                isValidationSuccess = false;
                clientJSON['error'] = "Missing Attribute - State" //GR[4]
            }
        }
    }
    else if (RequestData.command.toLowerCase() == ('Environment').toLowerCase()) {
        if (RequestData && (!RequestData.method || !RequestData.method == 'get')) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        }
    }
    else if (RequestData.command.toLowerCase() == ('ClientInfo').toLowerCase()) {
        //missing attributes
        if (RequestData && (!RequestData.command || !RequestData.method || RequestData.method != 'get')) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        }
        else if (RequestData && (RequestData.method == 'get')) { // main attributes for customer update/delete 
            if (RequestData.method == "") {
                isValidationSuccess = false;
                clientJSON['error'] = "Missing Attribute(s)" //GR[3]
            }

        }
    }
    else {// no command found
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Value" //GR[5]          
    }
    return { isValidationSuccess, clientJSON };
}