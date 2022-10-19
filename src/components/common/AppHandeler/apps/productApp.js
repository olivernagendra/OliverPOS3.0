import { postmessage } from "../commonAppHandler";
import { PrintAppData } from '../../commonComponents/PrintAppData'
import { useIndexedDB } from "react-indexed-db";

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

export function RawProductData(RequestData, isbackgroudApp) {
    const { getByID: getProductByID, getAll: getAllProducts } = useIndexedDB("products");
    var clientJSON = ""
    var validationResponse = validateRequest(RequestData)

    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
        postmessage(clientJSON)
    }
    else {
        clientJSON = {
            command: RequestData.command,
            version: "1.0",
            method: RequestData.method,
        }
        var item = getProductByID(RequestData.product_id).then((row) => {
            return row;
        });
        if (!item) {
            clientJSON['status'] = 406;
            clientJSON['error'] = 'No data found'

        } else {
            clientJSON['status'] = 200;
            clientJSON['error'] = null;
            clientJSON['data'] = JSON.stringify(item);
        }
        postmessage(clientJSON)
    }
    // var idbKeyval = FetchIndexDB.fetchIndexDb();
    //   idbKeyval.get('ProductList').then(val => {
    //     if (!val || val.length == 0 || val == null || val == "") {
    //       //do nothing

    //     }
    //     else {
    //       var item = val.find(item => (item.WPID == RequestData.product_id))
    //       console.log("item", item)
    //       clientJSON = {
    //         command: RequestData.command,
    //         version: "1.0",
    //         method: RequestData.method,
    //       }
    //       if (!item) {
    //         clientJSON['status'] = 406;
    //         clientJSON['error'] = 'No data found'

    //       } else {
    //         clientJSON['status'] = 200;
    //         clientJSON['error'] = null;
    //         clientJSON['data'] = JSON.stringify(item);
    //       }
    //       postmessage(clientJSON)

    //     }
    //   });

    // }

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
