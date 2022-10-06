import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import AngledBracket_Left_Blue from '../../images/svg/AngledBracket-Left-Blue.svg'
import EmptyCart from '../../images/svg/EmptyCart.svg'
import person from '../../images/svg/person.svg'
import { get_customerName, get_UDid, get_userName } from '../common/localSettings';

import STATUSES from "../../constants/apiStatus";
import { useNavigate } from 'react-router-dom';
import LeftNavBar from "../common/commonComponents/LeftNavBar";
import Header from "../checkout/Header";
import RefundCartListBody from "./RefundCartListBody";
import { RoundAmount, typeOfTax } from "../common/TaxSetting";
import { popupMessage } from "../common/commonAPIs/messageSlice";
import { NumericFormat } from 'react-number-format';
import LocalizedLanguage from "../../settings/LocalizedLanguage";
import NumberPad from "../common/commonComponents/NumberPad";
import { GetRoundCash } from "../../settings/CheckoutFunction";
import PartialPayment from "../checkout/PartialPayment";
import ActiveUser from '../../settings/ActiveUser';

const Refund = () => {
    
    const [subTotal, setSubTotal] = useState(0.00);
    const [taxes, setTaxes] = useState(0.00);
    const [discount, setDiscount] = useState(0.00);
    const [total, setTotal] = useState(0.00);
    const [discountType, setDiscountType] = useState('');
    const [isShowNumberPad, setisShowNumberPad] = useState(false);
    const [isShowPartialPayment, setisShowPartialPayment] = useState(false);
    const [balance, setbalance] = useState(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    var cash_rounding = ActiveUser.key.cash_rounding;

    const toggleNumberPad = () => {
        setisShowNumberPad(!isShowNumberPad)
    }
    const toggleShowPartialPayment = () => {
        setisShowPartialPayment(!isShowPartialPayment)
    }
    const pay_amount = (item) => {
        if (item.Name.toLowerCase() === "cash")
        {
            toggleNumberPad()
        }
    }
    const getDiscountAmount_Type = () => {
        if (localStorage.getItem("CART")) {
            let cart = JSON.parse(localStorage.getItem("CART"));
            let dtype = cart.discountType === "Percentage" ? '%' : "$";
            let damount = cart.discount_amount;
            setDiscountType(damount + "" + dtype);
        }
        else {
            setDiscountType('')
        }
    }


    const setValues = (st, tx, dis, tt) => {
        getDiscountAmount_Type();
        setSubTotal(RoundAmount(st));
        setTaxes(RoundAmount(tx));
        setDiscount(RoundAmount(dis));
        setTotal(RoundAmount(tt));
        setbalance(RoundAmount(tt))
    }

    var paymentTypeName = localStorage.getItem("PAYMENT_TYPE_NAME") ? JSON.parse(localStorage.getItem("PAYMENT_TYPE_NAME")) : [];
    //Arranging array to put cash and card type in the first and the second 
    if (paymentTypeName && paymentTypeName.length > 0) {
        var card = paymentTypeName.find(a => a.Name.toLowerCase() === "card");
        var cash = paymentTypeName.find(a => a.Name.toLowerCase() === "cash");
        paymentTypeName = paymentTypeName.filter(a => a.Name.toLowerCase() != "cash" && a.Name.toLowerCase() != "card");
        if (card && typeof card != "undefined")
            paymentTypeName.unshift(card);
        if (cash && typeof cash != "undefined")
            paymentTypeName.unshift(cash);
    }

    return (<React.Fragment>
        <div className="refund-wrapper">
            <LeftNavBar ></LeftNavBar>
            <Header title={LocalizedLanguage.refundTitle}></Header>
            <div className="cart">
                <div className="refund-cart-header">
                    {get_customerName() == null ?
                        null :
                        <div className="cart-customer">
                            <div className="avatar">
                                <img src={person} alt="" />
                            </div>
                            <div className="text-col">
                                <p className="style1">{get_customerName().Name}</p>
                                <p className="style2">{get_customerName().Email}</p>
                            </div>
                        </div>
                    }
                </div>
                <RefundCartListBody setValues={setValues}></RefundCartListBody>
                <div className="footer">
                    <div className="totals">
                        <div className="row">
                            <p>Subtotal</p>
                            <p><b>${<NumericFormat value={subTotal} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</b></p>
                        </div>

                        {/* {discountType !="" ?
                            <div className="row">
                                <p>Cart Discount - {discountType}</p>
                                <button id="editCartDiscount" onClick={() => props.toggleEditCartDiscount()}>edit</button>
                                <p><b>-${<NumericFormat  value={discount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</b></p>
                            </div> : null} */}

                        {discountType != "" ?
                            <div className="row">
                                <p>Cart Discount - {discountType}</p>
                                <p><b>-${<NumericFormat value={discount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</b></p>
                            </div> : null}

                        {taxes !== 0 ?
                            <div className="row">
                                <p>Taxes {typeOfTax() == 'incl' ? LocalizedLanguage.inclTax : LocalizedLanguage.exclTax}</p>
                                <p><b>${<NumericFormat value={taxes} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</b></p>
                            </div> : null}
                        <div className="row">
                            <p><b>Total</b></p>
                            <p><b>${<NumericFormat value={total} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</b></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="refund-body">
				<button id="balanceButton" class="balance-container" onClick={()=>toggleShowPartialPayment()}>
					<div class="row">
						<p class="style1">Refund Amount</p>
						<p class="style2">$0.00</p>
					</div>
				</button>
				<p class="style1">Click to make a partial payment</p>
				<p class="style2">Quick Split</p>
				<div class="button-row">
					<button>1/2</button>
					<button>1/3</button>
					<button>1/4</button>
				</div>
				<div class="button-row">
					<button id="splitByProductButton">By Product</button>
					<button id="splitByPeopleButton">By People</button>
				</div>
				<p class="style2">Customer Payment Types</p>
				<p class="style3">Please add a customer to make customer payment types available</p>
				<div class="button-row">
					{/* <button disabled>Layaway</button>
					<button disabled>Store Credit</button> */}
                    <button disabled ={get_customerName() == null?true:false}>Layaway</button>
                    <button disabled ={get_customerName() == null?true:false}>Store Credit</button>
				</div>
				<div class="payment-types">
					<p>Payment Types</p>
					<div class="button-container">
                    {
                            paymentTypeName && paymentTypeName.length > 0 && paymentTypeName.map(payment => {
                                return <button style={{ backgroundColor: payment.ColorCode, borderColor: payment.ColorCode }} key={payment.Id} onClick={()=>pay_amount(payment)}>
                                    {payment.Name}
                                    {/* <img src="../Assets/Images/SVG/spongebob-squarepants-2.svg" alt="" /> */}
                                </button>
                            })
                        }
					</div>
				</div>
			</div>
          
        </div>
        <NumberPad isShow={isShowNumberPad} toggleNumberPad={toggleNumberPad}></NumberPad>
        <PartialPayment isShow={isShowPartialPayment} toggleShowPartialPayment={toggleShowPartialPayment}></PartialPayment>
        </React.Fragment>)
}
export default Refund