import React, { useEffect, useState, useLayoutEffect } from "react";

import Sale_Complete from '../../assets/images/svg/SaleComplete.svg';
import Checkmark from '../../assets/images/svg/Checkmark.svg';
import Refund_Complete from '../../assets/images/svg/RefundComplete.svg';

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
    // useEffect(() => {
    //     //printdetails();
    //     //dispatch(checkTempOrderSync(tempOrder_Id));
    //     if (isPrint === false) {

    //         var checkPrintreciept = localStorage.getItem("user") && localStorage.getItem("user") !== '' ? JSON.parse(localStorage.getItem("user")).print_receipt_on_sale_complete : '';
    //         if ((!ActiveUser.key.isSelfcheckout || ActiveUser.key.isSelfcheckout === false) && checkPrintreciept && checkPrintreciept == true) {
    //             printReceipt();
    //         }
    //         isPrint = true;
    //     }

    // }, [changeAmount, paymentAmount]);
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


    const [activitygetdetails] = useSelector((state) => [state.activityGetDetail]);
    useEffect(() => {
        if (activitygetdetails && activitygetdetails.status == STATUSES.IDLE && activitygetdetails.is_success && activitygetdetails.data) {
            if (isPrint == false) {
                var checkPrintreciept = localStorage.getItem("user") && localStorage.getItem("user") !== '' ? JSON.parse(localStorage.getItem("user")).print_receipt_on_sale_complete : '';
                if ((!ActiveUser.key.isSelfcheckout || ActiveUser.key.isSelfcheckout === false) && checkPrintreciept && checkPrintreciept == true) {
                    printReceipt();
                }
                isPrint = true;
            }
        }
    }, [activitygetdetails]);

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
        _data.line_items =   _data && _data.line_items && _data.line_items.map(ele => {
            var _item={...ele};
            printData && printData.line_items && printData.line_items.map(pd => {
                if ((pd.hasOwnProperty("product_id") && ele.product_id == pd.product_id) || (pd.hasOwnProperty("variation_id") && ele.product_id == pd.variation_id)) {
                    _item["isTaxable"] = pd.isTaxable;
                }
            });
            return _item;
        });
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
            <div className="refund-complete-wrapper">
                <div className="main">
                    <div style={{ display: 'none' }} >
                        <img src={textToBase64Barcode(tempOrder_Id)} />
                    </div>
                    <img src={Refund_Complete} alt="" />
                   
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
                        <button id="newSale">{LocalizedLanguage.continue}</button>
                    </div>
                </div>
            </div>
            <EndSession toggleShowEndSession={toggleShowEndSession} isShow={isShowEndSession}></EndSession>
        </React.Fragment>)
    // }

}
export default RefundComplete 