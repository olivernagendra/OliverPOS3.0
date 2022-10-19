import { get_UDid } from '../../common/localSettings';
//import { customerActions } from "../CustomerPage";
//import { history, store } from "../_helpers";
import { store } from '../../../app/store'
import Config from '../../../Config'
//import { PrintAppData } from "../_components/PrintAppData";
//import { TriggerCallBack } from '../appManager/FramManager'
import { isMobileOnly, isIOS } from "react-device-detect";
//import { activityActions } from "../ActivityPage";
//import FetchIndexDB from "../settings/FetchIndexDB";
//import { cartProductActions } from "../_actions";
//import { checkoutActions } from "../CheckoutPage";
import { changeTaxRate, getInclusiveTaxType, getTaxAllProduct, PrintPage } from "../../../settings";
import ActiveUser from '../../../settings/ActiveUser';
//import { serverRequest } from "../CommonServiceRequest/serverRequest";
//import { TaxSetting } from "../_components/TaxSetting";
//import moment from 'moment';
//import { checkOrderStatus } from '../_components/CommonJS';

import {
  DataToReceipt, PrintReceiptWithAppData,
  handleCartValue, handleCart,
  sendCustomerDetail, HandleCustomer, CustomerToSale, retrieveCustomerInSale,
  addCartDiscount, cartTaxes, Notes, lockEnvironment, Environment, doParkSale,
  getOrderStatus, sendClientsDetails, doCustomFee, getReceiptData, addDiscountCoupon,
  transactionApp, transactionStatus, DoParkSale, AddProductToCart, payfromApp
} from './apps';
import { productPriceUpdate, sendProductQuantity } from './apps/productApp';
import { updateRecentUsedApp } from '../commonFunctions/appDisplayFunction';
// var JsBarcode = require('jsbarcode');
// var print_bar_code;
// export const textToBase64Barcode = (text) => {
//   var canvas = document.createElement("canvas");
//   JsBarcode(canvas, text, {
//     format: "CODE39", displayValue: false, width: 1,
//     height: 30,
//   });
//   print_bar_code = canvas.toDataURL("image/png");
//   return print_bar_code;
// }

