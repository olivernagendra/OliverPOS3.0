import React, { useState} from "react";
import X_Icon_DarkBlue from '../../../assets/images/svg/X-Icon-DarkBlue.svg';
import {  singleProductDiscount } from "./productLogic";
const ProductDiscount = (props) => {
    const [discountAmount, setDiscountAmount] = useState("");
    const [txtValue, setTxtValue] = useState("")
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            setDiscountAmount("");
            setTxtValue("");
            props.toggleProductDiscount();
        }
    }
    const closePopup = () => {
        setDiscountAmount("");
        setTxtValue("");
        props.toggleProductDiscount();

    }
    const discount_Amount = (a) => {
        //console.log(/^\d+(\.\d{1,2})?$/.test(a.key.toString()))
        if (a.key !== "Backspace" && a.key !== "backspace") {
            if ((/^\d+(\.\d{1,2})?$/.test(a.key.toString())) === false) { return; }
        }
        var str = "";
        if (a.key === "Backspace" || a.key === "backspace") {
            str = txtValue.substring(0, txtValue.length - 1);
        }
        else {
            str = txtValue + a.key;
        }
        setTxtValue(str);
        setDiscountAmount((parseFloat(str) / 100).toFixed(2));
    }
    const handleDiscount = (discount_Type) => {
        //const { discountAmount } = this.state;
        if (discountAmount == ".") {
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
            setDiscountAmount("");
            setTxtValue("");

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
                    <button className="close-subwindow" onClick={() => closePopup()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="auto-margin-top"></div>
                    <label htmlFor="productDiscount">Discount amount:</label>
                    <input style={{ direction: "LTL" }} type="number" id="productDiscount" placeholder="0" value={discountAmount} onKeyDown={(e) => discount_Amount(e)} />
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