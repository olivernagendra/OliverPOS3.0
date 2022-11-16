import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import STATUSES from "../../constants/apiStatus";
import { showSubTitle, showTitle, getInclusiveTaxType } from "../../settings/CommonModuleJS";
import { FormateDateAndTime } from '../../settings/FormateDateAndTime';
import shirt from '../../assets/images/Temp/shirt.png'
import { LoadingModal } from "../common/commonComponents/LoadingModal";
import { useIndexedDB } from 'react-indexed-db';
import { Await } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import OnlineSale from '../../assets/images/svg/OnlineSale.svg'
import InStoreSale from '../../assets/images/svg/InStoreSale.svg'
const ActivityOrderList = (props) => {
    // console.log("props", props)
    const { add, update, getByID, getAll, deleteRecord } = useIndexedDB("products");




    const navigate = useNavigate()

    // const [activityOrderDetails, setActivityOrderDetails] = useState([])

    // // Getting Response from activitygetDetail Api
    // const [activitygetdetails] = useSelector((state) => [state.activityGetDetail])
    // useEffect(() => {
    //     if (activitygetdetails && activitygetdetails.status == STATUSES.IDLE && activitygetdetails.is_success && activitygetdetails.data) {
    //         setActivityOrderDetails(activitygetdetails.data.content);

    //     }
    // }, [activitygetdetails]);
    // //console.log("activityOrderDetails", activityOrderDetails)














    const [activityOrderDetails, setActivityOrderDetails] = useState([])
    var TaxSetting = localStorage.getItem("TAX_SETTING") ? JSON.parse(localStorage.getItem("TAX_SETTING")) : null;
    // Getting Response from activitygetDetail Api
    const [activitygetdetails] = useSelector((state) => [state.activityGetDetail])
    useEffect(() => {
        if (activitygetdetails && activitygetdetails.status == STATUSES.IDLE && activitygetdetails.is_success && activitygetdetails.data) {
            setActivityOrderDetails(activitygetdetails && activitygetdetails.data.content);

        }
    }, [activitygetdetails]);
    //console.log("activityOrderDetails", activityOrderDetails)


    let data = activityOrderDetails && activityOrderDetails !== '' ? activityOrderDetails : ''
    // console.log("data", data)


    var DateTime = activityOrderDetails
    var gmtDateTime = "";
    if (DateTime && DateTime.OrderDateTime && DateTime.time_zone) {
        gmtDateTime = FormateDateAndTime.formatDateAndTime(DateTime.OrderDateTime, DateTime.time_zone)
    }
    var Customerdata = activityOrderDetails && activityOrderDetails.orderCustomerInfo ? activityOrderDetails.orderCustomerInfo : ''

    const OpenCustomer = (data) => {
        // console.log("data",data)
        if (data.orderCustomerInfo.customer_email !== '') {
            sessionStorage.setItem("customerredirect", data.orderCustomerInfo.customer_email ? data.orderCustomerInfo.customer_email : "");
            navigate('/customers')
        }
    }






    var _totalProductIndividualDiscount = 0;
    var _indivisualProductDiscountArray = [];
    var _indivisualProductCartDiscountArray = [];
    var _tempTotalProductIndividualDiscount = [];
    var _tempIndivisualProductCartDiscountArray = [];
    var _tempProductIndividualDiscount = 0;
    const reCalculateDiscount = (item) => {

        var price = 0;
        var LineItem = activityOrderDetails && activityOrderDetails.line_items;
        LineItem && LineItem.map(x => {
            if ((x.product_id === item.product_id || x.parent_id === item.product_id) && (x.quantity - Math.abs(x.quantity_refunded)) > 0) {
                price = item.Price;
                if (item.product_discount_amount) {  //getting the product discount amount
                    _tempProductIndividualDiscount = (item.product_discount_amount * (item.discount_type == "Percentage" ? (x.quantity + (x.quantity_refunded ? x.quantity_refunded : 0)) : 1))
                    price = item.old_price * (x.quantity + (x.quantity_refunded ? x.quantity_refunded : 0));
                    if (item.discount_type == "Number") {
                        _tempProductIndividualDiscount = (_tempProductIndividualDiscount / item.quantity) * (x.quantity + (x.quantity_refunded ? x.quantity_refunded : 0));
                    }
                    price = price - _tempProductIndividualDiscount;
                    _totalProductIndividualDiscount += _tempProductIndividualDiscount;

                    _indivisualProductDiscountArray.push({ "ProductId": item.variation_id && item.variation_id !== 0 ? item.variation_id : item.product_id, "discountAmount": _tempProductIndividualDiscount })
                }
                let cart_discount = 0;
                if (item.discountCart && item.discountCart.discountType) {
                    if (item.discountCart && item.discountCart.discountType && item.discountCart.discountType == "Percentage") {
                        if (!item.product_discount_amount) {
                            price = item.old_price * (x.quantity + (x.quantity_refunded ? x.quantity_refunded : 0));
                        }
                        cart_discount = (price * item.discountCart.discount_amount) / 100;
                        _indivisualProductCartDiscountArray.push({ "ProductId": item.variation_id && item.variation_id !== 0 ? item.variation_id : item.product_id, "discountAmount": cart_discount })
                    }
                    else {
                        cart_discount = ((item.cart_discount_amount) / x.quantity) * (x.quantity + (x.quantity_refunded ? x.quantity_refunded : 0));
                        _indivisualProductCartDiscountArray.push({ "ProductId": item.variation_id && item.variation_id !== 0 ? item.variation_id : item.product_id, "discountAmount": cart_discount })
                        //item.cart_discount_amount

                    }
                }
            }
        });

    }


    var lineitems = activityOrderDetails && activityOrderDetails.line_items ? activityOrderDetails.line_items : [];
    var getorderlist = activityOrderDetails && activityOrderDetails.meta_datas && activityOrderDetails.meta_datas !== null ? activityOrderDetails.meta_datas.find(data => data.ItemName == '_order_oliverpos_product_discount_amount') : null;
    var notesList = activityOrderDetails && activityOrderDetails.order_notes ? activityOrderDetails.order_notes : []
    var taxInclusiveName = "";
    if (activityOrderDetails && activityOrderDetails && activityOrderDetails.meta_datas) {
        taxInclusiveName = getInclusiveTaxType(activityOrderDetails.meta_datas);
    }

    //----------------------------------
    var _objOrderNotes
    _totalProductIndividualDiscount = 0;
    _indivisualProductDiscountArray = [];
    _indivisualProductCartDiscountArray = [];
    var _objOrderCutomFee = "";
    activityOrderDetails && activityOrderDetails !== "" && activityOrderDetails.meta_datas && activityOrderDetails.meta_datas.map((item, index) => {
        if (item.ItemName == '_order_oliverpos_product_discount_amount') {
            var _arrNote = item.ItemValue && item.ItemValue != "" && JSON.parse(item.ItemValue);
            _arrNote && _arrNote != "" && _arrNote.map((item, index) => {
                if (item.order_notes) {
                    _objOrderNotes = item.order_notes;
                }
                if (item.product_discount_amount || item.cart_discount_amount) {
                    reCalculateDiscount(item);
                }
                if (item.order_custom_fee) {
                    _objOrderCutomFee = item.order_custom_fee;
                }

            });
        }
    });


    var orderData = [];
    var taxType = "";
    if (lineitems !== null && lineitems !== "" && getorderlist !== null) {
        getorderlist = getorderlist && getorderlist.ItemValue && JSON.parse(getorderlist.ItemValue);
        getorderlist && getorderlist.map((item, index) => {
            if (item.order_notes !== null) {
                item.order_notes && item.order_notes.map((item, index) => {
                    if (item.is_customer_note !== undefined && item.is_customer_note !== null) { }
                    else {
                        if (notesList && notesList !== []) {
                            var isSameNoteExist = notesList.find((list) => list.note == item.note)
                            if (!isSameNoteExist) {
                                orderData.push(item);
                            }
                        } else {
                            orderData.push(item);
                        }
                    }
                });
            }
            if (item.taxType != null) {
                taxType = item.taxType;
            }
        });
    }

    const productImageFind = async (item) => {
        var product = await getByID(item.product_id ? item.product_id : item.WPID ? item.WPID : item.Product_Id);
        //   return product.ProductImage
    }


    var _discount = 0;

    if (
        _indivisualProductCartDiscountArray &&
        _indivisualProductCartDiscountArray.length > 0
    ) {
        _indivisualProductCartDiscountArray &&
            _indivisualProductCartDiscountArray.map((x) => {
                _discount += x.discountAmount;
            });
    } else {
        if (
            _indivisualProductDiscountArray &&
            _indivisualProductDiscountArray.length > 0
        ) {
            _discount = 0;
        } else {
            _discount =
                data && data !== "" && data.discount
                    ? data.discount
                    : 0;
        }
    }
    // console.log("-----_discount-----" + _discount);

    var TotalIndividualProductDiscount = _discount == data.discount ? _totalProductIndividualDiscount : 0
    var totalDiscount = _discount - TotalIndividualProductDiscount;
    function Capitalize(str) {
        var value = str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
        return value;
    }


    var balance = 0;
    if (props.OrderPayment && props.OrderPayment.length > 0) {
        props.OrderPayment.map(item => {
            balance += parseFloat(item.amount)
        })
    }
    var remaining_balance = (parseFloat(props.Subtotal) + parseFloat(props.TotalTax)) - parseFloat(balance);
    var redeemPointsForActivity = props.redeemPointsToPrint ? +props.redeemPointsToPrint.match(/\d+/) : 0
    var cashOrderData = ''
    var cashChange = ''
    var cashPayment = ''
    var taxInclusiveName = getInclusiveTaxType(props.orderMetaData);
    props.orderMetaData && props.orderMetaData.map((meta) => {
        // metaData && metaData.map((metaData, index) => {
        if (meta.ItemName == '_order_oliverpos_cash_change') {
            cashOrderData = meta.ItemValue && meta.ItemValue !== '' ? meta.ItemValue : ''
        }
    })

    if (cashOrderData && cashOrderData !== '') {
        cashOrderData = JSON.parse(cashOrderData)
        cashChange = cashOrderData.change
        cashPayment = cashOrderData.cashPayment
    }

    var isTotalRefund = false;
    if (activityOrderDetails && (activityOrderDetails.total_amount - data.refunded_amount).toFixed(2) == '0.00') {
        isTotalRefund = true
    }


    return (
        <>
            <div className="quick-info">
                <div className="row">
                    <div className="group">
                        <img src={activityOrderDetails != "" && activityOrderDetails.OliverReciptId !== '' ? InStoreSale : OnlineSale} alt="" />
                        <p>Order #{activityOrderDetails && activityOrderDetails.order_id}</p>
                    </div>
                    <p className="style1">{activityOrderDetails.order_status}</p>
                </div>
                <div className="row">
                    <p className="style2">Served by: {activityOrderDetails.ServedBy}</p>
                    <p className="style2">July 19, 2022 &nbsp; 12:35PM</p>
                </div>
                <div className="row">
                    <p className="style3">
                        Total: <b>{
                            (activityOrderDetails && activityOrderDetails.refunded_amount > 0) ? <div>{parseFloat(activityOrderDetails.total_amount - activityOrderDetails.refunded_amount).toFixed(2)} <del>{parseFloat(activityOrderDetails && activityOrderDetails.total_amount).toFixed(2)}</del></div> : parseFloat(activityOrderDetails && activityOrderDetails.total_amount).toFixed(2)
                        }</b>
                    </p>
                </div>
            </div>
            <div className="scrollable">
                <div className="customer-info">
                    <div className="col">
                        <p className="style1">Customer Information</p>
                        <p className="style2">{Customerdata && Customerdata.customer_name ? Customerdata.customer_name : Customerdata && Customerdata.customer_first_name}</p>
                        <p className="style2">{Customerdata && Customerdata.customer_email ? Customerdata.customer_email : ''}</p>
                        <p className="style2">{Customerdata && Customerdata.customer_phone ? Customerdata.customer_phone : ''}</p>
                    </div>
                    {activityOrderDetails.orderCustomerInfo !== '' && activityOrderDetails.orderCustomerInfo !== null ? <button id="openCustomerButton" onClick={() => OpenCustomer(activityOrderDetails)}>Open Customer</button> : ""}
                </div>


                <div className="order-details">
                    <p>Order Details</p>
                    {
                        lineitems && lineitems.map((item, index) => {
                            var productImage = '';
                            var IndexImage = ''
                            IndexImage = productImageFind(item);
                            IndexImage.then((a) => {
                                /// console.log(a);
                                productImage = a
                            });
                            // console.log("productImage",productImage)
                            var sku = item.sku ? item.sku : ''
                            var varDetail = item.ProductSummery.toString();
                            ///Composit Child product------------------------
                            if ((item.composite_parent_key && item.composite_parent_key !== "") || (item.bundled_parent_key && item.bundled_parent_key !== "")) { //remove child composit product
                                return <React.Fragment></React.Fragment>
                            } else if (item.composite_product_key && item.composite_parent_key == "") {
                                var compositChield = []
                                lineitems && lineitems.map(compositItem => {
                                    if (compositItem.composite_parent_key && compositItem.composite_parent_key == item.composite_product_key) {
                                        compositChield.push(compositItem.name)
                                    }
                                })
                                varDetail = compositChield.join(', ')
                            } else if (item.bundle_product_key && item.bundled_parent_key == "") { //for bundle Product
                                var compositChield = []
                                lineitems && lineitems.map(compositItem => {
                                    if (compositItem.bundled_parent_key && compositItem.bundled_parent_key == item.bundle_product_key) {
                                        compositChield.push(compositItem.name)
                                    }
                                })
                                varDetail = compositChield.join(', ')
                            }
                            //-----------------------------------------------

                            var isIndivisualDiscountApply = _indivisualProductDiscountArray && _indivisualProductDiscountArray.filter(x => x.ProductId === item.product_id);
                            var _productCartDiscountAmount = 0;
                            if (_indivisualProductCartDiscountArray && _indivisualProductCartDiscountArray.length > 0) {
                                _indivisualProductCartDiscountArray && _indivisualProductCartDiscountArray.map(x => {
                                    if (x.ProductId === item.product_id)
                                        _productCartDiscountAmount = x.discountAmount
                                });
                            }
                            var _indivisualDiscount = 0;
                            if (_indivisualProductDiscountArray && _indivisualProductDiscountArray.length > 0) {
                                _indivisualProductDiscountArray && _indivisualProductDiscountArray.map(x => {
                                    if (x.ProductId === item.product_id || x.parent_id === item.product_id)
                                        _indivisualDiscount = x.discountAmount
                                });
                            }

                            var qty = item.quantity + item.quantity_refunded;
                            var _single_amount = ((item.subtotal + (taxType == "incl" ? item.subtotal_tax : 0)) / item.quantity);
                            var _amount = _single_amount * item.quantity;
                            var _final_amount = qty == 0 ? 0 : (_single_amount * qty) - _indivisualDiscount;
                            var qty = item.quantity + item.quantity_refunded;
                            var refundItemTax = ((item.subtotal_tax / item.quantity) * item.quantity_refunded)

                            return (
                                <div className="item">
                                    <div className="img-container">
                                        <div className="quantity">
                                            <p>
                                                {
                                                    (item.quantity_refunded < 0 || (isTotalRefund == true && item.quantity == item.quantity_refunded)) ? (item.quantity_refunded < 0) ? <div>{isTotalRefund == true && item.quantity == item.quantity_refunded ? 0 : item.quantity + item.quantity_refunded}<del >{item.quantity}</del></div> : showSubTitle(item) !== "" ? null : item.quantity : showSubTitle(item) !== "" ? null : item.quantity
                                                }
                                            </p>
                                        </div>
                                        <img src={productImage ? productImage : ""} alt="" />
                                    </div>
                                    <div className="col">
                                        <div className="main-row">
                                            <p>{showTitle(item) !== "" ? item.name : null}
                                                {showSubTitle(item) !== "" ? <p>{item.name} </p> : null}
                                                {varDetail ? <p >{varDetail} </p> : null}
                                            </p>
                                            <p>
                                                {
                                                    (item.amount_refunded > 0 || isTotalRefund == true) ?
                                                        (item.quantity_refunded < 0) ?
                                                            <div><del style={{ marginRight: 10 }}>
                                                                {parseFloat(_amount).toFixed(2)} </del>{parseFloat(_final_amount).toFixed(2)} </div>
                                                            : parseFloat(item.total).toFixed(2)
                                                        :
                                                        ((item.subtotal - item.total) != 0) && isIndivisualDiscountApply.length > 0 ?
                                                            TaxSetting && TaxSetting.pos_prices_include_tax == 'no' ?
                                                                <div><del >{parseFloat(_amount).toFixed(2)}</del> {parseFloat(_final_amount).toFixed(2)} </div>
                                                                : <div><del>{parseFloat(item.subtotal + (taxInclusiveName == "" ? 0 : item.subtotal_tax)).toFixed(2)}</del> {(item.total + (taxInclusiveName == "" ? 0 : item.subtotal_tax) + _productCartDiscountAmount).toFixed(2)} </div>
                                                            : Math.round(parseFloat(item.subtotal + (taxInclusiveName == "" ? 0 : item.subtotal_tax)).toFixed(2))
                                                }
                                            </p>
                                        </div>
                                        <div className="item-fields">
                                            {sku ? <p>SKU: {sku}</p> : ''}

                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }

                    <div className="custom-fields" style={{ display: 'none' }}>
                        <p className="style1">Custom Fields</p>
                        <p className="style2">Sizing Chart ID: HIOK23498979</p>
                        <p className="style2">Employee Compensation: 20%</p>
                    </div>
                    <div className="transaction-totals-wrapper">
                        <div className="transaction-totals">
                            <div className="row">
                                <p>Sub-total</p>
                                <p><b>{props.Subtotal != 'NaN' ? (props.TotalAmount - props.refunded_amount) == 0 ? 0.00
                                    : taxInclusiveName !== "" ?
                                        ((parseFloat(props.Subtotal) + parseFloat(props.TotalTax) + totalDiscount - props.tax_refunded - props.cash_round)).toFixed(2)
                                        : (parseFloat(props.Subtotal) + totalDiscount).toFixed(2) //- props.cash_round
                                    : 0}  </b></p>
                            </div>
                            <div className="row">
                                <p>Total Tax (15%)</p>
                                <p><b>{(props.TotalAmount - props.refunded_amount) == 0 ? 0.00 : (props.TotalTax - props.tax_refunded).toFixed(2)}</b></p>
                            </div>

                            {totalDiscount !== 0 ?
                                <div className="row border-bottom">
                                    <p><b className="bold2">Discount</b></p>
                                    <p><b className="bold2">{totalDiscount == 0 ? 0.00 : (totalDiscount).toFixed(2)}</b></p>
                                </div> : null}


                            {props.cash_round !== 0 ?
                                <div className="row border-bottom">
                                    <p><b className="bold2">Cash Rounding</b></p>
                                    <p><b className="bold2">{(props.TotalAmount - props.refunded_amount) == 0 ? 0.00 : props.cash_round}</b></p>
                                </div> : null}

                            <div className="row">
                                <p className="style2">Payments</p>
                            </div>

                            {props.OrderPayment ? props.OrderPayment.map((item, index) => {
                                if (item.type !== null) {
                                    return (
                                        <div className="row">
                                            <p>{`${Capitalize(item.type)} (${FormateDateAndTime.formatDateAndTime(item.payment_date, props.TimeZone)}) `} </p>
                                            <p><b>{item.amount.toFixed(2)}</b></p>
                                        </div>
                                    )
                                }
                            }) : null}

                            {cashChange !== '' && cashChange ? (
                                <div className="row border-bottom">
                                    <p><b className="bold2">{`${Capitalize('change')}`} </b></p>
                                    <p><b className="bold2">{cashChange}</b></p>
                                </div>) : null}


                            {cashPayment !== '' && cashPayment ? (
                                <div className="row border-bottom">
                                    <p><b className="bold2">{`${Capitalize('cash payment')}`} </b></p>
                                    <p><b className="bold2">{cashPayment}</b></p>
                                </div>) : null}

                            {(props.refunded_amount > 0) ?
                                <div className="row border-bottom">
                                    <p><b className="bold2">Refunded tax  </b></p>
                                    <p><b className="bold2">{(props.tax_refunded).toFixed(2)}</b></p>
                                </div> : null}

                            {props.refundCashRounding !== 0 &&
                                <div className="row border-bottom">
                                    <p><b className="bold2">Refund Cash Rounding   </b></p>
                                    <p><b className="bold2">{(props.refunded_amount - props.refundCashRounding) == 0 ? 0.00 : (props.refundCashRounding)}</b></p>
                                </div>}

                            {(props.refunded_amount > 0) ?
                                <div className="row border-bottom">
                                    <p><b className="bold2">Refunded Amount   </b></p>
                                    <p><b className="bold2">{(props.refunded_amount).toFixed(2)}</b></p>
                                </div> : null}

                            {(props.refunded_amount > 0) ?
                                <div className="row">
                                    <p className="style2">Refund Payments</p>
                                </div>
                                : null}

                            {
                                (props.refunded_amount > 0) && (
                                    (typeof props.refundPayments !== "undefined" && props.refundPayments.length > 0) && (
                                        props.refundPayments && props.refundPayments.map((item, index) => {
                                            return (
                                                <div className="row">
                                                    <p>{`${Capitalize(item.type)} (${FormateDateAndTime.formatDateAndTime(item.payment_date, props.TimeZone)}) `} </p>
                                                    <p><b>{item.amount.toFixed(2)}</b></p>
                                                </div>
                                            )
                                        })
                                    )
                                )
                            }
                            <div className="row border-top">
                                <p><b className="bold2">Balance</b></p>
                                <p><b className="bold2">{remaining_balance >= 0 ? parseFloat(remaining_balance).toFixed(2) : parseFloat(props.balence).toFixed(2)} </b></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ActivityOrderList