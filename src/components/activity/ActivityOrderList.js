import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import STATUSES from "../../constants/apiStatus";
import { showSubTitle, showTitle, getInclusiveTaxType } from "../../settings/CommonModuleJS";
import { FormateDateAndTime } from '../../settings/FormateDateAndTime';
import shirt from '../../assets/images/Temp/shirt.png'
import { LoadingModal } from "../common/commonComponents/LoadingModal";
import { useIndexedDB } from 'react-indexed-db';
import { Await } from "react-router-dom";
const ActivityOrderList = () => {
    const { add, update, getByID, getAll, deleteRecord } = useIndexedDB("products");





    const [activityOrderDetails, setActivityOrderDetails] = useState(null)
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










    var isTotalRefund = false;
    if (activityOrderDetails && (activityOrderDetails.total_amount - data.refunded_amount).toFixed(2) == '0.00') {
        isTotalRefund = true
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



    return (
        <>
            {activitygetdetails.status == STATUSES.LOADING ? <LoadingModal></LoadingModal> : null}
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
                                                        <div><del >{parseFloat(_amount).toFixed(2)}</del>{parseFloat(_final_amount).toFixed(2)} </div>
                                                        : <div><del>{parseFloat(item.subtotal + (taxInclusiveName == "" ? 0 : item.subtotal_tax)).toFixed(2)}</del>{(item.total + (taxInclusiveName == "" ? 0 : item.subtotal_tax) + _productCartDiscountAmount).toFixed(2)} </div>
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



            {/* <div className="custom-fields">
                <p className="style1">Custom Fields</p>
                <p className="style2">Sizing Chart ID: HIOK23498979</p>
                <p className="style2">Employee Compensation: 20%</p>
            </div> */}
        </>
    )
}

export default ActivityOrderList