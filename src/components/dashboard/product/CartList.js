import React, { useState,useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import X_Icon_DarkBlue from '../../../images/svg/X-Icon-DarkBlue.svg';
import EmptyCart from '../../../images/svg/EmptyCart.svg';
import CircledX_Grey from '../../../images/svg/CircledX-Grey.svg';
import { deleteProduct } from './productLogic';
import { RoundAmount } from "../../common/TaxSetting";

import { product } from "./productSlice";
const CartList = (props) => {
    const dispatch = useDispatch();
    const [subTotal, setSubTotal] = useState(0.00);
    const [taxes, setTaxes] = useState(0.00);
    const [discount, setDiscount] = useState(0.00);
    const [total, setTotal] = useState(0.00);

    useEffect(() => {
        calculateCart();
    }, [props.listItem]);

    const deleteItem = (item) => {
        if (item) {
            deleteProduct(item);
            dispatch(product({}));
        }
    }
    const calculateCart=()=>
    {
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
        var taxratelist=[];
        if (taxratelist && taxratelist !== null && taxratelist !== "undefined") {
            taxratelist && taxratelist.length > 0 && taxratelist.map(tax => {
                _taxId.push(tax.TaxId);
                _taxRate.push(tax.TaxRate);
                if (tax.check_is == true) {
                    TaxIs.push({ [tax.TaxId]: parseFloat(tax.TaxRate) })
                }
            })
            // this.setState({
            //     isChecked: _taxId,
            //     TaxId: _taxId,
            //     taxRate: _taxRate,
            //     TaxIs: TaxIs
            // })
        }
        _taxRate = 0.0//this.state.taxRate;
        props.listItem &&  props.listItem.map((item, index) => {            
            if (item.Price) {
                _subtotalPrice += item.Price
                _subtotalDiscount += parseFloat(item.discount_amount ==null || isNaN(item.discount_amount)==true?0:item.discount_amount)
                if (item.product_id) {//donothing  
                    var isProdAddonsType = "";//CommonJs.checkForProductXAddons(item.product_id);// check for productX is Addons type products                  
                    _exclTax += item.excl_tax ? item.excl_tax : 0;
                    _inclTax += item.incl_tax ? item.incl_tax : 0;
                    _cartDiscountAmount += item.cart_discount_amount;
                    // _productDiscountAmount += item.discount_type == "Number" ? item.product_discount_amount:item.product_discount_amount; // quantity commment for addons
                    _productDiscountAmount += item.discount_type == "Number" ? item.product_discount_amount:item.product_discount_amount*(isProdAddonsType && isProdAddonsType == true ? 1 : item.quantity);
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
        setSubTotal(_subtotal);
        setTotal(_total);
        setDiscount(_totalDiscountedAmount > 0 ? RoundAmount(_totalDiscountedAmount) : 0);
        setTaxes(RoundAmount(_taxAmount));
    //    this.setState({
    //         subTotal: RoundAmount(_subtotal),
    //         totalAmount: RoundAmount(_total),// parseFloat(_subtotal) - parseFloat(nextProps.discountAmount),           
    //         discountAmount: nextProps.discountAmount,
    //         discountType: nextProps.discountType,
    //         taxAmount: RoundAmount(_taxAmount), //(( parseFloat(_subtotal) - parseFloat(nextProps.discountAmount))% parseFloat(this.state.taxRate))*100.0           
    //         discountCalculated: _totalDiscountedAmount > 0 ? RoundAmount(_totalDiscountedAmount) : 0,
    //         showTaxStaus: typeOfTax() == 'incl' ? LocalizedLanguage.inclTax : LocalizedLanguage.exclTax,
    //         cartDiscountAmount : _cartDiscountAmount
    //     })  
    }
    return (
        <div className="cart">
            <div className="mobile-header">
                <p>Cart</p>
                <button id="exitCart">
                    <img src={X_Icon_DarkBlue} alt="" />
                </button>
            </div>
            <div className="body">
                <img src={EmptyCart} alt="" />
                {/* <div className="cart-item">
                    <div className="main-row">
                        <p className="quantity">2</p>
                        <p className="content-style">Face Mask</p>
                        <p className="price">$16.00</p>
                        <button className="remove-cart-item">
                            <img src={CircledX_Grey} alt="" />
                        </button>
                    </div>
                </div>
                <div className="cart-item">
                    <div className="main-row aligned">
                        <div className="tag customer">Customer</div>
                        <div className="content-style">Freddy Mercury</div>
                        <button className="remove-cart-item">
                            <img src={CircledX_Grey} alt="" />
                        </button>
                    </div>
                </div> */}
                {props && props.listItem && props.listItem.length > 0 && props.listItem.map(a => {

                    return <div className="cart-item" /*onClick={()=>props.editPopUp(a)}*/>
                        <div className="main-row" >
                            <p className="quantity">{a.quantity && a.quantity}</p>
                            <p className="content-style">{a.Title && a.Title}</p>
                            <p className="price">{a.Price && a.Price}</p>
                            <button className="remove-cart-item" onClick={() => deleteItem(a)}>
                                <img src={CircledX_Grey} alt="" />
                            </button>
                        </div>
                        <div className="secondary-col">
                            <p>Medium</p>
                            <p>Navy</p>
                        </div>
                    </div>

                })}
                {/* <div className="cart-item">
                    <div className="main-row">
                        <p className="quantity">10</p>
                        <p className="content-style">Snapback Baseball Hat with Logo</p>
                        <p className="price">$24.00</p>
                        <button className="remove-cart-item">
                            <img src={CircledX_Grey} alt="" />
                        </button>
                    </div>
                    <div className="secondary-col">
                        <p>Medium</p>
                        <p>Navy</p>
                    </div>
                </div>
                <div className="cart-item">
                    <div className="main-row aligned">
                        <div className="tag group">Group</div>
                        <p className="content-style">Table 1</p>
                        <button className="remove-cart-item">
                            <img src={CircledX_Grey} alt="" />
                        </button>
                    </div>
                </div>
                <div className="cart-item">
                    <div className="main-row">
                        <p className="quantity">10,000</p>
                        <p className="content-style">Reusable Coffee Cups</p>
                        <p className="price">$60,000</p>
                        <button className="remove-cart-item">
                            <img src={CircledX_Grey} alt="" />
                        </button>
                    </div>
                </div>
                <div className="cart-item">
                    <div className="main-row aligned">
                        <div className="tag custom-fee">Custom Fee</div>
                        <div className="content-style">Shipping Fee</div>
                        <div className="price">$20.00</div>
                        <button className="remove-cart-item">
                            <img src={CircledX_Grey} alt="" />
                        </button>
                    </div>
                </div>
                <div className="cart-item">
                    <div className="main-row aligned">
                        <div className="tag cart-note">Note</div>
                        <p className="content-style line-capped">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus, praesentium perferendis. Soluta impedit ea
                            numquam voluptatum qui odit maxime distinctio. Voluptatibus maxime esse voluptates, inventore id commodi aliquid?
                            Nostrum, hic!
                        </p>
                    </div>
                </div>
                <div className="cart-item">
                    <div className="main-row">
                        <p className="quantity">1</p>
                        <p className="content-style">Dress Shirt</p>
                        <p className="price">$45.00</p>
                        <button className="remove-cart-item">
                            <img src={CircledX_Grey} alt="" />
                        </button>
                    </div>
                    <div className="secondary-col">
                        <p>White</p>
                        <p>Neck: 16"</p>
                        <p>Sleeve: 34"</p>
                        <p>Chest: 42"</p>
                        <p><b>**Note:</b> If no white available, please get black.</p>
                    </div>
                </div>
                <div className="cart-item">
                    <div className="main-row">
                        <p className="quantity">1</p>
                        <p className="content-style">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem consequatur cum inventore similique totam sit fuga
                            repudiandae vel necessitatibus numquam, est perspiciatis hic beatae delectus aspernatur iste placeat nihil illo?
                        </p>
                        <p className="price">$45.00</p>
                        <button className="remove-cart-item">
                            <img src={CircledX_Grey} alt="" />
                        </button>
                    </div>
                    <div className="secondary-col">
                        <p>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam praesentium consequuntur eveniet dignissimos
                            laboriosam veritatis numquam! Officiis vel consequatur quisquam reprehenderit tenetur eveniet alias? Voluptatibus
                            repellat est magnam ipsum inventore.
                        </p>
                    </div>
                </div> */}
            </div>
            <div className="footer">
                <div className="totals">
                    <div className="row">
                        <p>Subtotal</p>
                        <p><b>${subTotal}</b></p>
                    </div>
                    <div className="row">
                        <p>Cart Discount - 25%</p>
                        <button id="editCartDiscount">edit</button>
                        <p><b>-${discount}</b></p>
                    </div>
                    <div className="row">
                        <button id="taxesButton">Taxes</button>
                        <p>(15%)</p>
                        <p><b>${taxes}</b></p>
                    </div>
                </div>
                <div className="checkout-container">
                    <button>Checkout - ${total}</button>
                </div>
            </div>
        </div>)
}

export default CartList 