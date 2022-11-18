import React, { useState, useEffect, useRef } from "react";
import X_Icon_DarkBlue from '../../assets/images/svg/X-Icon-DarkBlue.svg';

import { chunkArray } from "../common/localSettings";
import LocalizedLanguage from "../../settings/LocalizedLanguage";
const PartialPayment = (props) => {
    const inputElement = useRef(null);
    const [txtValue, setTxtValue] = useState(0)
    const [pbpCount, setpbpCount] = useState(0)
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleShowPartialPayment();
            localStorage.removeItem("paybyproduct_unpaid");
        }
    }
    const popupClose = () => {
        props.toggleShowPartialPayment();
        localStorage.removeItem("paybyproduct_unpaid");
    }
    useEffect(() => {
        if (props.getRemainingPrice && props.partialType == "") {
            var _amount = props.getRemainingPrice();
            setTxtValue(parseFloat(_amount).toFixed(2));
            inputElement.autoFocus = true;
        }
        else if (props.getRemainingPrice && props.partialType != "") {
            if (props.partialType === "pay_by_product") {
                var paybyproduct = localStorage.getItem("paybyproduct_unpaid") ? JSON.parse(localStorage.getItem("paybyproduct_unpaid")) : null;
                var _amount = 0;
                if (paybyproduct != null && paybyproduct.length > 0) {
                    paybyproduct.map(p => {
                        _amount += p.total;
                    });
                    setTxtValue(_amount);
                    var count = paybyproduct.filter(a => a.hasOwnProperty("unpaid_qty") && a.unpaid_qty > 0);
                    setpbpCount(count != null && typeof count != "undefined" ? count.length : 0);
                }
            }
            else {
                var _amount = props.getRemainingPrice();
                setTxtValue(parseFloat(_amount / parseInt(props.partialType)).toFixed(2));
            }

        }
        // if(props && props.amount)
        // setTxtValue(props.amount);
    }, [props.amount]);
    const setValue = (type) => {
        props.pay_partial && props.pay_partial(txtValue, type);
    }
    const onChange = (e) => {
        const re = /^[0-9\.]+$/;
        var val = e.target.value
        if (val === '' || re.test(val)) {
            if (val.split('.').length > 2)
                val = val.replace(/\.+$/, "");
            setTxtValue(val)
        }
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

    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? "subwindow partial-payment current" : "subwindow partial-payment"}>
                <div className="subwindow-header">
                    <p> {props.partialType == "" ? "Partial Payments" : "Split Payments"}</p>
                    <button className="close-subwindow" onClick={() => popupClose()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="auto-margin-top"></div>
                    {props.partialType != "" ?
                        <React.Fragment><br />
                            <div className="partial-text-row">
                                <p className="style1">Total balance due:</p>
                                <p className="style2">${parseFloat(props.getRemainingPrice()).toFixed(2)}</p>
                            </div>
                            <div className="partial-text-row">
                                <p className="style1">Split Type:</p>
                                <p className="style2">{props.partialType === "pay_by_product" ? "By Product (" + pbpCount + ") " : "Person(" + props.partialType + ")"}</p>
                            </div>
                            <div className="partial-text-row">
                                <p className="style1">Amount per payment:</p>
                                <p className="style2">${parseFloat(txtValue).toFixed(2)}</p>
                            </div><br />
                        </React.Fragment>
                        // <div className="partial-text-row">
                        //     <label htmlFor="partialPaymentAmount">Total balance due: ${parseFloat(props.getRemainingPrice()).toFixed(2)}</label><br />
                        //     <label htmlFor="partialPaymentAmount">Split Type: {props.partialType === "pay_by_product"?"By Product":"Person("+props.partialType+")"}</label><br />
                        //     <label htmlFor="partialPaymentAmount">Amount per payment: ${txtValue}</label><br /><br />
                        // </div>
                        :
                        <React.Fragment><label htmlFor="partialPaymentAmount">Enter partial payment amount:</label>
                            <input ref={inputElement} autoFocus={true} type="number" id="partialPaymentAmount" placeholder="0.00" value={txtValue} onChange={e => onChange(e)} disabled={props.partialType == "" ? false : true} /></React.Fragment>
                    }
                    <p>Select Payment Type</p>
                    <div className="payment-types">
                        {
                            paymentTypeName && paymentTypeName.length > 0 && paymentTypeName.map(payment => {
                                return <button style={{ backgroundColor: payment.ColorCode, borderColor: payment.ColorCode }} key={payment.Id} onClick={() => setValue(payment)}>
                                    {payment.Name}
                                    {/* <img src="../Assets/Images/SVG/spongebob-squarepants-2.svg" alt="" /> */}
                                </button>
                            })
                        }
                        {/* <button>Cash</button>
                <button className="background-coral">Card</button>
                <button>
                    <img src="../Assets/Images/SVG/spongebob-squarepants-2.svg" alt="" />
                </button>
                <button className="background-red">Placeholder</button>
                <button className="background-teal">Placeholder</button>
                <button className="background-cyan">Placeholder</button>
                <button className="background-violet">Placeholder</button>
                <button className="background-yellow">Placeholder</button> */}
                    </div>
                    <div className="auto-margin-bottom"></div>
                </div>
            </div></div>)
}
export default PartialPayment 