import React, {useState, useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../../images/svg/X-Icon-DarkBlue.svg';
import { useNavigate } from 'react-router-dom';
import { product } from "./productSlice";
import { addtoCartProduct,singleProductDiscount,addSimpleProducttoCart } from "./productLogic";
const ProductDiscount = (props) => {
    const [discountAmount, setDiscountAmount] = useState("");
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleProductDiscount();
        }
    }
   const  handleDiscount=(discount_Type)=> {
        //const { discountAmount } = this.state;
        if(discountAmount==".")
        {
            return;
        }
        const { selecteditem } = props;
        var discount_amount = discountAmount ? discountAmount : 0;
        //var product = selecteditem;
        // var discount_type = jQuery('#CalcType').text();
        if (selecteditem) {
            var product = {
                type: 'product',
                discountType: discount_Type == "%" ? 'Percentage' : 'Number',
                discount_amount,
                Tax_rate: 0, //this.props.taxratelist.TaxRate,
                Id: selecteditem.id,
            }
            // jQuery('#CalcType').text(Keys.key.DuscountAmountType);
            // jQuery('#lbPercent').text("%");
            // this.buttonDisable(false);
            setDiscountAmount("");

            // this.setState({
            //     discountAmount: 0,
            //     is_checked_clr: false,
            //     is_checked: false
            // })
            localStorage.setItem("PRODUCT", JSON.stringify(product))
            localStorage.setItem("SINGLE_PRODUCT", JSON.stringify(selecteditem))
            singleProductDiscount();
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
                            <input type="number" id="productDiscount" placeholder="0" value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)}/>
                            <p>Select type of discount to be applied to product:</p>
                            <div className="button-row">
                                <button onClick={() => handleDiscount('$')}>$ Discount</button>
                                <button onClick={() => handleDiscount('%')}>% Discount</button>
                            </div>
                            <div className="auto-margin-bottom"></div>
                        </div>
            </div></div>)
}

export default ProductDiscount 