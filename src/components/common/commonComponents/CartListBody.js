import React, { useState, useEffect } from "react";
import EmptyCart from '../../../assets/images/svg/EmptyCart.svg';
import { RoundAmount } from "../TaxSetting";
import STATUSES from "../../../constants/apiStatus";
import { useSelector } from 'react-redux';
import { NumericFormat } from 'react-number-format';
const CartListBody = (props) => {
    const [taxRate, setTaxRate] = useState(0.00);
    const [listItem, setListItem] = useState([]);
    useEffect(() => {
        calculateCart();
    }, [listItem]);
    const [resProduct] = useSelector((state) => [state.product])
    useEffect(() => {
        if (resProduct && resProduct.status == STATUSES.IDLE && resProduct.is_success) {
            setListItem(resProduct.data);
        }
    }, [resProduct]);
    const calculateCart = () => {
        var _subtotal = 0.0;
        var _total = 0.0;
        var _taxAmount = 0.0;
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
        var taxratelist = [];
        if ((typeof localStorage.getItem('TAXT_RATE_LIST') !== 'undefined') && localStorage.getItem('TAXT_RATE_LIST') !== null) {
            taxratelist = localStorage.getItem('TAXT_RATE_LIST') && JSON.parse(localStorage.getItem('TAXT_RATE_LIST'));
        }
        if (taxratelist && taxratelist !== null && taxratelist !== "undefined") {
            taxratelist && taxratelist.length > 0 && taxratelist.map(tax => {
                _taxId.push(tax.TaxId);
                _taxRate.push(tax.TaxRate);
                if (tax.check_is == true) {
                    TaxIs.push({ [tax.TaxId]: parseFloat(tax.TaxRate) })
                }
            })
            setTaxRate(_taxRate);
        }
        _taxRate = taxRate;
        listItem && listItem.map((item, index) => {
            if (item.Price) {
                _subtotalPrice += item.Price
                _subtotalDiscount += parseFloat(item.discount_amount == null || isNaN(item.discount_amount) == true ? 0 : item.discount_amount)
                if (item.product_id) {//donothing  
                    var isProdAddonsType = "";//CommonJs.checkForProductXAddons(item.product_id);// check for productX is Addons type products                  
                    _exclTax += item.excl_tax ? item.excl_tax : 0;
                    _inclTax += item.incl_tax ? item.incl_tax : 0;
                    _cartDiscountAmount += item.cart_discount_amount;
                    // _productDiscountAmount += item.discount_type == "Number" ? item.product_discount_amount:item.product_discount_amount; // quantity commment for addons
                    _productDiscountAmount += item.discount_type == "Number" ? item.product_discount_amount : item.product_discount_amount * (isProdAddonsType && isProdAddonsType == true ? 1 : item.quantity);
                }
                else {
                    _customFee += item.Price;
                    _exclTax += item.excl_tax ? item.excl_tax : 0;
                    _inclTax += item.incl_tax ? item.incl_tax : 0;
                }
            }
        })
        _seprateDiscountAmount = _subtotalPrice - _subtotalDiscount;
        _subtotal = _subtotalPrice - _productDiscountAmount;
        _totalDiscountedAmount = _subtotalDiscount;
        if (_taxRate) {
            _taxAmount = parseFloat(_exclTax) + parseFloat(_inclTax);
        }
        _total = parseFloat(_seprateDiscountAmount) + parseFloat(_exclTax);
        var _dis=_cartDiscountAmount > 0 ? RoundAmount(_cartDiscountAmount) : 0;
        
        props.setValues && props.setValues(_subtotal,RoundAmount(_taxAmount) ,_dis,_total);
    }
    return (
        <div className="body">
            <img src={EmptyCart} alt="" />
            {listItem && listItem.length > 0 && listItem.map(a => {
                var notes =  listItem.find(b => b.hasOwnProperty('pid') && a.hasOwnProperty('product_id') && (b.pid === a.product_id /*&& b.vid === a.variation_id*/));
                var item_type = "";
                if ((!a.hasOwnProperty('Price') || a.Price == null) && !a.hasOwnProperty('product_id')) {
                    item_type = "no_note";
                }
                else if (a.hasOwnProperty('product_id')) { item_type = "product"; }
                else if (a.hasOwnProperty('Price') && !a.hasOwnProperty('product_id')) { item_type = "custom_fee"; }
                if ((!a.hasOwnProperty('Price') || a.Price == null) && !a.hasOwnProperty('product_id')&& !a.hasOwnProperty('pid')) { item_type = "note"; }
                switch (item_type) {
                    case "product":
                        return <div className="cart-item">
                        <div className="main-row" >
                            <p className="quantity">{a.quantity && a.quantity}</p>
                            <p className="content-style">{a.Title && a.Title}</p>
                            <p className="price">
                                <NumericFormat className={a.product_discount_amount !=0?"strike-through":""} value={a.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                            </p>
                            {a.product_discount_amount !=0 &&
                            <p className="price" >
                                <NumericFormat value={a.discount_type == "Number" ? a.Price - (a.product_discount_amount):a.Price - (a.product_discount_amount * a.quantity)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                            </p>
                            }
                        </div>
                        <div className="secondary-col">
                        {typeof notes!="undefined" &&  notes!="" && <p>**Note: {notes.Title}</p>}
                        </div>
                    </div>
                    case "note":
                        return <div className="cart-item">
                        <div className="main-row aligned">
                            <div className="tag cart-note">Note</div>
                            <p className="content-style line-capped">
                            {a.Title && a.Title}
                            </p>
                        </div>
                    </div>
                    case "custom_fee":
                        return <div className="cart-item">
                            <div className="main-row aligned">
                                <div className="tag custom-fee">Custom Fee</div>
                                <div className="content-style">{a.Title && a.Title}</div>
                                <div className="price">{a.Price && a.Price}</div>
                            </div>
                        </div>
                    case "group":
                        return   <div className="cart-item">
                        <div className="main-row aligned">
                            <div className="tag group">Group</div>
                            <p className="content-style">{a.Title && a.Title}</p>
                        </div>
                    </div>
                    default:
                        return null;
                }
            })}
        </div>)
}
export default CartListBody