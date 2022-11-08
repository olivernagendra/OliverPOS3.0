import React, { useState, useEffect } from "react"
import { useSelector } from 'react-redux';
import X_Icon_DarkBlue from '../../../../assets/images/svg/X-Icon-DarkBlue.svg';
import Checkout_Minus from '../../../../assets/images/svg/Checkout-Minus.svg';
import Checkout_Plus from '../../../../assets/images/svg/Checkout-Plus.svg';
import STATUSES from "../../../../constants/apiStatus";
import { typeOfTax } from "../../TaxSetting";
import { v4 as uuidv4 } from 'uuid';
const SplitByProduct = (props) => {
    const [listItem, setListItem] = useState([]);
    const [total, setTotal] = useState(0.00);
    const [resProduct] = useSelector((state) => [state.product])
    useEffect(() => {
        if (resProduct && resProduct.status === STATUSES.IDLE && resProduct.is_success) {

            var _list = [...resProduct.data];
            if (_list && _list.length > 0) {
                _list.map(item => {
                    if (localStorage.getItem('paybyproduct')) {
                        var paybyproduct = JSON.parse(localStorage.getItem('paybyproduct'));
                        var _paid = paybyproduct.find(a => a.product_id === item.product_id);
                        if (_paid) {
                            var _item = { ...item };
                            var _index = _list.indexOf(item, 0);
                            //_item["quantity_to_pay"] = _paid.quantity;
                            _item["quantity"] = _item.quantity - _paid.quantity;
                            // var _index = paybyproduct.indexOf(_paid, 0);
                            // _paid.quantity = _paid.quantity + item.quantity_to_pay;
                            if (_index >= 0) { _list[_index] = _item; }
                        }
                    }
                });
            }

            setListItem(_list);
        }
    }, [resProduct]);
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleSplitByProduct && props.toggleSplitByProduct();
        }
    }
    const updateQuantity = (id, type) => {
        var _listItem = [...listItem];
        var _temp = _listItem && _listItem.find(a => a.product_id === id);
        if (_temp && typeof _temp != "undefined") {
            var _index = _listItem.indexOf(_temp, 0);
            var _item = { ..._temp };
            if (_item.hasOwnProperty("quantity_to_pay")) {
                if (type === "inc") {
                    if (_item.quantity > _item.quantity_to_pay)
                        _item.quantity_to_pay = _item.quantity_to_pay + 1
                }
                else if (type === "dec") {
                    if (_item.quantity_to_pay > 0) { _item.quantity_to_pay = _item.quantity_to_pay - 1; }
                    else { console.log("it can note be less than one") }
                }
            }
            else {
                if (type === "inc") {
                    _item["quantity_to_pay"] = 1
                }
            }
            if (_index >= 0) {
                _listItem[_index] = _item;
            }

        }

        calculateCart(_listItem);
        //props.setRefresh(!props.refresh);
    }
    const saveCount = () => {
        var paybyproduct = [];
        listItem && listItem.map((item, index) => {
            if (localStorage.getItem('paybyproduct')) {
                paybyproduct = JSON.parse(localStorage.getItem('paybyproduct'));
                var _paid = paybyproduct.find(a => a.product_id === item.product_id);
                if (_paid) {
                    var _index = paybyproduct.indexOf(_paid, 0);
                    if (item.quantity_to_pay != null && typeof item.quantity_to_pay != "undefined") {
                        _paid.quantity = _paid.quantity + item.quantity_to_pay;
                        paybyproduct[_index] = _paid;
                    }
                }
                else {
                    paybyproduct.push({ product_id: item.product_id, quantity: item.quantity_to_pay });
                }
            }
            else {
                paybyproduct.push({ product_id: item.product_id, quantity: item.quantity_to_pay });
            }
            localStorage.setItem("paybyproduct_unpaid", JSON.stringify(paybyproduct));
            //localStorage.setItem("paybyproduct", JSON.stringify(paybyproduct));
        });
        props.pay_by_product && props.pay_by_product(total);
    }
    const calculateCart = (_listItem) => {
        var product_subtotal = 0.0;
        var product_total = 0.0;
        var product_tax = 0.0;
        // var _totalDiscountedAmount = 0.0;
        // var _customFee = 0.0;
        // var _exclTax = 0;
        // var _inclTax = 0;
        // var _taxId = [];
        // var _taxRate = [];
        // var TaxIs = [];
        // var _subtotalPrice = 0.00;
        // var _subtotalDiscount = 0.00;
        //var _cartDiscountAmount = 0.00;
        // var _productDiscountAmount = 0.00;
        // var _seprateDiscountAmount = 0.00;

        var getorder = localStorage.getItem("CHECKLIST") ? JSON.parse(localStorage.getItem("CHECKLIST")) : null;
        var total_amount = getorder && getorder.totalPrice;
        var cash_rounding_amount = getorder && getorder.cash_rounding_amount;
        var taxInclusiveName = typeOfTax();

        _listItem && _listItem.map((item, index) => {
            if (item.hasOwnProperty("quantity_to_pay") && item.quantity_to_pay > 0) {
                // if (localStorage.getItem('paybyproduct')) {
                //     paybyproduct = JSON.parse(localStorage.getItem('paybyproduct'));
                //     var _paid = paybyproduct.find(a => a.product_id === item.product_id);
                //     if(_paid)
                //     {
                //         var _index = paybyproduct.indexOf(_paid, 0);
                //         _paid.quantity=_paid.quantity+item.quantity_to_pay;
                //         paybyproduct[_index]=_paid;
                //     }
                // }
                // else
                // {
                //     paybyproduct.push({ product_id: item.product_id, quantity: item.quantity_to_pay });
                // }
                // localStorage.setItem("paybyproduct",JSON.stringify(paybyproduct));


                product_subtotal += (item.Price / item.quantity) * item.quantity_to_pay;
                //if(item.isTaxable===true)
                //{
                if (taxInclusiveName === "incl") {
                    product_tax += (parseFloat(item.incl_tax / item.quantity) * item.quantity_to_pay);
                }
                else if (taxInclusiveName === "Tax") {
                    product_tax += (parseFloat(item.excl_tax / item.quantity) * item.quantity_to_pay);
                }

                //}
                if (taxInclusiveName && taxInclusiveName !== "") { //in inclusive tax need to add tax intosub total
                    product_subtotal += product_tax;
                }
                product_total = (parseFloat(product_subtotal) + parseFloat(taxInclusiveName === "" ? product_tax : 0)); //added tax for exclusive tax
                if (product_total + (cash_rounding_amount) === total_amount) {
                    product_total = product_total + (cash_rounding_amount)
                }
            }

        })
        setTotal(product_total);
        setListItem(_listItem);
        //var _dis = _cartDiscountAmount > 0 ? RoundAmount(_cartDiscountAmount) : 0;
        //var refundlistItem = listItem && listItem.filter(a => a.hasOwnProperty("quantity_to_pay") && a.quantity_to_pay > 0);


        //props.setValues && props.setValues(product_subtotal, RoundAmount(product_tax), _dis, product_total,refundlistItem);
    }
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? "subwindow split-by-product current" : "subwindow split-by-product"}>
                <div class="subwindow-header">
                    <p>Split by Product</p>
                    <button class="close-subwindow" onClick={() => props.toggleSplitByProduct()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div class="subwindow-body">
                    <div class="body">
                        {listItem && listItem.length > 0 && listItem.map(item => {
                            return <div class="product-row" key={uuidv4()}>
                                <div class="main-row">
                                    <div class="text-group">
                                        <p>{item.Title}</p>
                                        <p>${item.hasOwnProperty("quantity_to_pay") ? parseFloat((item.Price / item.quantity) * item.quantity_to_pay).toFixed(2) : 0.00}</p>
                                    </div>
                                    <div class="increment-input">
                                        <button onClick={() => updateQuantity(item.product_id, 'dec')}>
                                            <img src={Checkout_Minus} alt="" />
                                        </button>
                                        <input type="text" readOnly value={(item.hasOwnProperty("quantity_to_pay") ? item.quantity_to_pay : "0") + "/" + (item.quantity)} />
                                        {/* <input type="text" readonly value="0/3" /> */}
                                        <button onClick={() => updateQuantity(item.product_id, 'inc')}>
                                            <img src={Checkout_Plus} alt="" />
                                        </button>
                                    </div>
                                </div></div>
                        })}
                        {/* <div class="product-row">
                            <div class="main-row">
                                <div class="text-group">
                                    <p>Wool Hat</p>
                                    <p>$12.99</p>
                                </div>
                                <div class="increment-input">
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
                        <div class="product-row">
                            <div class="main-row">
                                <div class="text-group">
                                    <p>Oliver Hoodie</p>
                                    <p>$42.99</p>
                                </div>
                                <div class="increment-input">
                                    <button>
                                        <img src={Checkout_Minus} alt="" />
                                    </button>
                                    <input type="text" readonly value="0/3" />
                                    <button>
                                        <img src={Checkout_Plus} alt="" />
                                    </button>
                                </div>
                            </div>
                            <div class="secondary-row">
                                <p>Red, Size 45, Leather Edition, with extra long shoe laces</p>
                            </div>
                        </div>
                        <div class="product-row">
                            <div class="main-row">
                                <div class="text-group">
                                    <p>Blue Sneaker</p>
                                    <p>$39.50</p>
                                </div>
                                <div class="increment-input">
                                    <button>
                                        <img src={Checkout_Minus} alt="" />
                                    </button>
                                    <input type="text" readonly value="0/3" />
                                    <button>
                                        <img src={Checkout_Plus} alt="" />
                                    </button>
                                </div>
                            </div>
                        </div> */}
                    </div>
                    <div class="footer">
                        <button onClick={() => saveCount()}>Save Count</button>
                    </div>
                </div>
            </div></div>)
}
export default SplitByProduct 