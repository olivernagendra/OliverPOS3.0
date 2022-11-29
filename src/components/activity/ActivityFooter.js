import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { PrintPage } from "../common/PrintPage";
import moment from 'moment';
import STATUSES from "../../constants/apiStatus";
import { FormateDateAndTime } from '../../settings/FormateDateAndTime';
import { getTotalTaxByName, TaxSetting, getTaxAllProduct } from "../common/TaxSetting";
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import CommonModuleJS from "../../settings/CommonModuleJS";
import Config from '../../Config'
import { useIndexedDB } from 'react-indexed-db';
import ViewReceipt from "../common/commonComponents/ViewReceipt";
export const ActivityFooter = (props) => {
    const navigate = useNavigate()
    const { getAll } = useIndexedDB("products");
    const [activityOrderDetails, setActivityOrderDetails] = useState([])
    const [productList, setProductList] = useState([])
    const [isShowViewReceipt, setisShowViewReceipt] = useState(false)

    const toggleViewReceipt = () => {
        setisShowViewReceipt(!isShowViewReceipt)
    }

    let useCancelled = false;
    useEffect(() => {
        if (useCancelled == false) {
            getAll().then((rows) => {
                var allProdcuts = getTaxAllProduct(rows);
                setProductList(allProdcuts)
            });
        }
        return () => {
            useCancelled = true;
        }
    }, []);



    var JsBarcode = require('jsbarcode');
    var print_bar_code;
    function textToBase64Barcode(text) {
        var canvas = document.createElement("canvas");
        JsBarcode(canvas, text, {
            format: "CODE39", displayValue: false, width: 1,
            height: 30,
        });
        print_bar_code = canvas.toDataURL("image/png");
        return print_bar_code;
    }


    // Getting Response from activitygetDetail Api
    const [activitygetdetails] = useSelector((state) => [state.activityGetDetail])
    useEffect(() => {
        if (activitygetdetails && activitygetdetails.status == STATUSES.IDLE && activitygetdetails.is_success && activitygetdetails.data) {
            setActivityOrderDetails(activitygetdetails.data.content);
        }
    }, [activitygetdetails]);

    var orderList = ''
    var DateTime = activityOrderDetails
    var gmtDateTime = "";
    if (DateTime && DateTime.OrderDateTime && DateTime.time_zone) {
        gmtDateTime = FormateDateAndTime.formatDateAndTime(DateTime.OrderDateTime, DateTime.time_zone)
    }
    var Totalamount = activityOrderDetails ? activityOrderDetails.total_amount : 0
    var cash_rounding_amount = activityOrderDetails ? activityOrderDetails.cash_rounding_amount : 0
    var refunded_amount = activityOrderDetails ? activityOrderDetails.refunded_amount : 0
    var isTotalRefund = false;
    if ((Totalamount - refunded_amount).toFixed(2) == '0.00') {
        isTotalRefund = true
    }
    var type = 'activity';
    var productxList = "";
    var AllProductList = "";
    var cloudPrinters = localStorage.getItem('cloudPrinters') ? JSON.parse(localStorage.getItem('cloudPrinters')) : []
    var order_reciept = localStorage.getItem('orderreciept') ? localStorage.getItem('orderreciept') === "undefined" ? null : JSON.parse(localStorage.getItem('orderreciept')) : "";
    var TotalTaxByName = (order_reciept && order_reciept.ShowCombinedTax == false) ? activityOrderDetails && activityOrderDetails.order_taxes && getTotalTaxByName(activityOrderDetails.order_taxes, activityOrderDetails.order_include_tax, activityOrderDetails.total_amount - activityOrderDetails.total_tax) : "";
    var redeemPointsToPrint = activityOrderDetails ? activityOrderDetails.meta_datas && activityOrderDetails.meta_datas[1] ? activityOrderDetails.meta_datas[1].ItemValue : 0 : 0
    var appreposnse = ''
    // print by local printer in case no cloud printer available or if any available show cloud popup
    function PrintClick() {
        toggleViewReceipt();

        // var printersList = cloudPrinters
        // if (printersList && printersList.length > 0) { }
        // else {
        PrintPage.PrintElem(activityOrderDetails, props.getPdfdateTime, isTotalRefund, cash_rounding_amount, textToBase64Barcode(activityOrderDetails.OliverReciptId), orderList, type, productxList, AllProductList, TotalTaxByName, redeemPointsToPrint
            , appreposnse);
        //}


        //For Tickera ------------------------------------            
        if (activityOrderDetails && activityOrderDetails.TicketDetails && activityOrderDetails.TicketDetails != "" && activityOrderDetails.TicketDetails.length > 0) {
            // Ticket_print();
        }

        //--------------------------------------------
    }


    const VoidPOP = () => {
        alert('canceled')
    }


    const RefundPOP = () => {
        alert('refunded')
    }


    const onClick1 = () => {
        onClick2("statuscompleted", activityOrderDetails ? activityOrderDetails && activityOrderDetails.order_id : 0)
    }



    const onClick2 = (type, id, productList = []) => {
        // console.log("type")
        if (type == 'statuscompleted' && id) {
            if (CommonModuleJS.permissionsForRefund() == false) {
                //  this.setState({ common_Msg: '' })
                // $('#common_msg_popup').modal('show');
                //  showModal('common_msg_popup');
            } else {
                var single_Order_list = activityOrderDetails;
                single_Order_list.order_custom_fee && single_Order_list.order_custom_fee.length > 0 &&
                    single_Order_list.order_custom_fee.map(item => {
                        item = getCustomFeeDetails(item);
                    })
                setTimeout(function () {
                    localStorage.setItem("getorder", JSON.stringify(single_Order_list))
                    // window.location = '/refund'
                    localStorage.removeItem("oliver_refund_order_payments");
                    navigate('/refund');
                }, 100)
            }
        }
        if (type == 'statuspending' && id) {
            localStorage.removeItem("oliver_order_payments"); //remove existing payments   
            // sessionStorage.getItem("OrderDetail") for mobile view.............
            var single_Order_list = sessionStorage.getItem("OrderDetail") && sessionStorage.getItem("OrderDetail") !== undefined ? JSON.parse(sessionStorage.getItem("OrderDetail")) : activityOrderDetails
            var addcust;

            var typeOfTax = TaxSetting.typeOfTax()
            var setOrderPaymentsToLocalStorage = new Array();
            if (typeof single_Order_list.order_payments !== 'undefined') {
                single_Order_list.order_payments.map(pay => {
                    var _payDetail = {
                        "Id": pay.Id,
                        "payment_type": pay.type,
                        "payment_amount": pay.amount,
                        "order_id": single_Order_list.order_id,
                        "type": pay.type,
                        "transection_id": pay.transection_id
                    }
                    if (pay.payment_date && pay.payment_date != "") {
                        _payDetail["payment_date"] = pay.payment_date;
                    }
                    setOrderPaymentsToLocalStorage.push(_payDetail);

                })
            }
            localStorage.setItem("oliver_order_payments", JSON.stringify(setOrderPaymentsToLocalStorage))
            localStorage.setItem("VOID_SALE", "void_sale");
            var deafult_tax = localStorage.getItem('APPLY_DEFAULT_TAX') && localStorage.getItem('APPLY_DEFAULT_TAX') !== undefined ? JSON.parse(localStorage.getItem("APPLY_DEFAULT_TAX")) : null;
            var ListItem = new Array();
            var taxIds = null;
            if (single_Order_list.line_items !== null && single_Order_list.line_items[0] && single_Order_list.line_items[0].Taxes !== null && single_Order_list.line_items[0].Taxes !== 'undefined' && single_Order_list.line_items.length > 0) {
                taxIds = single_Order_list.line_items && single_Order_list.line_items[0].Taxes;
            }
            var taxArray = taxIds && taxIds !== undefined ? JSON.parse(taxIds).total : null;
            var Taxes = taxArray ? Object.entries(taxArray).map(item => ({ [item[0]]: item[1] })) : deafult_tax;
            // console.log("taxIds", taxIds)
            // console.log("Taxes", Taxes)
            single_Order_list.line_items.map(item => {
                //productList from mobile view
                var _productList = productList && productList.length > 0 ? productList : productList;
                var productData = _productList.find(prdID => prdID.WPID == item.product_id && (item.bundled_parent_key == '' || item.bundled_parent_key == null));
                var SingleOrderMetaData = single_Order_list && single_Order_list.meta_datas && single_Order_list.meta_datas.find(data => data.ItemName == '_order_oliverpos_product_discount_amount')
                SingleOrderMetaData = SingleOrderMetaData ? SingleOrderMetaData.ItemValue : []
                var productDiscountData = SingleOrderMetaData && SingleOrderMetaData !== undefined ? SingleOrderMetaData.length > 0 && JSON.parse(SingleOrderMetaData) : []
                var orderMetaData = productDiscountData && productDiscountData != [] && productDiscountData.find(metaData => metaData.variation_id ? metaData.variation_id == item.product_id : metaData.product_id == item.product_id);
                if (orderMetaData && orderMetaData.discountCart) {
                    var cart = {
                        type: 'card',
                        discountType: (orderMetaData.discountCart.discountType == '%' || orderMetaData.discountCart.discountType == "Percentage") ? "Percentage" : "Number",
                        discount_amount: orderMetaData.discountCart.discount_amount,
                        Tax_rate: orderMetaData.discountCart.Tax_rate
                    }
                    localStorage.setItem("CART", JSON.stringify(cart))
                }
                if (productData || orderMetaData) {
                    ListItem.push({
                        Price: orderMetaData && orderMetaData.Price ? orderMetaData.Price : item.subtotal,
                        // Price: item.subtotal,
                        // Title: item.name,
                        Title: orderMetaData ? orderMetaData.Title : item.name,
                        Sku: orderMetaData ? orderMetaData.Sku : productData && productData.Sku,
                        // product_id: 
                        product_id: orderMetaData ? orderMetaData.product_id : (productData && productData.Type == "variation") ? productData.ParentId : item.product_id,
                        // quantity: item.quantity,
                        quantity: orderMetaData ? orderMetaData.quantity : item.quantity,
                        after_discount: orderMetaData ? orderMetaData.after_discount : (item.total == item.subtotal) ? 0 : item.total,
                        discount_amount: orderMetaData ? orderMetaData.discount_amount : (item.total == item.subtotal) ? 0 : item.subtotal - item.total,
                        // variation_id: (productData.Type == "variation") ? item.product_id : 0,
                        variation_id: orderMetaData ? orderMetaData.variation_id : (productData && productData.Type == "variation") ? item.product_id : 0,
                        cart_after_discount: orderMetaData ? orderMetaData.cart_after_discount : (item.total == item.subtotal) ? 0 : item.total,
                        cart_discount_amount: orderMetaData ? orderMetaData.cart_discount_amount : 0,
                        product_after_discount: orderMetaData ? orderMetaData.product_after_discount : 0,
                        product_discount_amount: orderMetaData ? orderMetaData && orderMetaData.product_discount_amount ? orderMetaData.product_discount_amount : 0 : 0,
                        old_price: orderMetaData ? orderMetaData.old_price : productData ? productData.Price : 0,
                        discount_type: orderMetaData ? orderMetaData.discount_type : null,
                        new_product_discount_amount: orderMetaData ? orderMetaData.new_product_discount_amount : 0,
                        line_item_id: item.line_item_id,
                        subtotalPrice: item.subtotal,
                        subtotaltax: item.subtotal_tax,
                        totalPrice: item.total,
                        totaltax: item.total_tax,
                        // after_discount: (item.total == item.subtotal) ? 0 : item.total,
                        // discount_amount: (item.total == item.subtotal) ? 0 : item.subtotal - item.total,
                        // old_price: productData.Price,
                        incl_tax: typeOfTax == 'incl' ? item.subtotal_tax : 0,
                        excl_tax: typeOfTax == 'Tax' ? item.subtotal_tax : 0,
                        Taxes: item.Taxes,
                        // product_discount_amount: (item.total == item.subtotal) ? 0 : item.subtotal - item.total,
                        // TaxClass: productData.TaxClass,
                        // TaxStatus: productData.TaxStatus,
                        isTaxable: productData && productData.Taxable,
                        // ticket_status: productData.IsTicket,
                        ticket_status: orderMetaData ? orderMetaData.ticket_status : null,
                        tick_event_id: orderMetaData ? orderMetaData.tick_event_id : null,
                        ticket_info: orderMetaData ? orderMetaData.ticket_info : null,
                        product_ticket: orderMetaData ? orderMetaData.product_ticket : null,
                        TaxStatus: orderMetaData ? orderMetaData.TaxStatus : productData && productData.TaxStatus,
                        tcForSeating: orderMetaData ? orderMetaData.tcForSeating : null,
                        TaxClass: orderMetaData ? orderMetaData.TaxClass : productData && productData.TaxClass,
                        addons: item.meta && item.meta ? JSON.parse(item.meta) : '',
                        strProductX: ''
                    })
                }
            })

            // add custom fee to the CARD_PRODUCT_LIST
            var orderMeta = single_Order_list && single_Order_list.meta_datas && single_Order_list.meta_datas.find(data => data.ItemName == '_order_oliverpos_product_discount_amount');
            orderMeta = orderMeta ? orderMeta.ItemValue : [];
            var parsedFeeData = orderMeta && orderMeta !== undefined ? orderMeta.length > 0 && JSON.parse(orderMeta) : [];
            var orderFeeData = parsedFeeData && parsedFeeData !== [] && parsedFeeData.find(item => item.order_custom_fee);

            if (orderFeeData && orderFeeData.order_custom_fee.length > 0 && orderFeeData.order_custom_fee) {
                orderFeeData && orderFeeData.order_custom_fee.map(item => {
                    ListItem.push({
                        Title: item.note,
                        Price: item.amount !== 0 ? item.amount : null,
                        TaxClass: item.TaxClass,
                        TaxStatus: item.TaxStatus,
                        after_discount: item.after_discount,
                        cart_after_discount: item.cart_after_discount,
                        cart_discount_amount: item.cart_discount_amount,
                        discount_amount: item.discount_amount,
                        discount_type: item.discount_type,
                        excl_tax: item.excl_tax,
                        incl_tax: item.incl_tax,
                        isTaxable: item.isTaxable,
                        new_product_discount_amount: item.new_product_discount_amount,
                        old_price: item.old_price,
                        product_after_discount: item.product_after_discount,
                        product_discount_amount: item.product_discount_amount,
                        quantity: item.quantity,

                    })
                })
            }


            // add notes in cart list
            if ((typeof single_Order_list.order_notes !== 'undefined') && single_Order_list.order_notes.length !== 0) {
                single_Order_list.order_notes.map(item => {
                    ListItem.push({
                        Title: item.note,
                        id: item.note_id
                    })
                })
            }

            if ((typeof single_Order_list.order_payments !== 'undefined') && single_Order_list.order_payments.length == 0 && single_Order_list && single_Order_list.order_id == 0) {
                //this.props.single_Order_list && this.props.single_Order_list.order_id == 0) {
                localStorage.setItem("CARD_PRODUCT_LIST", JSON.stringify(ListItem))
                localStorage.removeItem("VOID_SALE")
            } else {
                if (single_Order_list.order_status != "park_sale" && single_Order_list.order_status != "pending" && single_Order_list.order_status !== 'on-hold' && single_Order_list.order_status !== 'lay_away') {
                    // if (single_Order_list.order_status != "park_sale" && single_Order_list.order_status != "pending") {
                    localStorage.setItem("VOID_SALE", "void_sale")
                    localStorage.removeItem("CARD_PRODUCT_LIST")
                    // remove void sale for park_sale
                } else {
                    localStorage.setItem("CARD_PRODUCT_LIST", JSON.stringify(ListItem))
                    if (localStorage.getItem("oliver_order_payments") == null || (typeof single_Order_list.order_payments !== 'undefined') && single_Order_list.order_payments.length == 0) {
                        localStorage.removeItem("VOID_SALE")
                    }
                }
            }
            var orderCustomerInfo = (typeof single_Order_list.orderCustomerInfo !== 'undefined') && single_Order_list.orderCustomerInfo !== null ? single_Order_list.orderCustomerInfo : null;
            if (orderCustomerInfo !== null) {
                addcust = {
                    content: {
                        AccountBalance: 0,
                        City: orderCustomerInfo.customer_city ? orderCustomerInfo.customer_city : '',
                        Email: orderCustomerInfo.customer_email ? orderCustomerInfo.customer_email : '',
                        FirstName: orderCustomerInfo.customer_first_name ? orderCustomerInfo.customer_first_name : '',
                        Id: orderCustomerInfo.customer_id ? orderCustomerInfo.customer_id : single_Order_list.customer_id,
                        LastName: orderCustomerInfo.customer_last_name ? orderCustomerInfo.customer_last_name : '',
                        Notes: orderCustomerInfo.customer_note ? orderCustomerInfo.customer_note : '',
                        Phone: orderCustomerInfo.customer_phone ? orderCustomerInfo.customer_phone : '',
                        Pin: 0,
                        Pincode: orderCustomerInfo.customer_post_code ? orderCustomerInfo.customer_post_code : '',
                        StoreCredit: orderCustomerInfo.store_credit ? orderCustomerInfo.store_credit : '',
                        StreetAddress: orderCustomerInfo.customer_address ? orderCustomerInfo.customer_address : '',
                        UID: 0,
                        WPId: orderCustomerInfo.customer_id ? orderCustomerInfo.customer_id : single_Order_list.customer_id,
                    }
                }
                localStorage.setItem('AdCusDetail', JSON.stringify(addcust));
                sessionStorage.setItem("CUSTOMER_ID", orderCustomerInfo.customer_id ? orderCustomerInfo.customer_id : single_Order_list.customer_id)
            }
            // single_Order_list.line_items.map(item => {

            // var discountOrderMeta = single_Order_list && single_Order_list.meta_datas[2] ? single_Order_list.meta_datas[2].ItemValue : []
            var SingleOrderMetaData = single_Order_list && single_Order_list.meta_datas && single_Order_list.meta_datas.find(data => data.ItemName == '_order_oliverpos_product_discount_amount')
            SingleOrderMetaData = SingleOrderMetaData && SingleOrderMetaData !== undefined ? SingleOrderMetaData.ItemValue : []
            var productDiscountData = SingleOrderMetaData.length > 0 && JSON.parse(SingleOrderMetaData)
            // var orderMetaData = productDiscountData && productDiscountData != [] && productDiscountData.find(metaData => metaData.product_id);

            // total_subTotal_fileds sent from checkout in meta when we order as a park or lay-away
            var orderMetaData = productDiscountData && productDiscountData != [] && productDiscountData.find(itm => itm.total_subTotal_fileds);
            // });
            orderMetaData = orderMetaData && orderMetaData.total_subTotal_fileds && orderMetaData.total_subTotal_fileds.totalPrice && orderMetaData.total_subTotal_fileds.subTotal ? orderMetaData.total_subTotal_fileds : null
            var CheckoutList = {
                ListItem: ListItem,
                customerDetail: orderCustomerInfo ? addcust : null,
                totalPrice: orderMetaData ? orderMetaData.totalPrice : single_Order_list.total_amount,
                // totalPrice: single_Order_list.total_amount,
                discountCalculated: single_Order_list.discount,
                tax: single_Order_list.total_tax,
                subTotal: orderMetaData ? parseFloat(orderMetaData.subTotal) : parseFloat(single_Order_list.total_amount) - parseFloat(single_Order_list.total_tax),
                // subTotal: parseFloat(single_Order_list.total_amount) - parseFloat(single_Order_list.total_tax),
                // TaxId: deafult_tax && deafult_tax[0] ? deafult_tax[0].TaxId : 0,
                TaxId: Taxes ? Taxes : 0,
                status: single_Order_list.order_status,
                order_id: single_Order_list && single_Order_list.order_id,
                oliver_pos_receipt_id: single_Order_list && single_Order_list.OliverReciptId,
                order_date: moment(single_Order_list.OrderDateTime).format(Config.key.DATETIME_FORMAT),
                showTaxStaus: typeOfTax == 'Tax' ? typeOfTax : 'Incl. Tax',
            }
            localStorage.removeItem('PENDING_PAYMENTS');
            localStorage.setItem("CHECKLIST", JSON.stringify(CheckoutList))
            var addonsItem = []
            ListItem && ListItem.map((list) => {
                if (list && list.addons && list.addons !== '' && list.addons.length > 0) {
                    list['Type'] = list.variation_id && list.variation_id !== 0 ? 'variable' : 'simple'
                    list['line_subtotal'] = list.Price
                    list['line_subtotal_tax'] = list.subtotaltax
                    list['line_tax'] = list.totaltax
                    list['strProductX'] = ''
                    addonsItem.push(list)
                }
            })
            localStorage.setItem("PRODUCTX_DATA", JSON.stringify(addonsItem))
            localStorage.setItem("BACK_CHECKOUT", true)
            // window.location = '/checkout';
            navigate('/checkout')

        }
    }

    const getCustomFeeDetails = (_itemPara) => {
        var _item = { ..._itemPara };
        var getorderlist = activityOrderDetails && activityOrderDetails.meta_datas && activityOrderDetails.meta_datas !== null ? activityOrderDetails.meta_datas.find(data => data.ItemName == '_order_oliverpos_product_discount_amount') : null;
        if (getorderlist !== null) {
            getorderlist = getorderlist && getorderlist.ItemValue && JSON.parse(getorderlist.ItemValue);
            getorderlist && getorderlist.map((item, index) => {
                item && item.order_custom_fee && item.order_custom_fee.map((fee, index) => {
                    if (item.order_custom_fee != null && _item.note == fee.note) {
                        var _total_tax = {};
                        fee.total_taxes && fee.total_taxes.map((item, index) => {
                            Object.assign(_total_tax, item)
                        });
                        // var _Tax= JSON.stringify({"total":(fee.total_taxes && Array.isArray(fee.total_taxes) && fee.total_taxes.length>0) ?fee.total_taxes[0]:{},"subtotal":fee.subtotal_taxes && Array.isArray(fee.subtotal_taxes) &&fee.subtotal_taxes.length>0?fee.subtotal_taxes[0]:{}});
                        var _Tax = JSON.stringify({ "total": _total_tax, "subtotal": _total_tax });

                        _item['line_item_id'] = _item.fee_id;
                        _item['quantity'] = 1;
                        _item['total'] = fee.incl_tax != 0 ? _item.amount - fee.total_tax : _item.amount;
                        _item['subtotal'] = fee.incl_tax != 0 ? _item.amount - fee.subtotal_tax : item.amount;
                        // _item['subtotal_tax'] = 0;
                        // _item['total_tax'] = _item.total_tax;
                        _item['name'] = _item.note;
                        _item['is_ticket'] = false;
                        _item['product_id'] = 0;
                        _item['parent_id'] = 0;
                        _item['Taxes'] = _Tax;

                        _item['variation_id'] = 0;
                        _item['amount_refunded'] = _item.amount_refunded;
                        _item['quantity_refunded'] = _item.amount_refunded > 0 ? -1 : 0;
                        // var _subtotal=_item.subtotal;
                        _item['subtotal_tax'] = fee.subtotal_tax ? fee.subtotal_tax : 0;
                        _item['subtotal_taxes'] = fee.subtotal_taxes ? fee.subtotal_taxes : [];
                        _item['total_tax'] = fee.total_tax ? fee.total_tax : 0;
                        _item['total_taxes'] = fee.total_taxes ? fee.total_taxes : [];

                    }
                });
            })
        }
        return _item
    }



    return (
        <React.Fragment>
            <div className="footer">
                <button id="refundButton" disabled={activityOrderDetails && (activityOrderDetails.order_status == "refunded" || activityOrderDetails.order_status == "pending" || activityOrderDetails.order_status == "lay_away" || activityOrderDetails.order_status == "on-hold"
                    || activityOrderDetails.order_status == "park_sale" || activityOrderDetails.order_status == "init sale" || activityOrderDetails.order_status == "processing"
                    || activityOrderDetails.order_status == "") ? true : false} style={{
                        opacity: activityOrderDetails && (activityOrderDetails.order_status == "refunded" || activityOrderDetails.order_status == "pending" || activityOrderDetails.order_status == "lay_away" || activityOrderDetails.order_status == "on-hold"
                            || activityOrderDetails.order_status == "park_sale" || activityOrderDetails.order_status == "init sale" || activityOrderDetails.order_status == "processing"
                            || activityOrderDetails.order_status == "" || activityOrderDetails.order_status == "cancelled") ? 0.5 : 1
                    }} onClick={() =>
                        activityOrderDetails.order_status == 'completed' ? onClick1()
                            : (activityOrderDetails.order_status == "pending" || activityOrderDetails.order_status == "lay_away" || activityOrderDetails.order_status == "on-hold" || activityOrderDetails.order_status == "park_sale" || activityOrderDetails.order_status == "init sale" || activityOrderDetails.order_status == "processing") ? onClick2("statuspending", activityOrderDetails ? activityOrderDetails && activityOrderDetails.order_id : '')
                                : activityOrderDetails.order_status == "refunded" ? RefundPOP
                                    : (activityOrderDetails.order_status == "void_sale" || activityOrderDetails && activityOrderDetails.order_status == "cancelled" || activityOrderDetails.order_status == "cancelled_sale") ? VoidPOP
                                        : null
                    }  > {activityOrderDetails.order_status == 'completed' ? LocalizedLanguage.refundSale
                        : (activityOrderDetails.order_status == "pending" || activityOrderDetails.order_status == "lay_away" || activityOrderDetails.order_status == "on-hold"
                            || activityOrderDetails.order_status == "park_sale" || activityOrderDetails.order_status == "init sale" || activityOrderDetails.order_status == "processing"
                            || activityOrderDetails.order_status == "") ? LocalizedLanguage.refundedSale
                            : activityOrderDetails.order_status == "refunded" ? LocalizedLanguage.refundedSale
                                : (activityOrderDetails.order_status == "void_sale" || activityOrderDetails.order_status == "cancelled" || activityOrderDetails.order_status == "cancelled_sale") ? LocalizedLanguage.cancel
                                    : null
                    }</button>

                <button id="receiptButton" onClick={() => toggleViewReceipt()}>Receipt</button>
                <button disabled={activityOrderDetails && activityOrderDetails.order_status == 'completed' || activityOrderDetails && activityOrderDetails.order_status == 'refunded' || (activityOrderDetails.order_status == "void_sale" || activityOrderDetails.order_status == "cancelled" || activityOrderDetails.order_status == "cancelled_sale") ? true : false} style={{ opacity: activityOrderDetails && activityOrderDetails.order_status == 'completed' || activityOrderDetails && activityOrderDetails.order_status == 'refunded' || (activityOrderDetails.order_status == "void_sale" || activityOrderDetails.order_status == "cancelled" || activityOrderDetails.order_status == "cancelled_sale") ? 0.5 : 1 }} id="openSaleButton">Open Sale</button>
            </div>
            {isShowViewReceipt ? <ViewReceipt isShow={isShowViewReceipt} toggleViewReceipt={toggleViewReceipt} PrintClick={PrintClick}></ViewReceipt> : null}
        </React.Fragment>
    )
}
