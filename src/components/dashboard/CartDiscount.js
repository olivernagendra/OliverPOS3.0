import React, { useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';
const CartDiscount = () => {
    return (
        <div className="subwindow cart-discount">
            <div className="subwindow-header">
                <p>Add Cart Discount</p>
                <button className="close-subwindow">
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
        </div>)
}

export default CartDiscount 