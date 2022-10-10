import React, { useEffect, useState, useLayoutEffect } from "react";

import Sale_Complete from '../../images/svg/SaleComplete.svg';
import Checkmark from '../../images/svg/Checkmark.svg';
import LogOut_Icon_White from '../../images/svg/LogOut-Icon-White.svg';
import spongebob_squarepants_2 from '../../images/svg/spongebob-squarepants-2.svg';
import Google_Calendar_Icon from '../../images/Temp/Google-Calendar-Icon.png';
import DYMO_Icon from '../../images/Temp/DYMO-Icon.png';
import QuoteApp_Icon from '../../images/Temp/QuoteApp_Icon.png';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import LocalizedLanguage from "../../settings/LocalizedLanguage";
import {getTotalTaxByName} from  "../common/TaxSetting";
// import { product } from "../dashboard/product/productSlice";
// import { addtoCartProduct } from "../dashboard/product/productLogic";
//import { PrintPage } from "../common/PrintPage";
import { get_UDid } from "../common/localSettings";
import ActiveUser from "../../settings/ActiveUser";
const SaleComplete = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const newSale=()=>
    {
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
	const printReceipt=(appResponse = undefined)=> {
        var type = 'completecheckout';
        var address;
        var site_name;
        var register_id = localStorage.getItem('register')
        var location_name = localStorage.getItem('UserLocations') && JSON.parse(localStorage.getItem('UserLocations'));
        var tempOrderId = localStorage.getItem('tempOrder_Id') ? JSON.parse(localStorage.getItem('tempOrder_Id')) : ''
        var siteName = localStorage.getItem('clientDetail') && JSON.parse(localStorage.getItem('clientDetail'));

        var udid = get_UDid;
        var AllProductList = []
        // var idbKeyval = FetchIndexDB.fetchIndexDb();
        // idbKeyval.get('ProductList').then(val => {
        //     if (!val || val.length == 0 || val == null || val == "") {
        //     } else { AllProductList = val; }
        // });

        if (siteName && siteName.subscription_detail && siteName.subscription_detail !== "") {
            if (siteName.subscription_detail.udid == udid) {
                site_name = siteName.subscription_detail.host_name && siteName.subscription_detail.host_name
            }
        }

        location_name && location_name.map(item => {
            if (item.Id == register_id) {
                address = item;
            }
        })
        var order_reciept = localStorage.getItem('orderreciept') && localStorage.getItem('orderreciept') !== 'undefined' ? JSON.parse(localStorage.getItem('orderreciept')) : "";
        var productxList = localStorage.getItem('PRODUCTX_DATA') ? JSON.parse(localStorage.getItem('PRODUCTX_DATA')) : "";
        var TotalTaxByName = (order_reciept && order_reciept.ShowCombinedTax == false) ? getTotalTaxByName(type, productxList) : "";
        var checkList = localStorage.getItem('PrintCHECKLIST') ? JSON.parse(localStorage.getItem('PrintCHECKLIST')) : ""; // localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : "";
        var orderList = localStorage.getItem('oliver_order_payments') ? JSON.parse(localStorage.getItem('oliver_order_payments')) : "";
        //var checkPrintreciept = localStorage.getItem("user") && localStorage.getItem("user") !== '' ? JSON.parse(localStorage.getItem("user")).print_receipt_on_sale_complete : '';
        var orderMeta = localStorage.getItem("GTM_ORDER") && localStorage.getItem("GTM_ORDER") !== undefined ? JSON.parse(localStorage.getItem("GTM_ORDER")) : null;
        var cash_rounding_total = '';
        if (orderMeta !== null && orderMeta.order_meta !== null && orderMeta.order_meta !== undefined) {
            cash_rounding_total = orderMeta.order_meta[0].cash_rounding && orderMeta.order_meta[0].cash_rounding !== null && orderMeta.order_meta[0].cash_rounding !== undefined && orderMeta.order_meta[0].cash_rounding !== 0 ? orderMeta.order_meta[0].cash_rounding : '';
        }
        var findTicketInfo = "";
        if (checkList && checkList != "") {
            findTicketInfo = checkList.ListItem.find(findTicketInfo => (findTicketInfo.ticket_info && findTicketInfo.ticket_info.length > 0))
        }
      
        if (tempOrderId) {
            setTimeout(function () {
                var getPdfdateTime = ''; var isTotalRefund = ''; var cash_rounding_amount = '';
                // console.log("Checklst", checkList);
                if (ActiveUser.key.isSelfcheckout == true) {
                    //PrintPage.PrintElem(checkList, getPdfdateTime = '', isTotalRefund = '', cash_rounding_amount = cash_rounding_total, textToBase64Barcode(tempOrderId), orderList, type, productxList, AllProductList, TotalTaxByName, appResponse)
                }
                else {
					var print_bar_code="";
                   // PrintPage.PrintElem(checkList, getPdfdateTime = '', isTotalRefund = '', cash_rounding_amount = cash_rounding_total, print_bar_code, orderList, type, productxList, AllProductList, TotalTaxByName, 0, appResponse)
                }
                if (ActiveUser.key.isSelfcheckout == true) {
                    setTimeout(function () {
                        //history.push('/selfcheckout')
                    }, 500);
                }
            }, 1000);
            var ServedBy = ''
            var line_items = '';
            if (typeof findTicketInfo !== 'undefined' && findTicketInfo !== "") {
                //callBackTickeraPrintApi(udid, orderList, manager, register, location_name, site_name, ServedBy = '', inovice_Id, line_items, tempOrderId, print_bar_code, type);
            }
        }
    }
    return (
        <React.Fragment>
            <div className="sale-complete-wrapper">
			<div className="main">
				<img src={Sale_Complete} alt="" />
				<div className="change-container">
					<p className="style1">Change: $1.50</p>
					<p className="style2">Out of $2.00</p>
				</div>
				<label className="email-label">
					<input type="email" placeholder="Enter email address here" />
					<button>{LocalizedLanguage.emailReceipt}</button>
				</label>
				<label className="checkbox-label">
					Remember this customer?
					<input type="checkbox" />
					<div className="custom-checkbox">
						<img src={Checkmark} alt="" />
					</div>
				</label>
				<button>{LocalizedLanguage.printReceipt}</button>
				<button id="emailSubwindowButton">{LocalizedLanguage.emailReceipt}</button>
			</div>
			<div className="footer">
				<div className="button-container">
					<button id="endSession">
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
				<div className="button-container" onClick={()=>newSale()}>
					<button id="newSale">{LocalizedLanguage.newSale}</button>
				</div>
			</div>
		</div>
        </React.Fragment>)
    // }

}
export default SaleComplete 