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
// import { product } from "../dashboard/product/productSlice";
// import { addtoCartProduct } from "../dashboard/product/productLogic";

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