export const handleAppEvent = (value, whereToview, isbackgroudApp = false,navigate=null) => {
  console.log("value", value)

  var jsonMsg = value ? value : '';
  var clientEvent = jsonMsg && jsonMsg !== '' && jsonMsg.command ? jsonMsg.command.toLowerCase() : '';
  console.log("jsonMsg", jsonMsg)
  console.log("clientEvent", clientEvent)
  var appResponse = '';


  if (clientEvent && clientEvent !== '') {
    // console.log("clientEvent", jsonMsg)
    //this.setState({ showNewAppExtension:true})
    switch (clientEvent) {
      case ("appReady").toLowerCase():  //working
        appReady(whereToview, isbackgroudApp, isbackgroudApp)
        break;
      case ("DataToReceipt").toLowerCase():
        appResponse = DataToReceipt(jsonMsg, whereToview, isbackgroudApp);
        break;
      case ("Receipt").toLowerCase():
        PrintReceiptWithAppData(jsonMsg, isbackgroudApp)
        break;
      case ("CartValue").toLowerCase():
        handleCartValue(jsonMsg, whereToview, isbackgroudApp)
        break;
      case ("Cart").toLowerCase():
        handleCart(jsonMsg, whereToview, isbackgroudApp)
        break;

      case ("Customers").toLowerCase():         //Handle Customer events
        HandleCustomer(jsonMsg, isbackgroudApp);
        break;
      case ("CustomerDetails").toLowerCase():
        sendCustomerDetail(jsonMsg, isbackgroudApp)
        break;
      case ("CustomerInSale").toLowerCase():
        retrieveCustomerInSale(jsonMsg, isbackgroudApp)
        break;
      case ("CustomerToSale").toLowerCase():
        CustomerToSale(jsonMsg, isbackgroudApp)
        break;
      // case ("productDetail").toLowerCase():
      //   productDetail(jsonMsg, isbackgroudApp)
      //   break
      case ("Payment").toLowerCase():
        appResponse = payfromApp(jsonMsg, isbackgroudApp)
        break
      // case ("rawProductData").toLowerCase():
      //   rawProductData(jsonMsg, isbackgroudApp)
      //   break
      case ("cartDiscount").toLowerCase():
        appResponse = addCartDiscount(jsonMsg, isbackgroudApp, whereToview)
        break
      case ("cartTaxes").toLowerCase():
        appResponse = cartTaxes(jsonMsg, isbackgroudApp)
        break
      case ("addProductToCart").toLowerCase():
        appResponse = AddProductToCart(jsonMsg, isbackgroudApp, whereToview)
        break
      case ("Notes").toLowerCase():
        appResponse = Notes(jsonMsg, isbackgroudApp, whereToview)
        break
      case ("Environment").toLowerCase():
        Environment(jsonMsg, isbackgroudApp, whereToview)
        break
      case ("lockEnvironment").toLowerCase():
        appResponse = lockEnvironment(jsonMsg, isbackgroudApp, whereToview)
        break
      case ("productPriceUpdate").toLowerCase():
        appResponse = productPriceUpdate(jsonMsg, isbackgroudApp, whereToview)
        break
      case ("sendProductQuantity").toLowerCase():
        appResponse = sendProductQuantity(jsonMsg, isbackgroudApp, whereToview)
        break
      // //App 2.0--------------------
      case ("Transaction").toLowerCase(): //same as payment
        appResponse = transactionApp(jsonMsg, isbackgroudApp)
        break;
      case ("TransactionStatus").toLowerCase(): //same as payment
        appResponse = transactionStatus(jsonMsg, whereToview, isbackgroudApp)
        break;
      case ("CloseExtension").toLowerCase():
        CloseExtension();
        break;
      case ("ClientInfo").toLowerCase():
        appResponse = sendClientsDetails(jsonMsg)
        break
      case ("OrderStatus").toLowerCase():
        appResponse = getOrderStatus(jsonMsg, whereToview)
        break
      case ("ParkSale").toLowerCase():
        appResponse = DoParkSale(jsonMsg,navigate)
        break
      case ("CustomFee").toLowerCase():
        appResponse = doCustomFee(jsonMsg)
        break
      case ("ReceiptData").toLowerCase():
        appResponse = getReceiptData(jsonMsg, whereToview)
        break
      case ("discountCoupon").toLowerCase():
        appResponse = addDiscountCoupon(jsonMsg, isbackgroudApp, whereToview)
        break
      default: // extensionFinished
        var clientJSON = {
          command: jsonMsg.command,
          version: jsonMsg.version,
          method: jsonMsg.method,
          status: 406,
          error: "Invalid Command" //GR[2]
        }
        postmessage(clientJSON)
        console.error('App Error : Extension event does not match ', jsonMsg)
        break;
    }
    return appResponse;
  }
}
export const postmessage = (clientJSON) => {
  //var iframex = document.getElementsByTagName("iframe")[0].contentWindow;
  var iframex = undefined;
  if (document.getElementById("commoniframe")) {
    iframex = document.getElementById("commoniframe").contentWindow;
    if (!iframex)
      iframex = document.getElementById("iframeid").contentWindow;
  }
  // else if (document.getElementById("iframeid")) {
  //   iframex = document.getElementById("iframeid").contentWindow;
  // }
  // else if (document.getElementById("iframeViewSecond")) {
  //   iframex = document.getElementById("iframeViewSecond").contentWindow;
  // }

  console.log("iframex", iframex)
  if (iframex) {
    iframex.postMessage(JSON.stringify(clientJSON), '*');

    // ----------Set recent app call-------------------------
    var app = null
    var currentAppName = document.getElementById('app_Name');
    var currentAppID = document.getElementById('app_Id');

    if (currentAppID) {
      app = {
        "Id": currentAppID.innerText,
        "Name": currentAppName.innerText
      }
      console.log("text", app)
      if (app !== null) { updateRecentUsedApp(app, false, true) }
    }
    //-------------------------------------------------------

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
  if (RequestData && RequestData && ((!RequestData.command) || RequestData.command == null || RequestData.command == '')) { // missing commond and invalid
    isValidationSuccess = false;
    clientJSON['error'] = "Invalid Command" //GR[4]
  }
  else if (RequestData.command.toLowerCase() == 'Customers' || RequestData.command.toLowerCase() == ('CustomerDetails').toLowerCase()) {
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
  }
  // else if (RequestData.command.toLowerCase() == ('DataToReceipt').toLowerCase() || RequestData.command.toLowerCase() == ('Receipt').toLowerCase()) {
  //   if (RequestData && (!RequestData.method || !RequestData.method == 'post')) { //missing attribut/invalid attribute name
  //     isValidationSuccess = false;
  //     clientJSON['error'] = "Invalid Attribute"
  //   } else if (RequestData && !RequestData.url) {
  //     isValidationSuccess = false;
  //     clientJSON['error'] = "Missing Attribute(s)" //GR[3]

  //   } else if (RequestData && !urlReg.test(RequestData.url)) {
  //     isValidationSuccess = false;
  //     clientJSON['error'] = "Invalid Value" //GR[5]  
  //   }

  // }
  // else if (RequestData.command.toLowerCase() == ('CartValue').toLowerCase()) { //|| RequestData.command=='Receipt'
  //   if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
  //     isValidationSuccess = false;
  //     clientJSON['error'] = "Invalid Attribute"
  //   }
  //   if (RequestData && RequestData.method && RequestData.method == 'put') {
  //     if (RequestData.data && RequestData.data.discount && RequestData.data.tender_amt) {
  //       if (typeof RequestData.data.discount == 'string' || typeof RequestData.data.tender_amt == 'string') {
  //         isValidationSuccess = false;
  //         clientJSON['error'] = "Invalid Value" //GR[4]  
  //       }
  //     } else {
  //       isValidationSuccess = false;
  //       clientJSON['error'] = "Invalid Attribute"
  //     }
  //   }
  // }
  // else if (RequestData.command.toLowerCase() == ('Cart').toLowerCase()) { //|| RequestData.command=='Receipt'
  //   if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
  //     isValidationSuccess = false;
  //     clientJSON['error'] = "Invalid Attribute"
  //   }
  // else if (RequestData && (RequestData.method || !RequestData.method=='post')) { //missing attribut/invalid attribute name
  //   isValidationSuccess=false;        
  //   clientJSON['error']= "Invalid Attribute"          
  // }else if (RequestData  && !RequestData.url){ 
  //   isValidationSuccess=false;
  //     clientJSON['error']="Missing Attribute(s)" //GR[3]

  // }else if (RequestData  && !urlReg.test(RequestData.url)){ 
  //   isValidationSuccess=false;
  //   clientJSON['error']=  "Invalid Value" //GR[5]  
  // }      

  //}
  else if (RequestData.command.toLowerCase() == ('productDetail').toLowerCase()) {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData && (RequestData.method && !RequestData.method == 'get')) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }


  }
  else if (RequestData.command.toLowerCase() == ("CustomerToSale").toLowerCase()) {
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
  else if (RequestData.command.toLowerCase() == ('Payment').toLowerCase()) {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    if (RequestData.method == 'post') {
      if (RequestData && (RequestData.method &&
        (!RequestData.data || !RequestData.data.payment_type || !RequestData.data.payment_type.name))) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Attribute"
      }
      else if (RequestData && RequestData.data && !RequestData.data.payment_type.data) {
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Attribute"
      }
      else if (RequestData && !RequestData.data.payment_type.data.amt) {
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Attribute"
      }
    } else if (RequestData.method == 'get') {
      if (!RequestData.order_id) {
        isValidationSuccess = false;
        clientJSON['error'] = "Missing Attribute(s)" //GR[2]
      }
    } else {
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
  }
  else if (RequestData.command.toLowerCase() == ('Transaction').toLowerCase()) {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    if (RequestData.method == 'post') {
      if (RequestData && (RequestData.method &&
        (!RequestData.data || !RequestData.data || !RequestData.data.processor || !RequestData.data.amount || RequestData.data.amount == 0))) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Missing Attribute(s)"
      }
    }
  }
  else if (RequestData.command.toLowerCase() == ('TransactionStatus').toLowerCase()) {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    if (RequestData.method == 'put') {
      if (RequestData && (RequestData.method &&
        (!RequestData.data || !RequestData.data || !RequestData.data.transaction_status))) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Attribute"
      }
    }
  }
  else if (RequestData.command.toLowerCase() == ('rawProductData').toLowerCase()) {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData && (RequestData.method && !RequestData.method == 'get')) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData && (RequestData.method && (!RequestData.product_id || RequestData.product_id == null))) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Missing Value"  //GR[6]          
    }

  }
  else if (RequestData.command.toLowerCase() == ('cartDiscount').toLowerCase()) {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData && (RequestData.method && RequestData.method == 'get')) {
      //NOTHING
    } else {
      if (RequestData && (RequestData.method && !RequestData.method == 'post')) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Attribute"
      }
      else if (RequestData && (RequestData.method && (!RequestData.amount_type || !RequestData.amount))) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Missing Attribute(s)"  //GR[3]          
      }
      else if (RequestData && (RequestData.method && (RequestData.amount_type == null || RequestData.amount == null))) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Value"  //GR[5]          
      }
      else if (RequestData && (RequestData.method && isNaN(RequestData.amount))) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Data Type"  //GR[4]          
      }
    }


  }
  else if (RequestData.command.toLowerCase() == ('cartTaxes').toLowerCase()) {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    if (RequestData && (RequestData.method && !RequestData.method == 'get' && !RequestData.method == 'post')) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    if (RequestData && (RequestData.method && RequestData.method == 'get')) {
      // no data for validation
    }
    else if (RequestData && (RequestData.method && RequestData.method == 'post')) {
      if (RequestData && (RequestData.method && (!RequestData.data || !RequestData.data.name || !RequestData.data.rate))) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Missing Attribute(s)"  //GR[3]          
      }
      else if (RequestData && (RequestData.method && (RequestData.data.name == null || RequestData.data.rate == null))) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Value"  //GR[5]          
      }
      else if (RequestData && (RequestData.method && isNaN(RequestData.data.rate))) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Data Type"  //GR[4]          
      }
      else if (RequestData && parseInt(RequestData.data.rate) >= 100) {
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Value-amount must be < 100 %"  //GR[5]          
      }
    }
  }
  else if (RequestData.command.toLowerCase() == ('addProductToCart').toLowerCase()) {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData && (RequestData.method && !RequestData.method == 'post')) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData && (RequestData.method && (!RequestData.product_id || !RequestData.product_name || !RequestData.quantity || !RequestData.total_price))) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Missing Attribute(s)"  //GR[3]          
    }
    else if (RequestData && (RequestData.method && (RequestData.product_id == null || RequestData.total_price == null || RequestData.quantity == null))) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Value"  //GR[5]          
    }
    else if (RequestData && (RequestData.method && isNaN(RequestData.total_price))) {
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Data Type"  //GR[4]          
    }

  }
  else if (RequestData.command.toLowerCase() == ('productPriceUpdate').toLowerCase()) {
    if (RequestData && (!RequestData.method || !RequestData.method == 'post')) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
  }
  else if (RequestData.command.toLowerCase() == ('Notes').toLowerCase()) {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData.method == 'put' || RequestData.method == 'post') {
      if (RequestData && RequestData && (RequestData.contents == null || RequestData.contents == '')) {

        isValidationSuccess = false;
        clientJSON['error'] = "Missing attribute" //GR[3] 
      }
      if (RequestData.method == 'put' && (!RequestData.note_id || RequestData.note_id == "" || RequestData.note_id == null)) {

        isValidationSuccess = false;
        clientJSON['error'] = "Missing attribute" //GR[3] 
      }
      //  else if (RequestData && RequestData && (RequestData.description == null || RequestData.description == '')) {

      //   isValidationSuccess = false;
      //   clientJSON['error'] = "Missing attribute" //GR[3] 
      // }
    }
    else if (RequestData && RequestData.method == 'delete' && (!RequestData.note_id || RequestData.note_id == "" || RequestData.note_id == null)) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Missing attribute"
    }
    else {
      if (RequestData && (!RequestData.method || !RequestData.method == 'get')) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Method"
      }
      else if (RequestData && RequestData && (RequestData.command == null || RequestData.command == '')) { // missing commond and invalid
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Command" //GR[4]
      }
    }
  } else if (RequestData.command.toLowerCase() == ('lockEnvironment').toLowerCase()) {
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
  else if (RequestData.command.toLowerCase() == ('OrderStatus').toLowerCase()) {
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
  else if (RequestData.command.toLowerCase() == ('ParkSale').toLowerCase()) {
    //missing attributes
    if (RequestData && (!RequestData.command || !RequestData.method)) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }

    else if (RequestData && (RequestData.method == 'get')) { // main attributes for customer update/delete 
      if (RequestData.method == "" || !RequestData.wc_order_no || RequestData.wc_order_no == null || RequestData.wc_order_no == "") {
        isValidationSuccess = false;
        clientJSON['error'] = "Missing Attribute(s)" //GR[3]
      }
    }

  }
  else if (RequestData.command.toLowerCase() == ('CustomFee').toLowerCase()) {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData.method == 'put' || RequestData.method == 'post') {
      if (RequestData && RequestData && (!RequestData.data || RequestData.data == null || RequestData.data == '')) {

        isValidationSuccess = false;
        clientJSON['error'] = "Missing attribute" //GR[3] 
      }
      else if (RequestData && RequestData && (RequestData.data.name == "" || RequestData.data.amount == '' || RequestData.data.amount == '0' || RequestData.data.is_taxable === "")) {

        isValidationSuccess = false;
        clientJSON['error'] = "Missing attribute" //GR[3] 
      }
      else if (RequestData && RequestData && RequestData.method == 'post' &&
        (!RequestData.data.name || !RequestData.data.amount || !RequestData.data.hasOwnProperty("is_taxable"))) {
        isValidationSuccess = false;
        clientJSON['error'] = "Missing attribute" //GR[3] 
      } else if (RequestData && RequestData && RequestData.method == 'put' &&
        (!RequestData.data.name || (!RequestData.data.amount && !RequestData.data.hasOwnProperty("is_taxable")))) {
        isValidationSuccess = false;
        clientJSON['error'] = "Missing attribute" //GR[3] 
      } else if (RequestData && RequestData && RequestData.data.amount && (isNaN(RequestData.data.amount) || RequestData.data.amount < 0)) {

        isValidationSuccess = false;
        clientJSON['error'] = "Invalid attribute" //GR[3] 
      }
    }
    // else if (RequestData && RequestData.method == 'delete' /*&& (!RequestData.name || RequestData.name=="")*/) { //missing attribut/invalid attribute name
    //     isValidationSuccess = false;
    //     clientJSON['error'] = "Missing attribute"               

    // }
    else {
      if (RequestData && (!RequestData.method || !RequestData.method == 'get')) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Method"
      }

    }
  }
  else if (RequestData.command == 'ReceiptData') {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData && (!RequestData.method || !RequestData.method == 'get')) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Method"
    }


  }
  else if (RequestData.command.toLowerCase() == ('discountCoupon').toLowerCase()) {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData && (RequestData.method && RequestData.method == 'get')) {
      //NOTHING
    } else {
      if (RequestData && (RequestData.method && !RequestData.method == 'post')) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Attribute"
      }
      else if (RequestData.data) {
        RequestData.data && RequestData.data.map(RequestItem => {
          if (RequestItem && (RequestItem.method && (!RequestItem.amount_type || !RequestItem.amount))) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Missing Attribute(s)"  //GR[3]          
          }
          if (RequestItem && (RequestItem.method && (RequestItem.amount_type == null || RequestItem.amount == null))) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Value"  //GR[5]          
          }
          else if (RequestItem && (RequestItem.method && isNaN(RequestItem.amount))) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Data Type"  //GR[4]          
          }
        })
      }
      else {
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Attribute"
      }
    }
  }
  else {// no command found
    isValidationSuccess = false;
    clientJSON['error'] = "Invalid Value" //GR[5]          
  }
  return { isValidationSuccess, clientJSON };
}

