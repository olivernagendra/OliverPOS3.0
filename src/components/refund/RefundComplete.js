import React, { useEffect, useState, useLayoutEffect } from "react";

import Sale_Complete from '../../assets/images/svg/SaleComplete.svg';
import Checkmark from '../../assets/images/svg/Checkmark.svg';
import LogOut_Icon_White from '../../assets/images/svg/LogOut-Icon-White.svg';
import spongebob_squarepants_2 from '../../assets/images/svg/spongebob-squarepants-2.svg';
import Google_Calendar_Icon from '../../assets/images/Temp/Google-Calendar-Icon.png';
import DYMO_Icon from '../../assets/images/Temp/DYMO-Icon.png';
import QuoteApp_Icon from '../../assets/images/Temp/QuoteApp_Icon.png';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import LocalizedLanguage from "../../settings/LocalizedLanguage";
import { getTotalTaxByName } from "../common/TaxSetting";
// import { product } from "../dashboard/product/productSlice";
// import { addtoCartProduct } from "../dashboard/product/productLogic";
import { PrintPage } from "../common/PrintPage";
import { get_UDid } from "../common/localSettings";
import ActiveUser from "../../settings/ActiveUser";
import EndSession from "../common/commonComponents/EndSession";
import { typeOfTax } from "../common/TaxSetting";
import Config from '../../Config';
import moment from "moment";
import { isSafari } from "react-device-detect";
import { saveCustomerToTempOrder } from "../customer/CustomerSlice";
import STATUSES from "../../constants/apiStatus";
import { checkTempOrderSync } from "../checkout/checkoutSlice";
var JsBarcode = require('jsbarcode');
var print_bar_code;
const RefundComplete = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isShowEndSession, setisShowEndSession] = useState(false);
    const [isRemember, setisRemember] = useState(false);
    const [changeAmount, setChangeAmount] = useState(0);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [custEmail, setCustEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tempOrder_Id, setTempOrder_Id] = useState(localStorage.getItem('tempOrder_Id') ? JSON.parse(localStorage.getItem('tempOrder_Id')) : '')
    var isPrint = false;
    useEffect(() => {
        //printdetails();
        //dispatch(checkTempOrderSync(tempOrder_Id));
        if (isPrint === false) {
            
            var checkPrintreciept = localStorage.getItem("user") && localStorage.getItem("user") !== '' ? JSON.parse(localStorage.getItem("user")).print_receipt_on_sale_complete : '';
            if ((!ActiveUser.key.isSelfcheckout || ActiveUser.key.isSelfcheckout === false) && checkPrintreciept && checkPrintreciept == true) {
                printReceipt();
            }
            isPrint = true;
        }

    }, [changeAmount, paymentAmount]);
    const newSale = () => {
        localStorage.removeItem('CARD_PRODUCT_LIST');
        localStorage.removeItem('GTM_ORDER');

        localStorage.removeItem('ORDER_ID');
        localStorage.removeItem('CHECKLIST');
        localStorage.removeItem('oliver_order_payments');
        localStorage.removeItem('AdCusDetail');
        localStorage.removeItem('CARD_PRODUCT_LIST');
        localStorage.removeItem("CART");
        localStorage.removeItem("SINGLE_PRODUCT");
        localStorage.removeItem("PRODUCT");
        localStorage.removeItem('PRODUCTX_DATA');
        localStorage.removeItem('PAYCONIQ_PAYMENT_RESPONSE');
        localStorage.removeItem('ONLINE_PAYMENT_RESPONSE');
        localStorage.removeItem('STRIPE_PAYMENT_RESPONSE');
        localStorage.removeItem('GLOBAL_PAYMENT_RESPONSE');
        localStorage.removeItem('PAYMENT_RESPONSE');
        localStorage.removeItem('PENDING_PAYMENTS');
        localStorage.setItem('DEFAULT_TAX_STATUS', 'true');
        localStorage.removeItem('PrintCHECKLIST');

        // dispatch(addtoCartProduct(null));
        navigate('/home');
    }
    const toggleShowEndSession = () => {
        setisShowEndSession(!isShowEndSession);
    }
    const toggleisRemember = () => {
        setisRemember(!isRemember);
    }
    const textToBase64Barcode = (text) => {
        if (text != "" && typeof text != "undefined") {
            var canvas = document.createElement("canvas");
            JsBarcode(canvas, text, {
                format: "CODE39", displayValue: false, width: 1,
                height: 30,
            });
            print_bar_code = canvas.toDataURL("image/png");
        }
        return print_bar_code;
    }
    // const printdetails = () => {

    //     var ListItem = new Array();
    //     var _typeOfTax = typeOfTax()
    //     var addcust;
    //     var PrintDetails = localStorage.getItem('GTM_ORDER') ? JSON.parse(localStorage.getItem('GTM_ORDER')) : null;

    //     if (PrintDetails && PrintDetails !== null) {
    //         PrintDetails.order_meta && PrintDetails.order_meta.map((meta) => {
    //             if (meta._order_oliverpos_cash_change) {
    //                 setChangeAmount(meta._order_oliverpos_cash_change.change);
    //                 setPaymentAmount(meta._order_oliverpos_cash_change.cashPayment);
    //             }
    //         })
    //         if (PrintDetails && PrintDetails.productx_line_items && PrintDetails.productx_line_items !== null && PrintDetails.productx_line_items.length > 0) {
    //             PrintDetails.productx_line_items.map(item => {
    //                 ListItem.push({
    //                     line_item_id: 0,
    //                     quantity: item.quantity,
    //                     Title: item.Title && item.Title !== "" ? item.Title : (item.Sku && item.Sku !== "" && item.Sku !== "False") ? item.Sku : 'N/A',
    //                     Sku: (item.Sku && item.Sku !== "" && item.Sku !== "False") ? item.Sku : (item.SKu && item.SKu !== "" && item.SKu !== "False") ? item.SKu : 'N/A',
    //                     Price: item.line_subtotal ? parseFloat(item.line_subtotal).toFixed(3).slice(0, -1) : 0.00,
    //                     subtotalPrice: item.line_subtotal,
    //                     subtotaltax: item.line_subtotal_tax,
    //                     totalPrice: item.line_total,
    //                     totaltax: item.line_tax,
    //                     product_id: item.product_id, //(productData.Type == "variation") ? productData.ParentId : item.product_id,
    //                     variation_id: item.variation_id,//(productData.Type == "variation") ? item.product_id : 0,
    //                     after_discount: (item.line_total == item.line_subtotal) ? 0 : item.line_total,
    //                     discount_amount: (item.line_total == item.line_subtotal) ? 0 : item.line_subtotal - item.line_total,
    //                     //old_price: productData.Price,line_
    //                     incl_tax: _typeOfTax == 'incl' ? item.line_subtotal_tax : 0,
    //                     excl_tax: _typeOfTax == 'Tax' ? item.line_subtotal_tax : 0,
    //                     Taxes: item.line_total_taxes,//item.Taxes
    //                     addons_meta_data: item && item.addons && item.addons.length > 0 && item.addons ? JSON.stringify(item.addons) : '',
    //                     pricing_item_meta_data: item && item.pricing_item_meta_data ? item.pricing_item_meta_data : '',

    //                     product_ticket: item && item.product_ticket ? item.product_ticket : '',
    //                     tcForSeating: item && item.tcForSeating ? item.tcForSeating : '',
    //                     tick_event_id: item && item.tick_event_id ? item.tick_event_id : '',
    //                     ticket_info: item && item.ticket_info ? item.ticket_info : '',
    //                     ticket_status: item && item.ticket_status ? item.ticket_status : '',
    //                     psummary: item && item.psummary ? item.psummary : ''
    //                 })
    //             })
    //         }
    //     }
    //     if (PrintDetails && PrintDetails.line_items !== null) {
    //         if (PrintDetails && PrintDetails.line_items && PrintDetails.line_items.length > 0) {
    //             PrintDetails.line_items.map(item => {
    //                 var Proprice = item.subtotal && item.subtotal != "" ? parseFloat(item.subtotal).toFixed(3).slice(0, -1) : 0.00;
    //                 //productList from mobile view
    //                 // var _productList = productList && productList.length > 0 ? productList : this.state.productList;
    //                 // var productData = _productList.find(prdID => prdID.WPID == item.product_id);
    //                 ListItem.push({
    //                     line_item_id: item.line_item_id,
    //                     quantity: item.quantity,
    //                     Title: item.name && item.name !== "" ? item.name : (item.Sku && item.Sku !== "" && item.Sku !== "False") ? item.Sku : 'N/A',
    //                     Sku: item.Sku,
    //                     Price: Proprice,
    //                     subtotalPrice: item.subtotal,
    //                     subtotaltax: item.subtotal_tax,
    //                     totalPrice: item.total,
    //                     totaltax: item.total_tax,
    //                     product_id: item.product_id, //(productData.Type == "variation") ? productData.ParentId : item.product_id,
    //                     variation_id: item.variation_id,//(productData.Type == "variation") ? item.product_id : 0,
    //                     after_discount: (item.total == item.subtotal) ? 0 : item.total,
    //                     discount_amount: (item.total == item.subtotal) ? 0 : item.subtotal - item.total,
    //                     //old_price: productData.Price,
    //                     incl_tax: _typeOfTax == 'incl' ? item.subtotal_tax : 0,
    //                     excl_tax: _typeOfTax == 'Tax' ? item.subtotal_tax : 0,
    //                     Taxes: item.total_taxes,//item.Taxes
    //                     addons_meta_data: item.addons_meta_data,
    //                     pricing_item_meta_data: item && item.pricing_item_meta_data ? item.pricing_item_meta_data : '',

    //                     product_ticket: item && item.product_ticket ? item.product_ticket : '',
    //                     tcForSeating: item && item.tcForSeating ? item.tcForSeating : '',
    //                     tick_event_id: item && item.tick_event_id ? item.tick_event_id : '',
    //                     ticket_info: item && item.ticket_info ? item.ticket_info : '',
    //                     ticket_status: item && item.ticket_status ? item.ticket_status : '',
    //                     psummary: item.addons_meta_data == "" ? (item && item.psummary ? item.psummary : '') : ""
    //                 })
    //             })
    //         }
    //     }
    //     if (PrintDetails && (typeof PrintDetails.order_custom_fee !== 'undefined') && PrintDetails.order_custom_fee.length !== 0) {
    //         PrintDetails.order_custom_fee.map(item => {
    //             ListItem.push({
    //                 Title: item.note,
    //                 Price: item.amount !== 0 ? item.amount : null,
    //             })
    //         })
    //     }

    //     if (PrintDetails && PrintDetails.customer_email != "") {
    //         setCustEmail(PrintDetails.customer_email);
    //         //PrintDetails && PrintDetails.billing_address && PrintDetails.billing_address.map(item => { 
    //         PrintDetails && PrintDetails.shipping_address && PrintDetails.shipping_address.map(item => {
    //             addcust = {
    //                 content: {
    //                     AccountBalance: 0,
    //                     City: item.city ? item.city : '',
    //                     Email: item.email ? item.email : '',
    //                     FirstName: item.first_name ? item.first_name : '',
    //                     Id: item.customer_id ? item.customer_id : PrintDetails.customer_id,
    //                     LastName: item.last_name ? item.last_name : '',
    //                     Notes: item.customer_note ? item.customer_note : '',
    //                     Phone: item.phone ? item.phone : '',
    //                     Pin: 0,
    //                     Pincode: item.postcode ? item.postcode : '',
    //                     StoreCredit: item.store_credit ? item.store_credit : '',
    //                     StreetAddress: item.address_1 ? item.address_1 + (item.address_2 && " " + item.address_2) : '',
    //                     UID: 0,
    //                     State: item.state,
    //                     Country: item.country
    //                 }
    //             }
    //         });

    //         if (addcust && addcust.content && addcust.content.City == "" /*&& addcust.content.State==""*/ && addcust.content.Country == "") {
    //             PrintDetails && PrintDetails.billing_address && PrintDetails.billing_address.map(item => {
    //                 addcust = {
    //                     content: {
    //                         AccountBalance: 0,
    //                         City: item.city ? item.city : '',
    //                         Email: item.email ? item.email : '',
    //                         FirstName: item.first_name ? item.first_name : '',
    //                         Id: item.customer_id ? item.customer_id : PrintDetails.customer_id,
    //                         LastName: item.last_name ? item.last_name : '',
    //                         Notes: item.customer_note ? item.customer_note : '',
    //                         Phone: item.phone ? item.phone : '',
    //                         Pin: 0,
    //                         Pincode: item.postcode ? item.postcode : '',
    //                         StoreCredit: item.store_credit ? item.store_credit : '',
    //                         StreetAddress: item.address_1 ? item.address_1 + (item.address_2 && " " + item.address_2) : '',
    //                         UID: 0,
    //                         State: item.state,
    //                         Country: item.country
    //                     }
    //                 }
    //             });
    //         }
    //     }
    //     var deafult_tax = localStorage.getItem('APPLY_DEFAULT_TAX') ? JSON.parse(localStorage.getItem("APPLY_DEFAULT_TAX")) : null;
    //     var taxIds
    //     if (PrintDetails && PrintDetails.line_items && PrintDetails.line_items.length > 0) {
    //         taxIds = PrintDetails && PrintDetails.line_items !== null ? PrintDetails.line_items[0].total_taxes ? PrintDetails.line_items[0].total_taxes : 0 : 0;
    //     }
    //     if (PrintDetails !== null) {
    //         if (PrintDetails.productx_line_items !== null && PrintDetails.productx_line_items.length > 0)
    //             taxIds = PrintDetails && PrintDetails.productx_line_items && PrintDetails.productx_line_items[0].line_total_taxes;
    //     }
    //     var taxArray = taxIds ? JSON.parse(JSON.stringify(taxIds)) : null;//JSON.parse(taxIds).total
    //     var Taxes = taxArray !== null && taxArray !== undefined && taxArray.length > 0 ? Object.entries(taxArray).map(item => ({ [item[0]]: item[1] })) : deafult_tax;
    //     // get redeem points from localstorage
    //     var redeemedPointsToPrint = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem("CHECKLIST"))._wc_points_redeemed : 0;
    //     var redeemedAmountToPrint = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem("CHECKLIST"))._wc_amount_redeemed : 0;
    //     var PrototalDis = PrintDetails && PrintDetails !== undefined && PrintDetails.order_discount && parseFloat(PrintDetails.order_discount).toFixed(3).slice(0, -1)
    //     //CHANGING THE DATE FORMAT FOR SAFARI BROWSER
    //     var dtformat = isSafari ? Config.key.DATETIME_FORMAT_SAFARI : Config.key.DATETIME_FORMAT;

    //     var CheckoutList = {
    //         ListItem: ListItem,
    //         customerDetail: addcust ? addcust : null,
    //         totalPrice: PrintDetails && PrintDetails.order_total,
    //         discountCalculated: PrototalDis,
    //         tax: PrintDetails && PrintDetails.order_tax,
    //         subTotal: PrintDetails && parseFloat(PrintDetails.order_total) - parseFloat(PrintDetails.order_tax),
    //         subTotal: PrintDetails && parseFloat(PrintDetails.order_total) - parseFloat(PrintDetails.order_tax),
    //         // TaxId: deafult_tax && deafult_tax[0] ? deafult_tax[0].TaxId : 0,
    //         TaxId: Taxes ? Taxes : 0,
    //         status: PrintDetails && PrintDetails.status,
    //         order_id: PrintDetails && PrintDetails && PrintDetails.order_id,
    //         oliver_pos_receipt_id: PrintDetails && PrintDetails.OliverReciptId,
    //         order_date: PrintDetails && PrintDetails.OrderDateTime ? moment(PrintDetails.OrderDateTime).format(dtformat) :
    //             PrintDetails && PrintDetails._currentTime ? moment(PrintDetails._currentTime).format(dtformat) : null,
    //         showTaxStaus: _typeOfTax == 'Tax' ? _typeOfTax : 'Incl. Tax',
    //         order_notes: PrintDetails && PrintDetails.order_notes,
    //         // PUTTING redeemedPointsToPrint IN Printcheckout
    //         redeemedPoints: redeemedPointsToPrint ? redeemedPointsToPrint : 0,
    //         redeemedAmountToPrint: redeemedAmountToPrint ? redeemedAmountToPrint : 0,
    //         meta_datas: PrintDetails && PrintDetails.order_meta,
    //         _currentTime: (PrintDetails._currentTime && PrintDetails._currentTime != null && typeof PrintDetails._currentTime != "undefined") ? PrintDetails._currentTime : ''
    //     }
    //     localStorage.setItem("PrintCHECKLIST", JSON.stringify(CheckoutList));
    //     //localStorage.removeItem("CHECKLIST");
    // }
    const [activitygetdetails] = useSelector((state) => [state.activityGetDetail]);
    // useEffect(() => {
    //     if (activitygetdetails && activitygetdetails.status == STATUSES.IDLE && activitygetdetails.is_success && activitygetdetails.data) {


    //     }
    // }, [activitygetdetails]);

    // print function for refund
    const printReceipt = async () => {
        // this.setState({ showPrint: false })
        var printData = localStorage.getItem('getorder') && JSON.parse(localStorage.getItem('getorder'))
        var mydate = new Date();
        var getPdfdate = (mydate.getMonth() + 1) + '/' + mydate.getDate() + '/' + mydate.getFullYear();
        var productxList = ''
        var AllProductList = ''
        var type = 'activity'
        var orderList = printData ? printData.order_payments : ''
        var cash_rounding_amount = printData.cash_rounding_amount
        var barCodeId = printData && printData.OliverReciptId
        var print_bar_code = await textToBase64Barcode(barCodeId)
        var order_reciept = localStorage.getItem('orderreciept') ? localStorage.getItem('orderreciept') === "undefined" ? null : JSON.parse(localStorage.getItem('orderreciept')) : "";
        var TotalTaxByName = (order_reciept && order_reciept.ShowCombinedTax == false) ? printData && printData.order_taxes && this.getTotalTaxByName(printData.order_taxes) : "";
        var redeemPointsToPrint = printData && printData.meta_datas && printData.meta_datas.find(item => item.ItemName == "_wc_points_logged_redemption")
        redeemPointsToPrint = redeemPointsToPrint && redeemPointsToPrint.ItemValue ? redeemPointsToPrint.ItemValue : 0

        var isTotalRefund = false;
        var Totalamount = printData ? printData.total_amount : 0
        var refunded_amount = printData ? printData.refunded_amount : 0
        if ((Totalamount - refunded_amount).toFixed(2) == '0.00') {
            isTotalRefund = true
        }
        var data = null;
        if (activitygetdetails && activitygetdetails.status == STATUSES.IDLE && activitygetdetails.is_success && activitygetdetails.data) {
            data = activitygetdetails.data.content;
        }
        //var data = this.props.single_Order_list && this.props.single_Order_list.content
        //Checking each product for isTaxable. 01/08/2022

        // var data = this.props.single_Order_list && this.props.single_Order_list.content
        // //Checking each product for isTaxable. 01/08/2022
        // data && data.line_items && data.line_items.map(ele => {
        //     printData && printData.line_items && printData.line_items.map(pd => {
        //         if ((pd.hasOwnProperty("product_id") && ele.product_id == pd.product_id) || (pd.hasOwnProperty("variation_id") && ele.product_id == pd.variation_id)) {
        //             ele["isTaxable"] = pd.isTaxable;
        //         }
        //     });
        // });

        var _data = { ...data };
        // _data && _data.line_items && _data.line_items.map(ele => {
        //     printData && printData.line_items && printData.line_items.map(pd => {
        //         if ((pd.hasOwnProperty("product_id") && ele.product_id == pd.product_id) || (pd.hasOwnProperty("variation_id") && ele.product_id == pd.variation_id)) {
        //             ele["isTaxable"] = pd.isTaxable;
        //         }
        //     });
        // });
        // {(!_env || _env=="ios") && <input type="radio" id="test3" name="radio-group" onClick={props.Details != "" ? () => PrintPage.PrintElem(props.Details, props.getPdfdateTime, isTotalRefund, props.cash_rounding_amount, print_bar_code, orderList, type, productxList, AllProductList, TotalTaxByName, props.redeemPointsToPrint) : props.printPOP} />}
        if (_data) {
            setTimeout(() => {
            PrintPage.PrintElem(_data, getPdfdate, isTotalRefund, cash_rounding_amount, print_bar_code, orderList, type, productxList, AllProductList, TotalTaxByName, redeemPointsToPrint)
            }, 500);
        }
    }
    // end print fun...
    const sendMail = () => {
        //var udid = get_UDid();
        var order_id = localStorage.getItem('tempOrder_Id') ? JSON.parse(localStorage.getItem('tempOrder_Id')) : '';//$("#order-id").val();
        var email_id = custEmail;
        // console.log("email_id", email_id)
        //$(".emialsuctes").css("display", "block");
        //this.setState({ mailsucces: null, emailSendingMessage: '' });
        // var requestData = {
        //     "Udid": udid,
        //     "OrderNo": order_id,
        //     "EmailTo": email_id,
        // }
        if (!email_id || email_id == "") {
            console.log("Email is not exist!");
            //this.setState({ IsEmailExist: false, common_Msg: 'Email is not exist!' })
            // setTimeout(function () {
            //     showModal('common_msg_popup');
            // }, 100)
        }
        if (ActiveUser.key.isSelfcheckout == true) {
            var checkList = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : '';
            var defaultVal = ((checkList.customerDetail && checkList.customerDetail.content &&
                typeof checkList.customerDetail.content.Email !== "undefined") ? checkList.customerDetail.content.Email : '')
            if (defaultVal !== '') {
                console.log("Email is not exist!");
                // this.setState({ common_Msg: 'Email is not exist!' })
                // showModal('common_msg_popup');
            }
        } else {
            //this.setState({ IsEmailExist: true })

            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email_id)) {
                setIsLoading(true);
                // this.setState({
                //     valiedEmail: true,
                //     loader: true
                // })
                // if ($(".checkmark").hasClass("isCheck")) {
                // save new customer on sale complete
                dispatch(saveCustomerToTempOrder({ order_id: order_id, email_id: email_id }))
                // Add into notfication list ----------------------------------------
                // Create localstorage to store temporary orders--------------------------
                // $("#btnSubmit").attr("disabled", true);
                var TempOrders = [];
                if (localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`)) {
                    TempOrders = JSON.parse(localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`));
                }
                TempOrders.push({ "TempOrderID": order_id, "Status": "false", "Index": TempOrders.length, "OrderID": 0, 'order_status': "completed", 'date': moment().format(Config.key.NOTIFICATION_FORMAT), 'Sync_Count': 0, 'new_customer_email': email_id, 'isCustomerEmail_send': false });
                localStorage.setItem(`TempOrders_${ActiveUser.key.Email}`, JSON.stringify(TempOrders));
                //$("#btnSendEmail").attr("readonly", true);
                // this.clear();
            } else {
                setIsLoading(false);
                // if (!email_id || email_id == "") {
                //     this.setState({ IsEmailExist: false })
                // }
                // this.setState({ valiedEmail: false })
            }
        }

    }
    const [respSaveCustomerToTempOrder] = useSelector((state) => [state.saveCustomerToTempOrder])
    useEffect(() => {
        if ((respSaveCustomerToTempOrder && respSaveCustomerToTempOrder.status == STATUSES.IDLE && respSaveCustomerToTempOrder.is_success && isLoading === true)) {

            setIsLoading(false);
            alert("mail send successfully");
            setCustEmail('');
        }
    }, [respSaveCustomerToTempOrder, isLoading]);

    //var checkList = localStorage.getItem('GTM_ORDER') ? JSON.parse(localStorage.getItem('GTM_ORDER')) : ""; // localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : "";
    return (
        <React.Fragment>
            <div className="sale-complete-wrapper">
                <div className="main">
                    <div style={{ display: 'none' }} >
                        <img src={textToBase64Barcode(tempOrder_Id)} />
                    </div>
                    {/* <img src={Sale_Complete} alt="" /> */}
                    <p className="refund-complete-txt">Refund completed</p>
                    {changeAmount != 0 ? <div className="change-container">
                        <p className="style1">Change: ${parseFloat(changeAmount).toFixed(2)}</p>
                        <p className="style2">Out of ${parseFloat(paymentAmount).toFixed(2)}</p>
                    </div> : null}
                    <label className="email-label">
                        <input type="email" placeholder="Enter email address here" defaultValue={custEmail} onChange={e => setCustEmail(e.target.value)} />
                        <button onClick={() => sendMail()}>{LocalizedLanguage.emailReceipt}</button>
                    </label>
                    <label className="checkbox-label">
                        Remember this customer?
                        <input type="checkbox" defaultChecked={isRemember === true ? true : false} onClick={() => toggleisRemember()} />
                        <div className="custom-checkbox">
                            <img src={Checkmark} alt="" />
                        </div>
                    </label>
                    <button onClick={() => printReceipt()}>{LocalizedLanguage.printReceipt}</button>
                    <button id="emailSubwindowButton">{LocalizedLanguage.emailReceipt}</button>
                </div>
                <div className="footer">
                    <div className="button-container">
                        <button id="endSession" onClick={() => toggleShowEndSession()}>
                            <img src={LogOut_Icon_White} alt="" />
                            End Session
                        </button>
                    </div>
                    <div className="app-container">
                        <button>
                            <img src={spongebob_squarepants_2} alt="" />
                        </button>
                        <button>
                            <img src={Google_Calendar_Icon} alt="" />
                        </button>
                        <button>
                            <img src={DYMO_Icon} alt="" />
                        </button>
                        <button>
                            <img src={QuoteApp_Icon} alt="" />
                        </button>
                        <button>
                            <img src={QuoteApp_Icon} alt="" />
                        </button>
                    </div>
                    <div className="button-container" onClick={() => newSale()}>
                        <button id="newSale">{LocalizedLanguage.newSale}</button>
                    </div>
                </div>
            </div>
            <EndSession toggleShowEndSession={toggleShowEndSession} isShow={isShowEndSession}></EndSession>
        </React.Fragment>)
    // }

}
export default RefundComplete 