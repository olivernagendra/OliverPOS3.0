import React, { useState, useEffect } from "react"

import X_Icon_DarkBlue from '../../../../assets/images/svg/X-Icon-DarkBlue.svg';
import Checkout_Minus from '../../../../assets/images/svg/Checkout-Minus.svg';
import Checkout_Plus from '../../../../assets/images/svg/Checkout-Plus.svg';

const SplitByProduct = (props) => {
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleSplitByProduct && props.toggleSplitByProduct();
        }
    }
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? "subwindow split-by-product current" : "subwindow split-by-product"}>
                <div className="subwindow-header">
                    <p>Split by Product</p>
                    <button className="close-subwindow" onClick={() => props.toggleSplitByProduct()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="body">
                        <div className="product-row">
                            <div className="main-row">
                                <div className="text-group">
                                    <p>Wool Hat</p>
                                    <p>$12.99</p>
                                </div>
                                <div className="increment-input">
                                    <button>
                                        <img src={Checkout_Minus} alt="" />
                                    </button>
                                    <input type="text" readonly value="0/3" />
                                    <button>
                                        <img src={Checkout_Plus} alt="" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="product-row">
                            <div className="main-row">
                                <div className="text-group">
                                    <p>Oliver Hoodie</p>
                                    <p>$42.99</p>
                                </div>
                                <div className="increment-input">
                                    <button>
                                        <img src={Checkout_Minus} alt="" />
                                    </button>
                                    <input type="text" readonly value="0/3" />
                                    <button>
                                        <img src={Checkout_Plus} alt="" />
                                    </button>
                                </div>
                            </div>
                            <div className="secondary-row">
                                <p>Red, Size 45, Leather Edition, with extra long shoe laces</p>
                            </div>
                        </div>
                        <div className="product-row">
                            <div className="main-row">
                                <div className="text-group">
                                    <p>Blue Sneaker</p>
                                    <p>$39.50</p>
                                </div>
                                <div className="increment-input">
                                    <button>
                                        <img src={Checkout_Minus} alt="" />
                                    </button>
                                    <input type="text" readonly value="0/3" />
                                    <button>
                                        <img src={Checkout_Plus} alt="" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <button>Save Count</button>
                    </div>
                </div>
            </div></div>)
}
export default SplitByProduct 