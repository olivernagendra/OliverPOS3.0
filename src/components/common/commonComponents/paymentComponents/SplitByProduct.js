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
                            _item["paid_quantity"] = _item.quantity - _paid.quantity;
                            _item["unpaid_qty"] = -1;
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
                    if (((_item.hasOwnProperty('paid_quantity') ? Math.abs(_item.paid_quantity) : _item.quantity)) > _item.quantity_to_pay) {
                        _item.quantity_to_pay = _item.quantity_to_pay + 1;
                        _item.unpaid_qty = _item.unpaid_qty + 1;
                    }

                }
                else if (type === "dec") {
                    if (_item.quantity_to_pay > 0) { _item.quantity_to_pay = _item.quantity_to_pay - 1; _item.unpaid_qty = _item.unpaid_qty - 1; }
                    else { console.log("it can note be less than one") }
                }
            }
            else {
                if (type === "inc") {
                    _item["quantity_to_pay"] = 1
                    _item["unpaid_qty"] = 1;
                }
            }
            if (_index >= 0) {
                _listItem[_index] = _item;
            }

        }

        calculateCart(_listItem);
    }
    // const saveCount = () => {
    //     var taxInclusiveName = typeOfTax();
    //     var _paybyproduct =[];
    //    var paybyproduct =[];// localStorage.getItem('paybyproduct')?JSON.parse(localStorage.getItem('paybyproduct')):[];
    //     var checklist = localStorage.getItem("CHECKLIST") ? JSON.parse(localStorage.getItem("CHECKLIST")) : null;
    //     var total_amount = checklist && checklist.totalPrice;
    //     var cash_rounding_amount = checklist && checklist.cash_rounding_amount;
    //     var _listItem = checklist && checklist.ListItem;
    //     listItem && listItem.map((item, index) => {
    //         if (localStorage.getItem('paybyproduct')) {
    //             paybyproduct = JSON.parse(localStorage.getItem('paybyproduct'));
    //             var _paid = paybyproduct.find(a => a.product_id === item.product_id);
    //             if (_paid) {
    //                 var _index = paybyproduct.indexOf(_paid, 0);
    //                 if (item.quantity_to_pay != null && typeof item.quantity_to_pay != "undefined") {
    //                     _paid.quantity = _paid.quantity + item.quantity_to_pay;

    //                     //--------
    //                     //var product_subtotal = item.old_price * item.quantity_to_pay;
    //                     var product_subtotal= (item.Price / item.quantity) * item.quantity_to_pay
    //                     var product_tax = 0.00;
    //                     var product_total = 0.00;

    //                     if (taxInclusiveName === "incl") {
    //                         product_tax += (parseFloat(item.incl_tax / item.quantity) * item.quantity_to_pay);
    //                     }
    //                     else if (taxInclusiveName === "Tax") {
    //                         product_tax += (parseFloat(item.excl_tax / item.quantity) * item.quantity_to_pay);
    //                     }
    //                     if (taxInclusiveName && (taxInclusiveName !== "" || taxInclusiveName !== "incl")) { //in inclusive tax need to add tax intosub total
    //                         product_subtotal += product_tax;
    //                     }
    //                     product_total = (parseFloat(product_subtotal) + parseFloat(taxInclusiveName === "" ? product_tax : 0)); //added tax for exclusive tax
    //                     if (product_total + (cash_rounding_amount) === total_amount) {
    //                         product_total = product_total + (cash_rounding_amount)
    //                     }
    //                     _paid["tax"] = product_tax;
    //                     _paid["total"] = product_total;
    //                     _paid["sub_total"] = product_subtotal;
    //                     _paid["unpaid_qty"] = item.quantity_to_pay;

    //                     //-----

    //                     paybyproduct[_index] = _paid;
    //                     _paybyproduct.push(_paid);
    //                 }
    //             }
    //             else {
    //                 if (item.quantity_to_pay != null && typeof item.quantity_to_pay != "undefined") {
    //                     //_paid.quantity = _paid.quantity + item.quantity_to_pay;

    //                     //--------
    //                     //var product_subtotal = item.old_price * item.quantity_to_pay;
    //                     var product_subtotal= (item.Price / item.quantity) * item.quantity_to_pay
    //                     var product_tax = 0.00;
    //                     var product_total = 0.00;

    //                     if (taxInclusiveName === "incl") {
    //                         product_tax += (parseFloat(item.incl_tax / item.quantity) * item.quantity_to_pay);
    //                     }
    //                     else if (taxInclusiveName === "Tax") {
    //                         product_tax += (parseFloat(item.excl_tax / item.quantity) * item.quantity_to_pay);
    //                     }
    //                     if (taxInclusiveName && (taxInclusiveName !== "" || taxInclusiveName !== "incl")) { //in inclusive tax need to add tax intosub total
    //                         product_subtotal += product_tax;
    //                     }
    //                     product_total = (parseFloat(product_subtotal) + parseFloat(taxInclusiveName === "" ? product_tax : 0)); //added tax for exclusive tax
    //                     if (product_total + (cash_rounding_amount) === total_amount) {
    //                         product_total = product_total + (cash_rounding_amount)
    //                     }
    //                     // _paid["tax"] = product_tax;
    //                     // _paid["total"] = product_total;
    //                     // _paid["sub_total"] = product_subtotal;
    //                     // _paid["unpaid_qty"] = item.quantity_to_pay;

    //                     //-----

    //                     //paybyproduct[_index] = _paid;
    //                 //paybyproduct.push({ product_id: item.product_id, quantity: item.quantity_to_pay, tax: product_tax, total: product_total, sub_total: product_subtotal ,unpaid_qty:item.quantity_to_pay});
    //                 _paybyproduct.push({ product_id: item.product_id, quantity: item.quantity_to_pay, tax: product_tax, total: product_total, sub_total: product_subtotal ,unpaid_qty:item.quantity_to_pay});

    //                 }
    //                 else
    //                 {
    //                 //paybyproduct.push({ product_id: item.product_id, quantity: 0, tax: 0, total: 0, sub_total: 0 ,unpaid_qty:-1});
    //                 _paybyproduct.push({ product_id: item.product_id, quantity: 0, tax: 0, total: 0, sub_total: 0 ,unpaid_qty:-1});

    //                 }
    //                 // paybyproduct.push({ product_id: item.product_id, quantity: item.quantity_to_pay });
    //             }
    //         }
    //         else {
    //             //--------

    //             var product_subtotal = 0.00;
    //             var product_tax = 0.00;
    //             var product_total = 0.00;
    //             var qty=0;
    //             var unpaidQty=-1;
    //             if (item.hasOwnProperty("quantity_to_pay")) {
    //                 //product_subtotal = item.old_price * item.quantity_to_pay;
    //                 product_subtotal= (item.Price / item.quantity) * item.quantity_to_pay
    //                 qty=item.quantity_to_pay;
    //                 if (taxInclusiveName === "incl") {
    //                     product_tax += (parseFloat(item.incl_tax / item.quantity) * item.quantity_to_pay);
    //                 }
    //                 else if (taxInclusiveName === "Tax") {
    //                     product_tax += (parseFloat(item.excl_tax / item.quantity) * item.quantity_to_pay);
    //                 }
    //                 if (taxInclusiveName && (taxInclusiveName !== "" || taxInclusiveName !== "incl")) { //in inclusive tax need to add tax intosub total
    //                     product_subtotal += product_tax;
    //                 }
    //                 product_total = (parseFloat(product_subtotal) + parseFloat(taxInclusiveName === "" ? product_tax : 0)); //added tax for exclusive tax
    //                 if (product_total + (cash_rounding_amount) === total_amount) {
    //                     product_total = product_total + (cash_rounding_amount)
    //                 }
    //                 unpaidQty=item.hasOwnProperty("unpaid_qty")?item.unpaid_qty:-1 ;
    //             }

    //             //-----

    //             //paybyproduct.push({ product_id: item.product_id, quantity: qty, tax: product_tax, total: product_total, sub_total: product_subtotal ,unpaid_qty:unpaidQty});
    //             _paybyproduct.push({ product_id: item.product_id, quantity: qty, tax: product_tax, total: product_total, sub_total: product_subtotal ,unpaid_qty:unpaidQty});
    //         }

    //         //localStorage.setItem("paybyproduct", JSON.stringify(paybyproduct));
    //     });
    //     localStorage.setItem("paybyproduct_unpaid", JSON.stringify(_paybyproduct));
    //     props.pay_by_product && props.pay_by_product(total);
    // }
    const saveCount = () => {
        var taxInclusiveName = typeOfTax();
        var _paybyproduct = [];
        var paybyproduct = [];
        var checklist = localStorage.getItem("CHECKLIST") ? JSON.parse(localStorage.getItem("CHECKLIST")) : null;
        var total_amount = checklist && checklist.totalPrice;
        var cash_rounding_amount = checklist && checklist.cash_rounding_amount;
        var _listItem = checklist && checklist.ListItem;
        listItem && listItem.map((item, index) => {
            if (localStorage.getItem('paybyproduct')) {
                paybyproduct = JSON.parse(localStorage.getItem('paybyproduct'));

                if (item.quantity_to_pay != null && typeof item.quantity_to_pay != "undefined") {
                    //--------
                    var product_subtotal = (item.Price / item.quantity) * item.quantity_to_pay
                    var product_tax = 0.00;
                    var product_total = 0.00;

                    if (taxInclusiveName === "incl") {
                        product_tax += (parseFloat(item.incl_tax / item.quantity) * item.quantity_to_pay);
                    }
                    else if (taxInclusiveName === "Tax") {
                        product_tax += (parseFloat(item.excl_tax / item.quantity) * item.quantity_to_pay);
                    }
                    if (taxInclusiveName && (taxInclusiveName !== "" || taxInclusiveName !== "incl")) { //in inclusive tax need to add tax intosub total
                        product_subtotal += product_tax;
                    }
                    product_total = (parseFloat(product_subtotal) + parseFloat(taxInclusiveName === "" ? product_tax : 0)); //added tax for exclusive tax
                    if (product_total + (cash_rounding_amount) === total_amount) {
                        product_total = product_total + (cash_rounding_amount)
                    }

                    var _paid = paybyproduct.find(a => a.product_id === item.product_id);
                    if (_paid) {
                        var _index = paybyproduct.indexOf(_paid, 0);
                        _paid.quantity = _paid.quantity + item.quantity_to_pay;
                        _paid["tax"] = product_tax;
                        _paid["total"] = product_total;
                        _paid["sub_total"] = product_subtotal;
                        _paid["unpaid_qty"] = item.quantity_to_pay;
                        paybyproduct[_index] = _paid;
                        _paybyproduct.push(_paid);
                    }
                    else {
                        _paybyproduct.push({ product_id: item.product_id, quantity: item.quantity_to_pay, tax: product_tax, total: product_total, sub_total: product_subtotal, unpaid_qty: item.quantity_to_pay });
                    }
                }
                else {
                    _paybyproduct.push({ product_id: item.product_id, quantity: 0, tax: 0, total: 0, sub_total: 0, unpaid_qty: -1 });
                }
            }
            else {
                //--------

                var product_subtotal = 0.00;
                var product_tax = 0.00;
                var product_total = 0.00;
                var qty = 0;
                var unpaidQty = -1;
                if (item.hasOwnProperty("quantity_to_pay")) {
                    product_subtotal = (item.Price / item.quantity) * item.quantity_to_pay
                    qty = item.quantity_to_pay;
                    if (taxInclusiveName === "incl") {
                        product_tax += (parseFloat(item.incl_tax / item.quantity) * item.quantity_to_pay);
                    }
                    else if (taxInclusiveName === "Tax") {
                        product_tax += (parseFloat(item.excl_tax / item.quantity) * item.quantity_to_pay);
                    }
                    if (taxInclusiveName && (taxInclusiveName !== "" || taxInclusiveName !== "incl")) { //in inclusive tax need to add tax intosub total
                        product_subtotal += product_tax;
                    }
                    product_total = (parseFloat(product_subtotal) + parseFloat(taxInclusiveName === "" ? product_tax : 0)); //added tax for exclusive tax
                    if (product_total + (cash_rounding_amount) === total_amount) {
                        product_total = product_total + (cash_rounding_amount)
                    }
                    unpaidQty = item.hasOwnProperty("unpaid_qty") ? item.unpaid_qty : -1;
                }
                //-----
                _paybyproduct.push({ product_id: item.product_id, quantity: qty, tax: product_tax, total: product_total, sub_total: product_subtotal, unpaid_qty: unpaidQty });
            }
        });
        localStorage.setItem("paybyproduct_unpaid", JSON.stringify(_paybyproduct));
        props.pay_by_product && props.pay_by_product(total);
    }
    const calculateCart = (_listItem) => {
        var product_subtotal = 0.0;
        var product_total = 0.0;
        var product_tax = 0.0;
        var getorder = localStorage.getItem("CHECKLIST") ? JSON.parse(localStorage.getItem("CHECKLIST")) : null;
        var total_amount = getorder && getorder.totalPrice;
        var cash_rounding_amount = getorder && getorder.cash_rounding_amount;
        var taxInclusiveName = typeOfTax();

        _listItem && _listItem.map((item, index) => {
            if (item.hasOwnProperty("quantity_to_pay") && item.quantity_to_pay > 0) {
                product_subtotal += (item.Price / item.quantity) * item.unpaid_qty;
                //if(item.isTaxable===true)
                //{
                if (taxInclusiveName === "incl") {
                    product_tax += (parseFloat(item.incl_tax / item.quantity) * item.unpaid_qty);
                }
                else if (taxInclusiveName === "Tax") {
                    product_tax += (parseFloat(item.excl_tax / item.quantity) * item.unpaid_qty);
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
                <div className="subwindow-header">
                    <p>Split by Product</p>
                    <button className="close-subwindow" onClick={() => props.toggleSplitByProduct()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="body">
                        {listItem && listItem.length > 0 && listItem.map(item => {
                            return <div className="product-row" key={uuidv4()}>
                                <div className="main-row">
                                    <div className="text-group">
                                        <p>{item.Title}</p>
                                        <p>${item.hasOwnProperty("quantity_to_pay") ? parseFloat((item.Price / item.quantity) * item.quantity_to_pay).toFixed(2) : 0.00}</p>
                                    </div>
                                    <div className="increment-input">
                                        <button onClick={() => updateQuantity(item.product_id, 'dec')}>
                                            <img src={Checkout_Minus} alt="" />
                                        </button>
                                        <input type="text" readOnly value={(item.hasOwnProperty("quantity_to_pay") ? item.quantity_to_pay : "0") + "/" + (item.hasOwnProperty('paid_quantity') ? Math.abs(item.paid_quantity) : item.quantity)} />
                                        {/* <input type="text" readonly value="0/3" /> */}
                                        <button onClick={() => updateQuantity(item.product_id, 'inc')}>
                                            <img src={Checkout_Plus} alt="" />
                                        </button>
                                    </div>
                                </div></div>
                        })}
                        {/* <div className="product-row">
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
                        </div> */}
                    </div>
                    <div className="footer">
                        <button onClick={() => saveCount()}>Save Count</button>
                    </div>
                </div>
            </div></div>)
}
export default SplitByProduct 