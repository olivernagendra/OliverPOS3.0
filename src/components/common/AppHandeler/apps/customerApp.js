import { get_UDid } from "../../localSettings";
import { postmessage } from "../commonAppHandler";
import { store } from "../../../../app/store";
import Config from '../../../../Config'
import { customergetPage, customersave, CustomerUpdateSlice } from '../../../customer/CustomerSlice'
import { useDispatch } from "react-redux";


//************ Customer's Apps  handlers*/
export const sendCustomerDetail = (RequestData, isbackgroudApp) => {
    var validationResponse = validateRequest(RequestData)
    if (validationResponse.isValidationSuccess == false) {

        // if(isbackgroudApp==true)
        //   TriggerCallBack("product-detail",validationResponse.clientJSON);
        // else
        postmessage(validationResponse.clientJSON);
    } else {

        var UID = get_UDid('UDID');

        //store.dispatch(customerActions.filteredList(UID, Config.key.CUSTOMER_PAGE_SIZE, RequestData.email))
    }

}

export const HandleCustomer = (RequestData, isbackgroudApp) => {
    const dispatch = useDispatch()
    var clientJSON = ""

    var validationResponse = validateRequest(RequestData)

    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
    }
    else {
        // addExtensionCustomer(RequestData.data);
        var UID = get_UDid('UDID');
        var data = {};
        if (RequestData.data) {
            data['udid'] = UID
            data['WPId'] = ''
            data['FirstName'] = RequestData.data.first_name
            data['LastName'] = RequestData.data.last_name
            data['Contact'] = RequestData.data.phone_number
            data['startAmount'] = 0
            data['Email'] = RequestData.data.email
            data['Pincode'] = RequestData.data.postal_code
            data['City'] = RequestData.data.city
            data['Country'] = RequestData.data.country
            data['State'] = RequestData.data.state
            data['StreetAddress'] = RequestData.data.address_line_one
            data['StreetAddress2'] = RequestData.data.address_line_two
            data['notes'] = RequestData.data.notes
        }
        if (RequestData.method == "post") {
            dispatch(customersave(data, 'create'));
        } else if (RequestData.method == "put") {
            dispatch(CustomerUpdateSlice(data, 'update'));
        } else if (RequestData.method == "delete") {
            var Cust_ID = RequestData.email;
            //dispatch(customerActions.Delete(Cust_ID, UID));
        }


    }
    // const { single_cutomer_list } = this.props
    if (clientJSON !== "") {
        // if(isbackgroudApp==true)
        // TriggerCallBack("product-detail",clientJSON);
        // else
        postmessage(clientJSON)
    }


    // var iframex = document.getElementsByTagName("iframe")[0].contentWindow;
    // var _user = JSON.parse(localStorage.getItem("user"));
    // iframex.postMessage(JSON.stringify(clientJSON), '*');
}