export const appReady = (whereToview, isbackgroudApp) => {
  var clientDetails = localStorage.getItem('clientDetail') ?
    JSON.parse(localStorage.getItem('clientDetail')) : 0
  var client_guid = clientDetails && clientDetails.subscription_detail ? clientDetails.subscription_detail.client_guid : ''

  if (whereToview == 'ActivityView') {
    // var pagesize = Config.key.ACTIVITY_PAGE_SIZE
    // var UID = get_UDid('UDID');
    // var pagno = 0;
    //store.dispatch(activityActions.getOne(UID,pagesize,pagno));
    setTimeout(() => {
      const state = store.getState();
      console.log("state", state)
      if (state.single_Order_list && state.single_Order_list.items && state.single_Order_list.items.content) {
        var _OrderId = state.single_Order_list.items.content.order_id;
        var OliverReciptId = state.single_Order_list.items.content.OliverReciptId;
        var _customerId = state.single_Order_list.items.content.customer_id;
        var clientJSON = {
          command: "appReady",
          version: "1.0",
          method: "get",
          status: 200,
          data:
          {
            OrderId: _OrderId,
            WooCommerceId: _customerId,
            clientGUID: client_guid,
            view: whereToview,
            privilege: clientDetails && clientDetails.user_role,
            viewport: isMobileOnly == true ? "Mobile" : "desktop"
          },
          error: null
        }
        postmessage(clientJSON)
      }
    }, 1000);

  } else if (whereToview == 'CheckoutView' || whereToview == 'RefundView' || whereToview == 'efundCompleteView') {
    var clientJSON = {
      command: "appReady",
      version: "1.0",
      method: "get",
      status: 200,
      data:
      {
        clientGUID: client_guid,
        view: whereToview,
        privilege: clientDetails && clientDetails.user_role,
        viewport: isMobileOnly == true ? "Mobile" : "desktop"
      },
      error: null
    }
    postmessage(clientJSON)
  } else if (whereToview == 'CustomerView') {
    //var UID = get_UDid('UDID');
    //store.dispatch(customerActions.getAllEvents(UID));
    setTimeout(() => {
      const state = store.getState();
      console.log("state", state)
      if (state.single_cutomer_list && state.single_cutomer_list.items && state.single_cutomer_list.items.content) {
        var _CustomerId = state.single_cutomer_list.items.content.customerDetails.WPId;
        var clientJSON = {
          command: "appReady",
          version: "1.0",
          method: "get",
          status: 200,
          data:
          {
            CustomerId: _CustomerId,
            clientGUID: client_guid,
            view: whereToview,
            privilege: clientDetails && clientDetails.user_role,
            viewport: isMobileOnly == true ? "Mobile" : "desktop"
          },
          error: null
        }
        postmessage(clientJSON)
      }
    }, 1000);
  } else if (whereToview == 'ProductView') {  // this is not in used. 
    var clientJSON = {
      command: "appReady",
      version: "1.0",
      method: "get",
      status: 200,
      data:
      {
        ProductId: 445667,
        view: whereToview,
        privilege: clientDetails && clientDetails.user_role,
        viewport: isMobileOnly == true ? "Mobile" : "desktop"
      },
      error: null
    }
    postmessage(clientJSON)
    console.log("clientJSON from shopview", clientJSON)
  } else {  //home
    var clientJSON = {
      command: "appReady",
      version: "1.0",
      method: "get",
      status: 200,
      data:
      {
        view: whereToview,
        privilege: clientDetails && clientDetails.user_role,
        viewport: isMobileOnly == true ? "Mobile" : "desktop"
      },
      error: null
    }
    postmessage(clientJSON)
    console.log("clientJSON from shopview", clientJSON)
  }

}
// Product Detail end****************
export const CloseExtension = () => {
  //hideModal('common_ext_popup');

}



export const postClientExtensionResponse = (method, isSuccess, message, command = "Customers", data = "") => {
  var _method = command == "CustomerDetails" ? 'get' :
    method == 'save' ? 'post' :
      method == 'update' ? 'put' :
        method == 'delete' ? 'delete' : 'get'

  var clientJSON = {
    command: command,
    version: "1.0",
    method: _method,
    status: isSuccess == true ? 200 : 406,
    error: isSuccess == true ? null : message
  }
  if (isSuccess == true && data !== "") {
    clientJSON['data'] = data
  }
  postmessage(clientJSON);

}
