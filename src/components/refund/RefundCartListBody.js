import React, { useState, useEffect } from "react";
import EmptyCart from '../../assets/images/svg/EmptyCart.svg';
import Minus_Blue from '../../assets/images/svg/Minus-Blue.svg';
import Plus_Blue from '../../assets/images/svg/Plus-Blue.svg';
import { RoundAmount } from "../common/TaxSetting";
import STATUSES from "../../constants/apiStatus";
import { useSelector } from 'react-redux';
import { NumericFormat } from 'react-number-format';
import { getInclusiveTaxType } from "../../settings";
const RefundCartListBody = (props) => {
    const [taxRate, setTaxRate] = useState(0.00);
    const [listItem, setListItem] = useState([]);
    const [getorder, setGetorder] = useState({});
    useEffect(() => {
        calculateCart();

    }, [listItem]);
    useEffect(() => {
        if (localStorage.getItem("getorder")) {
            var _getorder = JSON.parse(localStorage.getItem("getorder"));
            setGetorder(_getorder)
            setListItem(_getorder.line_items);
           
        }
    }, []);
    const updateQuantity = (id, type) => {
        var _listItem = listItem;

        var _item = _listItem && _listItem.find(a => a.line_item_id === id);
        if (_item && typeof _item != "undefined") {
            if (_item.hasOwnProperty("quantity_to_refund")) {
                if (type === "inc") {
                    if ((_item.quantity - Math.abs(_item.quantity_refunded)) > _item.quantity_to_refund)
                        _item.quantity_to_refund = _item.quantity_to_refund + 1
                }
                else if (type === "dec") {
                    if (_item.quantity_to_refund > 0) { _item.quantity_to_refund = _item.quantity_to_refund - 1; }
                    else { console.log("it can note be less than one") }
                }
            }
            else {
                if (type === "inc") {
                    _item["quantity_to_refund"] = 1
                }
            }
        }
        setListItem(_listItem);
        calculateCart();
        props.setRefresh(!props.refresh);
    }
    const calculateCart = () => {

        var refund_subtotal = 0.0;
        var refund_total = getorder ? parseFloat(getorder.total_amount).toFixed(2) : 0.0;
        var refund_tax = 0.0;
        var _totalDiscountedAmount = 0.0;
        var _customFee = 0.0;
        var _exclTax = 0;
        var _inclTax = 0;
        var _taxId = [];
        var _taxRate = [];
        var TaxIs = [];
        var _subtotalPrice = 0.00;
        var _subtotalDiscount = 0.00;
        var _cartDiscountAmount = 0.00;
        var _productDiscountAmount = 0.00;
        var _seprateDiscountAmount = 0.00;
        
        var total_refund_amount = getorder && getorder.total_amount;
        var cash_rounding_amount = getorder && getorder.cash_rounding_amount;
        var taxInclusiveName = getorder?getInclusiveTaxType(getorder.meta_datas):"";
        listItem && listItem.map((item, index) => {
            if (item.hasOwnProperty("quantity_to_refund") && item.quantity_to_refund > 0) {
                refund_subtotal += item.price * item.quantity_to_refund;
                //if(item.isTaxable===true)
                {
                    refund_tax+= (parseFloat(item.total_tax/item.quantity) * item.quantity_to_refund);
                }
                if (taxInclusiveName && taxInclusiveName !== "") { //in inclusive tax need to add tax intosub total
                    refund_subtotal += refund_tax;
                }
                refund_total = (parseFloat(refund_subtotal) + parseFloat(taxInclusiveName == "" ? refund_tax : 0)); //added tax for exclusive tax
                if (refund_total + (cash_rounding_amount) == total_refund_amount) {
                    refund_total = refund_total + (cash_rounding_amount)
                }
            }
        })
      
        var _dis = _cartDiscountAmount > 0 ? RoundAmount(_cartDiscountAmount) : 0;

        props.setValues && props.setValues(refund_subtotal, RoundAmount(refund_tax), _dis, refund_total);
    }
    return (
        <div className="body">
            <img src={EmptyCart} alt="" />
            {(props.refresh == false || props.refresh == true) && listItem && listItem.length > 0 && listItem.map(item => {
                return <div className="cart-item">
                    <div className="main-row">
                        <p className="quantity">{item.quantity - Math.abs(item.quantity_refunded)}</p>
                        <p className="content-style">{item.name}</p>
                        <p className="price">${parseFloat(item.price*(item.quantity - Math.abs(item.quantity_refunded))).toFixed(2)}</p>
                    </div>
                    <div className="increment-input">
                        <button onClick={() => updateQuantity(item.line_item_id, 'dec')}>
                            <img src={Minus_Blue} alt="" />
                        </button>
                        <input type="text" readOnly value={(item.hasOwnProperty("quantity_to_refund") ? item.quantity_to_refund : "0") + "/" + (item.quantity - Math.abs(item.quantity_refunded))} />
                        {/* <input type="text" readOnly defaultValue={item.quantity_to_refund} /> */}
                        <button onClick={() => updateQuantity(item.line_item_id, 'inc')}>
                            <img src={Plus_Blue} alt="" />
                        </button>
                    </div>
                </div>
            })}


        </div>)
}
export default RefundCartListBody