export const CustomerToSale = (RequestData, isbackgroudApp) => {
    const dispatch = useDispatch()
    var clientJSON = ""
    var validationResponse = validateRequest(RequestData)
    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
    }
    else {

        var UID = get_UDid('UDID');
        var data = {};
        if (RequestData.email) {
            data['udid'] = UID
            data['WPId'] = ''
            // data['FirstName']= RequestData.data.first_name &&  RequestData.data.first_name
            // data['LastName']= RequestData.data.last_name && RequestData.data.last_name
            // data['Contact']=  RequestData.data.phone_number && RequestData.data.phone_number
            // data['startAmount']= 0
            data['Email'] = RequestData.email
            // data['Pincode']= RequestData.data.postal_code && RequestData.data.postal_code
            // data['City']= RequestData.data.city && RequestData.data.city
            // data['Country']= RequestData.data.country && RequestData.data.country
            // data['State']= RequestData.data.state && RequestData.data.state     
            // data['StreetAddress'] =RequestData.data.address_line_one && RequestData.data.address_line_one
            // data['StreetAddress2'] = RequestData.data.address_line_two && RequestData.data.address_line_two
            // data['notes'] = RequestData.data.notes && RequestData.data.notes
        }
        if (RequestData.method == "post") {
            var url = '/checkout';
            sessionStorage.setItem("backurl", url);
            // window.location = '/customerview'
            sessionStorage.setItem("handleApps", true);
            dispatch(customersave(data, 'create'));
        }

    }

}
export const retrieveCustomerInSale = (RequestData, isbackgroudApp) => {
    var checkoutList = localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST'));

    var clientJSON = ""
    var notFound = false;
    //missing attributes
    if (checkoutList && (!checkoutList.customerDetail || !checkoutList.customerDetail.content)) {   // if Customer data not found
        clientJSON = {
            command: "CustomerInSale",
            version: "1.0",
            method: "get",
            status: 406,
            error: 'No customer found in sale'
        }

    }
    else {
        var customer = checkoutList.customerDetail.content;
        var address = customer && customer.customerAddress && customer.customerAddress.find(i => (i.TypeName == "billing"))
        //var address= customerAddress && customerAddress.length && customerAddress.length>0 && customerAddress[0]
        clientJSON = {
            command: "CustomerInSale",
            version: "1.0",
            method: "get",
            status: 200,
            data: {
                first_name: customer.FirstName,
                last_name: customer.LastName,
                email: customer.Email,
                address_line_one: address && address.Address1,
                address_line_two: address && address.Address2,
                country: address && address.Country,
                state: address && address.State,
                city: address && address.City,
                postal_code: address && address.PostCode,
                notes: customer.null
            },
            error: null
        }
    }
    // const { single_cutomer_list } = this.props
    if (clientJSON !== "") {
        // if(isbackgroudApp==true)
        // TriggerCallBack("product-detail",clientJSON);
        // else
        postmessage(clientJSON)
    }


}
//** End Customer Handler */

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
    if (RequestData.command.toLowerCase() == 'Customers' || RequestData.command.toLowerCase() == ('CustomerDetails').toLowerCase()) {
        //missing attributes
        if (RequestData && (!RequestData.command || !RequestData.method)) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        }
        else if (RequestData.method == 'get' && !RequestData.email) { //Missing Attribute(s)      
            isValidationSuccess = false;
            clientJSON['error'] = "Missing Attribute(s)" //GR[4]                     
        }
        else if (RequestData.method == 'get' && !(emailReg.test(RequestData.email))) { //invalid Email          
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Value" //GR[4]                     
        }
        else if (RequestData && (RequestData.method == 'put' || RequestData.method == 'delete')) { // main attributes for customer update/delete 
            if (RequestData && !RequestData.email) {
                isValidationSuccess = false;
                clientJSON['error'] = "Missing Attribute(s)" //GR[3]
            }
            else if (RequestData && RequestData.email && (RequestData.email == null || RequestData.email == '')) { // for customer update 
                isValidationSuccess = false;
                clientJSON['error'] = "Missing Value" //GR[6]
            } else if (RequestData && !isNaN(RequestData.email)) { //not a string
                isValidationSuccess = false;
                clientJSON['error'] = "Invalid Data Type" //GR[4]
            }
            else if (!(emailReg.test(RequestData.email))) { //invalid Email          
                isValidationSuccess = false;
                clientJSON['error'] = "Invalid Value" //GR[5]                     
            }
        } else if (RequestData.method == 'put' || RequestData.method == 'post') { //data validations
            if (RequestData && (!RequestData.data || !RequestData.data.email)) { //missing email arribute to add customer
                isValidationSuccess = false;
                clientJSON['error'] = "Invalid Attribute" //GR[1]          
            }
            else if (RequestData && RequestData.data && (RequestData.data.email == null || RequestData.data.email == '')) { // email
                isValidationSuccess = false;
                clientJSON['error'] = "Missing Value" //GR[6]          
            }
            else if (!(emailReg.test(RequestData.data.email))) { //invalid Email          
                isValidationSuccess = false;
                clientJSON['error'] = "Invalid Value" //GR[4]                     
            }

        }

        return { isValidationSuccess, clientJSON };
    } else if (RequestData.command.toLowerCase() == ("CustomerToSale").toLowerCase()) {
        //missing attributes
        if (RequestData && (!RequestData.command || !RequestData.method)) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"

        }
        else if (RequestData && !RequestData.email) { //missing email
            isValidationSuccess = false;
            clientJSON['error'] = "Missing Attribute(s)"
        }
        else if (!(emailReg.test(RequestData.email))) { //invalid Email
            {
                isValidationSuccess = false;
                clientJSON['error'] = "Invalid Value"

            }
        }
        // else if (notFound) {   // if Customer data not found
        //   clientJSON = {
        //     command: "CustomerToSale",
        //     version:"1.0",
        //     method: "get",
        //     status: 406,
        //     error: 'No customer found in sale'    
        //   }

        // }
    }
    else {// no command found
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Value" //GR[5]          
    }
    return { isValidationSuccess, clientJSON };
}