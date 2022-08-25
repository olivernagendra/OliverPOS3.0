import React, { useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';
const OrderNote = () => {
    return (
        <div className="subwindow add-order-note">
        <div className="subwindow-header">
            <p>Add Order Note</p>
            <button className="close-subwindow">
                <img src={X_Icon_DarkBlue} alt="" />
            </button>
        </div>
        <div className="subwindow-body">
            <div className="auto-margin-top"></div>
            <label htmlFor="orderNote">Enter a note for this order:</label>
            <textarea name="order-note" id="orderNote" placeholder="Add note to order"></textarea>
            <button>Add Note</button>
            <div className="auto-margin-bottom"></div>
        </div>
    </div>)
}

export default OrderNote 