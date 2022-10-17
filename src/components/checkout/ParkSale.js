import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { product } from "../dashboard/product/productSlice";
import { addtoCartProduct } from "../dashboard/product/productLogic";
import X_Icon_DarkBlue from '../../assets/images/svg/X-Icon-DarkBlue.svg';

const ParkSale = (props) => {
    const [note,setNote]=useState('');
    const dispatch = useDispatch();
    // const doParkSale = () => {
    //     if(note!="" && props && props.addNote)
    //     {
    //         props.addNote(note);
    //         setNote('');
    //         props.toggleParkSale();
    //     }
    // }
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
            //props.addNote('park_sale');
            props.toggleParkSale(props.isLayAwayOrPark);
            props.placeParkLayAwayOrder(props.isLayAwayOrPark);
        }
    }
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleParkSale(props.isLayAwayOrPark);
        }
    }
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? "subwindow park-sale current" : "subwindow park-sale"}>
                <div className="subwindow-header">
                    <p>{props.isLayAwayOrPark==="park_sale"?"Park Sale":"Layaways"}</p>
                    <button className="close-subwindow" onClick={() => props.toggleParkSale()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="auto-margin-top"></div>
                    <label htmlFor="parkSaleNote">Add a note for this {props.isLayAwayOrPark==="park_sale"?"parked sale":"layaway"}:</label>
                    <textarea name="park-sale" id="parkSaleNote" placeholder="Add note or explanation here." value={note} onChange={(e)=>setNote(e.target.value)}></textarea>
                    <button onClick={()=>handleNote()}>Save</button>
                    <div className="auto-margin-bottom"></div>
                </div>
            </div>
        </div>)
}

export default ParkSale 