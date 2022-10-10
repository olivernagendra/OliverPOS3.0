import React, { useState, useEffect, useRef } from "react";
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';

import { chunkArray } from "../common/localSettings";
import LocalizedLanguage from "../../settings/LocalizedLanguage";
const PartialPayment = (props) => {
    const inputElement = useRef(null);
    const [txtValue, setTxtValue] = useState(0)
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
             props.toggleShowPartialPayment();
        }
    }
    useEffect(() => {
        if(props.getRemainingPrice)
        {
          var _amount=  props.getRemainingPrice();
          setTxtValue(parseFloat(_amount).toFixed(2));
          inputElement.autoFocus=true;
        }
        // if(props && props.amount)
        // setTxtValue(props.amount);
    },[props.amount]);
    const setValue=(type)=>
    {
        props.pay_partial && props.pay_partial(txtValue,type);
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
                    <p>Partial Payments</p>
                    <button className="close-subwindow" onClick={()=>props.toggleShowPartialPayment()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="auto-margin-top"></div>
                    <label htmlFor="partialPaymentAmount">Enter partial payment amount:</label>
                    <input ref={inputElement} autoFocus={true} type="number" id="partialPaymentAmount" placeholder="0.00" value={txtValue} onChange={e => onChange(e)}/>
                    <p>Select Payment Type</p>
                    <div className="payment-types">
                        {
                            paymentTypeName && paymentTypeName.length > 0 && paymentTypeName.map(payment => {
                                return <button style={{ backgroundColor: payment.ColorCode, borderColor: payment.ColorCode }} key={payment.Id} onClick={()=>setValue(payment.Code)}>
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