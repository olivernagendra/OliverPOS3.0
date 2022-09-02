import React, { useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';
const CartDiscount = (props) => {
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleCartDiscount();
        }
        else {
            e.stopPropagation();
        }
        console.log(e.target.className)
    }
    return (
        <div className={props.isShow===true?"subwindow-wrapper":"subwindow-wrapper hidden"} onClick={(e)=>outerClick(e)}>
        <div className={props.isShow===true? "subwindow cart-discount current":"subwindow cart-discount"}>
            <div className="subwindow-header">
                <p>Add Cart Discount</p>
                <button className="close-subwindow" onClick={()=>props.toggleCartDiscount()}>
                    <img src={X_Icon_DarkBlue} alt="" />
                </button>
            </div>
            <div className="subwindow-body">
                <label htmlFor="cartDiscountAmount">Discount amount:</label>
                <input type="number" id="cartDiscountAmount" placeholder="0" />
                <p>Select type of discount to be applied to cart:</p>
                <div className="button-row">
                    <button id="dollarDiscount">$ Discount</button>
                    <button id="percentDiscount">% Discount</button>
                </div>
            </div>
        </div></div>)
}

export default CartDiscount 