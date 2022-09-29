import React, { useState, useEffect, useLayoutEffect } from "react";
import EmptyCart from '../../../images/svg/EmptyCart.svg';
import { RoundAmount } from "../TaxSetting";
import STATUSES from "../../../constants/apiStatus";
import { useSelector } from 'react-redux';
const CartListBody = (props) => {
    // const [subTotal, setSubTotal] = useState(0.00);
    // const [taxes, setTaxes] = useState(0.00);
    // const [discount, setDiscount] = useState(0.00);
    // const [total, setTotal] = useState(0.00);
    const [taxRate, setTaxRate] = useState(0.00);
    const [listItem, setListItem] = useState([]);
    useEffect(() => {
        calculateCart();
    }, [listItem]);
    const [resProduct] = useSelector((state) => [state.product])
    useEffect(() => {
        if (resProduct && resProduct.status == STATUSES.IDLE && resProduct.is_success) {
            setListItem(resProduct.data);
            // setisShowPopups(false);
            //console.log("---resProduct--" + JSON.stringify(resProduct.data));
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
            // this.setState({
            //     isChecked: _taxId,
            //     TaxId: _taxId,
            //     taxRate: _taxRate,
            //     TaxIs: TaxIs
            // })
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
        var _dis=_totalDiscountedAmount > 0 ? RoundAmount(_totalDiscountedAmount) : 0;
        // setSubTotal(_subtotal);
        // setTotal(_total);
        // setDiscount(_dis);
        // setTaxes(RoundAmount(_taxAmount));
        props.setValues && props.setValues(_subtotal,RoundAmount(_taxAmount) ,_dis,_total);
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
    const renderItems = (type, item) => {
        switch (type) {
            case 'product':
                return (<div className="cart-item">
                    <div className="main-row">
                        <p className="quantity">2</p>
                        <p className="content-style">Face Mask</p>
                        <p className="price">$16.00</p>
                    </div>
                </div>)
            case 'note':
                return (<div className="cart-item">
                    <div className="main-row aligned">
                        <div className="tag cart-note">Note</div>
                        <p className="content-style line-capped">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus, praesentium perferendis. Soluta impedit ea
                            numquam voluptatum qui odit maxime distinctio. Voluptatibus maxime esse voluptates, inventore id commodi aliquid?
                            Nostrum, hic!
                        </p>
                    </div>
                </div>)
            case 'customer':
                return (<div className="cart-item">
                    <div className="main-row aligned">
                        <div className="tag customer">Customer</div>
                        <div className="content-style">Freddy Mercury</div>
                    </div>
                </div>)
            case 'group':
                return (<div className="cart-item">
                    <div className="main-row aligned">
                        <div className="tag group">Group</div>
                        <p className="content-style">Table 1</p>
                    </div>
                </div>)
            case 'custom_fee':
                return (<div className="cart-item">
                <div className="main-row aligned">
                    <div className="tag custom-fee">Custom Fee</div>
                    <div className="content-style">Shipping Fee</div>
                    <div className="price">$20.00</div>
                </div>
            </div>)
            case 'product-detail':
                return (<div className="cart-item">
                    <div className="main-row">
                        <p className="quantity">1</p>
                        <p className="content-style">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem consequatur cum inventore similique totam sit fuga
                            repudiandae vel necessitatibus numquam, est perspiciatis hic beatae delectus aspernatur iste placeat nihil illo?
                        </p>
                        <p className="price">$45.00</p>
                    </div>
                    <div className="secondary-col">
                        <p>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam praesentium consequuntur eveniet dignissimos
                            laboriosam veritatis numquam! Officiis vel consequatur quisquam reprehenderit tenetur eveniet alias? Voluptatibus
                            repellat est magnam ipsum inventore.
                        </p>
                    </div>
                </div>)
            default:
                return null;
        }
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
                switch (item_type) {
                    case "product":
                        return <div className="cart-item">
                        <div className="main-row" >
                            <p className="quantity">{a.quantity && a.quantity}</p>
                            <p className="content-style">{a.Title && a.Title}</p>
                            <p className="price">{a.Price && a.Price}</p>
                        </div>
                        <div className="secondary-col">
                        {typeof notes!="undefined" &&  notes!="" && <p>**Note: {notes.Title}</p>}
                            {/* <p>Medium</p>
                            <p>Navy</p> */}
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
                    // case "customer":
                    //     return <div className="cart-item">
                    //         <div className="main-row aligned">
                    //             <div className="tag customer">Customer</div>
                    //             <div className="content-style">{get_customerName().Name}</div>
                    //             <button className="remove-cart-item" onClick={() => deleteItem(a)}>
                    //                 <img src={CircledX_Grey} alt="" />
                    //             </button>
                    //         </div>
                    //     </div>
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
                // return <div className="cart-item" /*onClick={()=>props.editPopUp(a)}*/>
                //     <div className="main-row" >
                //         <p className="quantity">{a.quantity && a.quantity}</p>
                //         <p className="content-style">{a.Title && a.Title}</p>
                //         <p className="price">{a.Price && a.Price}</p>
                //     </div>
                //     {/* <div className="secondary-col">
                //         <p>Medium</p>
                //         <p>Navy</p>
                //     </div> */}
                // </div>

            })}
            {/* {renderItems('product')}
            {renderItems('customer')}
            {renderItems('product')}
            {renderItems('note')}
            {renderItems('product')}
            {renderItems('product-detail')} */}
            {/* <div className="cart-item">
                <div className="main-row">
                    <p className="quantity">2</p>
                    <p className="content-style">Face Mask</p>
                    <p className="price">$16.00</p>
                </div>
            </div>
            <div className="cart-item">
                <div className="main-row aligned">
                    <div className="tag customer">Customer</div>
                    <div className="content-style">Freddy Mercury</div>
                </div>
            </div>
            <div className="cart-item">
                <div className="main-row">
                    <p className="quantity">10</p>
                    <p className="content-style">Snapback Baseball Hat with Logo</p>
                    <p className="price">$24.00</p>
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
                </div>
            </div>
            <div className="cart-item">
                <div className="main-row">
                    <p className="quantity">10,000</p>
                    <p className="content-style">Reusable Coffee Cups</p>
                    <p className="price">$60,000</p>
                </div>
            </div>
            <div className="cart-item">
                <div className="main-row aligned">
                    <div className="tag custom-fee">Custom Fee</div>
                    <div className="content-style">Shipping Fee</div>
                    <div className="price">$20.00</div>
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
                </div>
                <div className="secondary-col">
                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam praesentium consequuntur eveniet dignissimos
                        laboriosam veritatis numquam! Officiis vel consequatur quisquam reprehenderit tenetur eveniet alias? Voluptatibus
                        repellat est magnam ipsum inventore.
                    </p>
                </div>
            </div> */}
        </div>)
}
export default CartListBody