import React, { useState,useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import X_Icon_DarkBlue from '../../../images/svg/X-Icon-DarkBlue.svg';
import { product } from "../../dashboard/product/productSlice";
import { addtoCartProduct } from "../../dashboard/product/productLogic";
const OrderNote = (props) => {
    const [note,setNote]=useState('');
    const dispatch = useDispatch();
    const handleNote = () => {
        if(note!="")
        {
            var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];//this.state.cartproductlist;
            cartlist = cartlist == null ? [] : cartlist;
            cartlist.push({ "Title": note })
            addtoCartProduct(cartlist);
            dispatch(product());
            var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
            if (list != null) {
                const CheckoutList = {
                    ListItem: cartlist,
                    customerDetail: list.customerDetail,
                    totalPrice: list.totalPrice,
                    discountCalculated: list.discountCalculated,
                    tax: list.tax,
                    subTotal: list.subTotal,
                    TaxId: list.TaxId,
                    order_id: list.order_id !== 0 ? list.order_id : 0,
                    showTaxStaus: list.showTaxStaus,
                    _wc_points_redeemed: list._wc_points_redeemed,
                    _wc_amount_redeemed: list._wc_amount_redeemed,
                    _wc_points_logged_redemption: list._wc_points_logged_redemption
                }
                localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList))
            }
            setNote('');
           
            props.toggleOrderNote();
        }
    }

    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleOrderNote();
        }
    }
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? "subwindow add-order-note current" : "subwindow add-order-note"}>
                <div className="subwindow-header">
                    <p>Add Order Note</p>
                    <button className="close-subwindow" onClick={() => props.toggleOrderNote()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="auto-margin-top"></div>
                    <label htmlFor="orderNote">Enter a note for this order:</label>
                    <textarea name="order-note" id="orderNote" placeholder="Add note to order" value={note} onChange={(e)=>setNote(e.target.value)}></textarea>
                    <button onClick={()=>handleNote()}>Add Note</button>
                    <div className="auto-margin-bottom"></div>
                </div>
            </div>
        </div>)
}

export default OrderNote 