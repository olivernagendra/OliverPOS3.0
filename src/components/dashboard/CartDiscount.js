import React, { useState, useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../assets/images/svg/X-Icon-DarkBlue.svg';
import { useDispatch, useSelector } from 'react-redux';
import { product } from "./product/productSlice";
import { addtoCartProduct } from "./product/productLogic";
import LocalizedLanguage from "../../settings/LocalizedLanguage";
const CartDiscount = (props) => {
    // const [props.isSelectDiscountBtn, setprops.isSelectDiscountBtn] = useState(false);
    const [discountAmount, setDiscountAmount] = useState("");
    const [feeAmount, setFeeAmount] = useState(0);
    const [add_title, setAdd_title] = useState("");
    const [allDiscount, setAllDiscount] = useState([]);
    const [isDiscountBtnEnable, setIsDiscountBtnEnable] = useState(true);
    const [discountType, setDiscountType] = useState('');
    const [respDiscountList] = useSelector((state) => [state.discountList]);

    const [txtValue, setTxtValue] = useState("")

    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.getItem("discountlst")) {
            var discount_list = JSON.parse(localStorage.getItem("discountlst"));
            setAllDiscount(discount_list);
        }
    }, [respDiscountList])

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
        //console.log(str);
        setDiscountAmount((parseFloat(str) / 100).toFixed(2));
    }
    const closePopup = () => {
        setAdd_title("");
        setFeeAmount(0)
        setDiscountAmount("");
        setTxtValue("");
        props.toggleCartDiscount();

    }
    const handleDiscount = (discount_Type) => {
        if (discountAmount == "." || discountAmount == "") {
            return;
        }
        const ListItem = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
        var discount_amount = discountAmount ? discountAmount : 0;
        var cart = {
            type: 'card',
            discountType: (discount_Type == '%') ? "Percentage" : "Number",
            discount_amount,
            Tax_rate: 0
        }
        setDiscountAmount("");
        setTxtValue("");
        localStorage.setItem("CART", JSON.stringify(cart))
        addtoCartProduct(ListItem);
        dispatch(product());
        setIsDiscountBtnEnable(true)

        props.toggleCartDiscount();
    }
    const handleListDiscount = (discount_Type, Amount) => {
        setIsDiscountBtnEnable(false);
        setDiscountType(discount_Type === "Percentage" ? "%" : "$");
        setDiscountAmount(Amount);

        //handleDiscount(discountType === "Percentage" ? "%" : "$");
    }
    useEffect(() => {
        if (isDiscountBtnEnable == false)
            handleDiscount(discountType);
    }, [isDiscountBtnEnable, discountType]);


    const clearDiscount = () => {
        setIsDiscountBtnEnable(true);
        const ListItem = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
        setDiscountAmount("");
        setTxtValue("");
        localStorage.removeItem("CART")
        addtoCartProduct(ListItem);
        dispatch(product());
    }
    const FeeAmount = (val) => {
        setFeeAmount(val);
    }
    const AddTitle = (val) => {
        setAdd_title(val);
    }
    const AddFee = (isTaxable) => {
        //const { feeAmount, add_title ,isfeeTaxable} = this.state;
        //const { dispatch } = this.props;
        var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
        cartlist = cartlist == null ? [] : cartlist;
        var new_title = add_title;// add_title !== '' ? add_title : LocalizedLanguage.customFee;
        var title = new_title;
        var new_array = [];
        var i = 0;
        if (cartlist.length > 0) {
            cartlist.map(item => {
                if (typeof item.product_id == 'undefined') {
                    if (item.Price !== null) {
                        new_array.push(item)
                    }
                }
            })
        }

        if (feeAmount != 0) {
            if (new_array.length > 0) {
                var withNoDigits = new_array.map(item => {
                    var remveNum = item.Title.replace(/[0-9]/g, '')
                    return remveNum;
                });
                withNoDigits.length > 0 && withNoDigits.map((item, index) => {
                    if (item == title) {
                        var incr = index + 1
                        new_title = item + incr;
                    } else {
                        new_title = new_title
                    }
                })
            }
            var data = {
                Title: new_title,
                Price: parseFloat(feeAmount),
                old_price: isTaxable == true && parseFloat(feeAmount),
                isTaxable: isTaxable,
                TaxStatus: isTaxable == true ? "taxable" : "none",
                TaxClass: '',
                quantity: 1
            }

            cartlist.push(data)
            addtoCartProduct(cartlist);
            dispatch(product());
            var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
            if (list != null) {
                var subTotal = parseFloat(list.subTotal + data.Price).toFixed(2);
                //var tax= parseFloat(list.tax +  data.Price).toFixed(2);
                const CheckoutList = {
                    ListItem: cartlist,
                    customerDetail: list.customerDetail,
                    totalPrice: parseFloat((subTotal) + parseFloat(list.tax)),
                    discountCalculated: list.discountCalculated,
                    tax: list.tax,
                    subTotal: subTotal,
                    TaxId: list.TaxId,
                    order_id: list.order_id !== 0 ? list.order_id : 0,
                    showTaxStaus: list.showTaxStaus,
                    _wc_points_redeemed: list._wc_points_redeemed,
                    _wc_amount_redeemed: list._wc_amount_redeemed,
                    _wc_points_logged_redemption: list._wc_points_logged_redemption,

                }
                localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList))
                // location.reload();
            }
            setFeeAmount(0);
            setAdd_title("");
            props.toggleCartDiscount();
        }
    }
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            setDiscountAmount("");
            setTxtValue("");
            props.toggleCartDiscount();
        }
    }
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? props.isSelectDiscountBtn == false ? "subwindow custom-fee current" : "subwindow cart-discount current" : "subwindow cart-discount custom-fee"}>
                <div className="subwindow-header">
                    <p>Custom Fees/Discounts</p>
                    <button className="close-subwindow" onClick={() => closePopup()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="auto-margin-top"></div>
                    <p className="style1">Select an option:</p>
                    <div className="toggle-container">
                        <label >
                            <input type="radio" id="customFeeRadio" name="customFeeDiscount" defaultChecked={props.isSelectDiscountBtn == false ? true : false} />
                            <div className="custom-radio" onClick={() => props.isSelectDiscountBtn == true ? props.toggleSelectDiscountBtn() : null}>
                                <p>Custom Fee</p>
                            </div>
                        </label>
                        <label >
                            <input type="radio" id="discountRadio" name="customFeeDiscount" defaultChecked={props.isSelectDiscountBtn == true ? true : false} />
                            <div className="custom-radio" onClick={() => props.isSelectDiscountBtn == false ? props.toggleSelectDiscountBtn() : null}>
                                <p>Discount</p>
                            </div>
                        </label>
                    </div>
                    {props.isSelectDiscountBtn == false ?
                        <div id="customFeeDiv">
                            <label htmlFor="customFeeLabel">{LocalizedLanguage.customFeelabel}</label>
                            <input type="text" id="customFeeLabel" placeholder="Name your custom fee" value={add_title} onChange={(e) => AddTitle(e.target.value)} />
                            <input type="number" id="customFeeAmount" placeholder="0.00" value={feeAmount} onChange={(e) => FeeAmount(e.target.value)} />
                            <p>Applies a custom fee item to cart</p>
                            <div className="button-row">
                                <button onClick={() => AddFee(true)}>With Tax</button>
                                <button onClick={() => AddFee(false)}>Without Tax</button>
                            </div>
                        </div> :
                        <div id="cartDiscountDiv">
                            <div className="main">
                                <label htmlFor="discountAmount">Discount Fee Amount:</label>
                                <input style={{ direction: "LTL" }} type="number" id="discountAmount" placeholder="0.00" value={discountAmount} onKeyDown={(e) => discount_Amount(e)} disabled={isDiscountBtnEnable == true ? false : true} />
                                <p>Select type of discount to be applied to cart:</p>
                                <div className="button-row">
                                    <button onClick={() => handleDiscount('$')} disabled={isDiscountBtnEnable == true ? false : true} className={isDiscountBtnEnable == true ? "" : "btn-disable"}>$ {LocalizedLanguage.discount}</button>
                                    <button onClick={() => handleDiscount('%')} disabled={isDiscountBtnEnable == true ? false : true} className={isDiscountBtnEnable == true ? "" : "btn-disable"}>% {LocalizedLanguage.discount}</button>
                                </div>
                            </div>
                            <div className="list">
                                <p>Pre-set discounts</p>
                                {allDiscount && allDiscount.map(d => {
                                    return <button key={d.Id} onClick={() => handleListDiscount(d.Type, d.Amount)}>
                                        <p>{d.Name} ({d.Type === "Percentage" ? d.Amount + "%" : "$" + d.Amount})</p>
                                    </button>
                                })}
                                <button onClick={() => clearDiscount()} id={localStorage.getItem("CART") ? "clear" : "clearCartDiscountDiv"}>
                                    <p>{LocalizedLanguage.discountClr}</p>
                                </button>
                            </div>
                        </div>}
                    <div className="auto-margin-bottom"></div>
                </div>
            </div>

        </div>




    )
}

export default CartDiscount 