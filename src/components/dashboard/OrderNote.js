import React, { useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';
const OrderNote = (props) => {
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleOrderNote();
        }
        else {
            e.stopPropagation();
        }
        console.log(e.target.className)
    }
    return (
        <div className={props.isShow===true?"subwindow-wrapper":"subwindow-wrapper hidden"} onClick={(e)=>outerClick(e)}>
        <div className={props.isShow===true? "subwindow add-order-note current":"subwindow add-order-note"}>
        <div className="subwindow-header">
            <p>Add Order Note</p>
            <button className="close-subwindow" onClick={()=>props.toggleOrderNote()}>
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
    </div>
    </div>)
}

export default OrderNote 