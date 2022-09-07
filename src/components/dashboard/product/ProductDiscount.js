import React, { useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../../images/svg/X-Icon-DarkBlue.svg';
import { useNavigate } from 'react-router-dom';
const ProductDiscount = (props) => {
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleProductDiscount();
        }
    }
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? "subwindow product-discount current" : "subwindow product-discount"}>
                <div className="subwindow-header">
                <p>Add Product Discount</p>
                    <button className="close-subwindow" onClick={()=>props.toggleProductDiscount()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                            <div className="auto-margin-top"></div>
                            <label htmlFor="productDiscount">Discount amount:</label>
                            <input type="number" id="productDiscount" placeholder="0" />
                            <p>Select type of discount to be applied to product:</p>
                            <div className="button-row">
                                <button>$ Discount</button>
                                <button>% Discount</button>
                            </div>
                            <div className="auto-margin-bottom"></div>
                        </div>
            </div></div>)
}

export default ProductDiscount 