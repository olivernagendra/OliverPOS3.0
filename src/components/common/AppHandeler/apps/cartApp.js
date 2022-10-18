import { postmessage } from "../commonAppHandler";
import { getInclusiveTaxType, getTaxAllProduct, PrintPage } from "../../../../settings/CommonModuleJS";
import TaxSetting, { changeTaxRate, getTotalTaxByName } from '../../TaxSetting'
import $ from 'jquery'
import LocalizedLanguage from "../../../../settings/LocalizedLanguage";
import ActiveUser from '../../../../settings/ActiveUser'
import { store } from "../../../../app/store";
import { addtoCartProduct as addCartProductAction } from "../../../dashboard/product/productLogic";
import { get_UDid } from "../../localSettings";
import moment from "moment";
import Config from '../../../../Config'
import { useIndexedDB } from "react-indexed-db";
var JsBarcode = require('jsbarcode');
var print_bar_code;
export const textToBase64Barcode = (text) => {
    var canvas = document.createElement("canvas");
    JsBarcode(canvas, text, {
        format: "CODE39", displayValue: false, width: 1,
        height: 30,
    });
    print_bar_code = canvas.toDataURL("image/png");
    return print_bar_code;
}
//**** Cart Value handle**************
//send the cart information tp app
export const handleCartValue = (RequestData, whereToview, isbackgroudApp) => {
    var clientJSON = ""

    var validationResponse = validateRequest(RequestData)

    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
    }
    else {
        var checklist = JSON.parse(localStorage.getItem("CHECKLIST"));
        var clientDetail = JSON.parse(localStorage.getItem("clientDetail"));
        if (whereToview == "RefundView") {
            checklist = JSON.parse(localStorage.getItem("getorder"));
            var tenderAmt = $('#my-input').val();
            var taxInclusiveName = getInclusiveTaxType(checklist.meta_datas);

            var oliver_refund_order_payments = localStorage.getItem("oliver_refund_order_payments") ? JSON.parse(localStorage.getItem("oliver_refund_order_payments")) : "";
            var totalPayment = 0.0;
            if (oliver_refund_order_payments && oliver_refund_order_payments !== "") {
                oliver_refund_order_payments.map(items => {
                    totalPayment = totalPayment + parseFloat(items.payment_amount);
                });
            }
            clientJSON = {
                command: RequestData.command,
                version: "1.0",
                method: RequestData.method,
                status: 200,
                error: null,
                data: {
                    sub_total: parseFloat(checklist.total_amount - (taxInclusiveName == "" ? checklist.total_tax : 0)).toFixed(2), //for exclusive tax
                    total_tax: checklist.total_tax,
                    discount: checklist && checklist.discount,
                    balance: checklist && checklist.total_amount - totalPayment,
                    tender_amt: tenderAmt && parseFloat(tenderAmt),
                    currency: clientDetail && clientDetail.currency
                }
            }
        } else {
            var tenderAmt = $('#my-input').val();
            //var tenderAmt=checklist && checklist.totalPrice;
            var oliver_order_payments = localStorage.getItem("oliver_order_payments") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : "";
            var totalPayment = 0.0;
            if (oliver_order_payments && oliver_order_payments !== "") {
                oliver_order_payments.map(items => {
                    totalPayment = totalPayment + parseFloat(items.payment_amount);
                });
            }
            clientJSON = {
                command: RequestData.command,
                version: "1.0",
                method: RequestData.method,
                status: 200,
                error: null,
                data: {
                    sub_total: checklist && checklist.subTotal,
                    total_tax: checklist && checklist.tax,
                    discount: checklist && checklist.discountCalculated,
                    balance: checklist && (checklist.totalPrice - totalPayment),
                    tender_amt: tenderAmt && parseFloat(tenderAmt), //- totalPayment ,
                    currency: clientDetail && clientDetail.currency
                }
            }
        }

    }
    // const { single_cutomer_list } = this.props
    if (clientJSON !== "") {
        //   if(isbackgroudApp==true)
        //   TriggerCallBack("product-detail",clientJSON);
        // else
        postmessage(clientJSON)
    }

}
export const handleCart = (RequestData, whereToview, isbackgroudApp) => {
    var clientJSON = ""

    var validationResponse = validateRequest(RequestData)

    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
    }
    else {
        var checklist = JSON.parse(localStorage.getItem("CHECKLIST"));
        if (whereToview == "RefundView") {
            checklist = JSON.parse(localStorage.getItem("getorder"));
        }

        clientJSON = {
            command: RequestData.command,
            version: "1.0",
            method: RequestData.method,
            status: 200,
            error: null,
        }
        if (RequestData.method == 'get') {
            var items = { "items": whereToview == "RefundView" ? checklist.line_items : checklist && checklist.ListItem }
            console.log("items", items.items)
            items && items.items && items.items.map(itm => {
                delete itm.line_item_id;
                delete itm.after_discount;
                delete itm.cart_after_discount;
                delete itm.cart_discount_amount;
                delete itm.product_after_discount;
                delete itm.product_discount_amount;
                delete itm.old_price;
                delete itm.ticket_status;
                delete itm.ticket_info;
                delete itm.product_ticket;
                delete itm.discount_type;
                delete itm.tcForSeating;
                delete itm.Type;
                delete itm.ManagingStock;
            })

            clientJSON['data'] = items;
        }
    }
    // const { single_cutomer_list } = this.props
    if (clientJSON !== "") {
        // if(isbackgroudApp==true)
        //   TriggerCallBack("product-detail",clientJSON);
        // else
        postmessage(clientJSON)
    }

}
export const addCartDiscount = (RequestData, isbackgroudApp, whereToview) => {
    if (whereToview !== 'CheckoutView') {
        return;
    }
    var clientJSON = ""
    var validationResponse = validateRequest(RequestData)

    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
        return postmessage(clientJSON)
    }
    if (RequestData.method == 'get') {

        clientJSON = {
            command: RequestData.command,
            version: "1.0",
            method: RequestData.method,
            status_code: 200,
            error: null
        }
        const CartDiscountAmount = localStorage.getItem("CART") ? JSON.parse(localStorage.getItem("CART")) : '';

        if (CartDiscountAmount && CartDiscountAmount !== "") {
            clientJSON['discount_name'] = "";
            clientJSON['amount'] = CartDiscountAmount.discount_amount;
            if (CartDiscountAmount.discountType.toLowerCase() == "number" || CartDiscountAmount.discountType.toLowerCase() == "$") {
                clientJSON['amount_type'] = "$";
            } else if (CartDiscountAmount.discountType.toLowerCase() == "percentage" || CartDiscountAmount.discountType.toLowerCase() == "%") {
                clientJSON['amount_type'] = "%";
            }

        } else {
            clientJSON['status_code'] = 406
            clientJSON['error'] = 'No discount applied'
        }
        postmessage(clientJSON)
    }
    else {
        try {
            var checkList = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
            const cartproductlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
            const CartDiscountAmount = localStorage.getItem("CART") ? JSON.parse(localStorage.getItem("CART")) : '';
            var subTotal = checkList && checkList.subTotal;
            var previousCartDiscount = 0;
            var product_after_discount = 0;
            var totalPrice = 0;
            var discount_amount = 0;
            var status = false;
            var discount_type = RequestData && RequestData.amount_type && RequestData.amount_type == '%' ? 'percent' : RequestData.amount_type == '$' ? 'number' : 'number';
            cartproductlist && cartproductlist.map((item, index) => {
                product_after_discount += parseFloat(item.product_discount_amount);
                if (item.product_id) {//donothing
                    totalPrice += item.Price
                }
            })

            if (CartDiscountAmount) {
                if (CartDiscountAmount.discountType.toLowerCase() == "number" && discount_type == "percent") {
                    previousCartDiscount = percentage(CartDiscountAmount.discount_amount, totalPrice - product_after_discount)
                } else if (CartDiscountAmount.discountType.toLowerCase() == "percentage" && discount_type == "number") {
                    previousCartDiscount = number(CartDiscountAmount.discount_amount, subTotal - product_after_discount)
                } else if (CartDiscountAmount.discountType.toLowerCase() == "number" && discount_type == "number") {
                    previousCartDiscount = CartDiscountAmount.discount_amount;
                } else {
                    previousCartDiscount = CartDiscountAmount.discount_amount;
                }
            }
            discount_amount = RequestData && RequestData.amount ? parseFloat(RequestData.amount) + parseFloat(previousCartDiscount) : 0;
            if (discount_type == "percent") {
                if (discount_amount > 100) {
                    status = true
                    setTimeout(function () {
                        // showModal('no_discount');
                    }, 100)
                }
            }
            if (discount_type == "number") {
                if (discount_amount > totalPrice) {
                    status = true
                    setTimeout(function () {
                        // showModal('no_discount');
                    }, 100)
                }
            }

            if (status == false) {
                var cart = {
                    type: 'card',
                    discountType: RequestData && RequestData.amount_type ? RequestData.amount_type == "%" ? "Percentage" : "Number" : "Number",
                    discount_amount: parseFloat(RequestData.amount) + parseFloat(previousCartDiscount),
                    Tax_rate: 0
                }

                localStorage.setItem("CART", JSON.stringify(cart))
                // store.dispatch(cartProductActions.addtoCartProduct(cartproductlist));
                setTimeout(() => {
                    var _price = 0;
                    var _tax = 0;
                    var _discount = 0;
                    var _incltax = 0;
                    var _excltax = 0;
                    var cartproductlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
                    checkList.ListItem = cartproductlist;
                    checkList.ListItem.map(items => {
                        if (items.Price) {
                            _price += parseFloat(items.Price);
                            _tax += parseFloat(items.excl_tax) + parseFloat(items.incl_tax);
                            _discount += parseFloat(items.discount_amount);
                            _incltax += parseFloat(items.incl_tax);
                            _excltax += parseFloat(items.excl_tax)
                        }
                    })

                    const CheckoutList = {
                        ListItem: checkList.ListItem,
                        customerDetail: checkList.customerDetail,
                        totalPrice: (_price + _excltax) - _discount,
                        discountCalculated: _discount,
                        tax: _tax,
                        subTotal: _price - _discount,
                        TaxId: checkList.TaxId,
                        order_id: checkList.order_id !== 0 ? checkList.order_id : 0,
                        showTaxStaus: checkList.showTaxStaus,
                        _wc_points_redeemed: checkList._wc_points_redeemed,
                        _wc_amount_redeemed: checkList._wc_amount_redeemed,
                        _wc_points_logged_redemption: checkList._wc_points_logged_redemption
                    }
                    localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));
                    // store.dispatch(checkoutActions.getAll(CheckoutList));
                    clientJSON = {
                        command: RequestData.command,
                        version: "1.0",
                        method: RequestData.method,
                        status_code: 200,
                        error: null
                    }
                    if (RequestData.data) {
                        localStorage.setItem("couponDetail", JSON.stringify(RequestData.data))
                    }
                    postmessage(clientJSON)

                }, 500);

                return "app-modificaiton-external"


            }
        } catch (error) {
            console.error('App Error : ', error);
        }
    }

}

export const cartTaxes = (RequestData, isbackgroudApp) => {
    var clientJSON = ""
    var validationResponse = validateRequest(RequestData)

    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
        return postmessage(clientJSON)
    }

    // $('div .dropup').addClass('open');
    // var taxRateList = this.state.taxRateList && this.state.taxRateList.length > 0 ? this.state.taxRateList : [];
    var taxRateList = localStorage.getItem('TAXT_RATE_LIST') ? JSON.parse(localStorage.getItem('TAXT_RATE_LIST')) : []
    var checkList = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
    if (RequestData.method == "get") {
        var ResTaxRateList = []
        var totalTaxRate = 0.00;
        checkList && checkList.TaxId && checkList.TaxId.map(taxApply => {
            totalTaxRate += parseFloat(Object.values(taxApply)[0]);
            console.log("Object.keys(taxApply)[0]", Object.keys(taxApply)[0])
            var FindId = taxRateList.find(isName => isName.TaxId === parseInt(Object.keys(taxApply)[0]));
            if (FindId) {
                ResTaxRateList.push({ "name": FindId.TaxName, "rate": FindId.TaxRate })
            }
        })

        clientJSON = {
            command: RequestData.command,
            version: "2.0",
            method: RequestData.method,
            "status": 200,
            "data": {
                "total_rate": totalTaxRate,
                "taxes": ResTaxRateList
            }
        }
        return postmessage(clientJSON)

    } if (RequestData.method == "post") {
        var _newtaxRate = {
            check_is: true,
            TaxRate: RequestData.data.rate,
            TaxName: RequestData.data.name,
            TaxId: '',
            Country: '',
            State: '',
            TaxClass: ''
        }
        if (taxRateList.length == 0) {
            taxRateList.push(_newtaxRate)
        } else {
            var FindId = taxRateList.find(isName => isName.TaxName === RequestData.data.name);
            if (FindId) {
                taxRateList.map(item => {
                    if (item.TaxId == FindId.TaxId) {
                        item['check_is'] = true; //FindId.check_is == true ? false : true
                    }
                })
            } else {
                taxRateList.push(_newtaxRate)
            }
        }

        var updateTaxCarproduct = changeTaxRate(taxRateList, 1);
        // store.dispatch(cartProductActions.updateTaxRateList(taxRateList));
        // store.dispatch(cartProductActions.addtoCartProduct(updateTaxCarproduct));
        console.log("TAXT_RATE_LIST", localStorage.getItem("TAXT_RATE_LIST"))
        setTimeout(() => {
            var _price = 0;
            var _tax = 0;
            var _discount = 0;
            var _incltax = 0;
            var _excltax = 0;
            //var cartproductlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
            checkList.ListItem = updateTaxCarproduct;
            checkList.ListItem.map(items => {
                if (items.Price) {
                    _price += parseFloat(items.Price);
                    _tax += parseFloat(items.excl_tax) + parseFloat(items.incl_tax);
                    _discount += parseFloat(items.discount_amount);
                    _incltax += parseFloat(items.incl_tax);
                    _excltax += parseFloat(items.excl_tax)
                }
            })
            const CheckoutList = {
                ListItem: checkList.ListItem,
                customerDetail: checkList.customerDetail,
                totalPrice: (_price + _excltax) - _discount,
                discountCalculated: _discount,
                tax: _tax,
                subTotal: _price - _discount,
                TaxId: checkList.TaxId,
                order_id: checkList.order_id !== 0 ? checkList.order_id : 0,
                showTaxStaus: checkList.showTaxStaus,
                _wc_points_redeemed: checkList._wc_points_redeemed,
                _wc_amount_redeemed: checkList._wc_amount_redeemed,
                _wc_points_logged_redemption: checkList._wc_points_logged_redemption
            }
            localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));
            //store.dispatch(checkoutActions.getAll(CheckoutList));
            clientJSON = {
                command: RequestData.command,
                version: "2.0",
                method: RequestData.method,
                status_code: 200,
                error: null
            }
            postmessage(clientJSON)

        }, 500);
        return "app-modificaiton-external"
    }
}

export const addProductToCart = (RequestData, isbackgroudApp, whereToview) => {

    if (whereToview !== 'CheckoutView') {
        return;
    }
    var clientJSON = ""
    var validationResponse = validateRequest(RequestData)

    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
        return postmessage(clientJSON)
    }


    //check the requested product exist into the index DB 
    var item;

    // var idbKeyval = FetchIndexDB.fetchIndexDb();

    // idbKeyval.get('ProductList').then(val => {

    //   if (!val || val.length == 0 || val == null || val == "") {
    //     //do nothing

    //   }
    //   else {
    //     var itemarry = val.filter(item => (item.WPID == RequestData.product_id))
    //     console.log("item", itemarry)
    //     if (itemarry && itemarry.length > 0) {
    //       itemarry = getTaxAllProduct(itemarry);
    //       item = itemarry[0];
    //     }
    //   }
    // });
    setTimeout(() => {

        if (item) {
            const cartproductlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
            //
            item["product_id"] = item.WPID
            item["quantity"] = RequestData.quantity;
            item["Price"] = item.Price * RequestData.quantity;
            cartproductlist.push(item)

            //store.dispatch(cartProductActions.addtoCartProduct(cartproductlist));



            setTimeout(() => {
                var _price = 0;
                var _tax = 0;
                var _discount = 0;
                var _incltax = 0;
                var _excltax = 0;
                var checkList = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
                var cartproductlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
                checkList.ListItem = cartproductlist;
                checkList.ListItem.map(items => {
                    if (items.Price) {
                        _price += parseFloat(items.Price);
                        _tax += parseFloat(items.excl_tax) + parseFloat(items.incl_tax);
                        _discount += parseFloat(items.discount_amount);
                        _incltax += parseFloat(items.incl_tax);
                        _excltax += parseFloat(items.excl_tax)
                    }
                })

                const CheckoutList = {
                    ListItem: checkList.ListItem,
                    customerDetail: checkList.customerDetail,
                    totalPrice: (_price + _excltax) - _discount,
                    discountCalculated: _discount,
                    tax: _tax,
                    subTotal: _price - _discount,
                    TaxId: checkList.TaxId,
                    order_id: checkList.order_id !== 0 ? checkList.order_id : 0,
                    showTaxStaus: checkList.showTaxStaus,
                    _wc_points_redeemed: checkList._wc_points_redeemed,
                    _wc_amount_redeemed: checkList._wc_amount_redeemed,
                    _wc_points_logged_redemption: checkList._wc_points_logged_redemption
                }
                localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));
                // store.dispatch(checkoutActions.getAll(CheckoutList));
            }, 700);


            clientJSON = {
                command: RequestData.command,
                version: "1.0",
                method: RequestData.method,
                status_code: 200,
                error: null
            }
            postmessage(clientJSON)

        } else {
            clientJSON = {
                command: RequestData.command,
                version: "1.0",
                method: RequestData.method,
                status_code: 406,
                error: 'Product not exist!'
            }
            postmessage(clientJSON)
        }
    }, 100);


    return "app-modificaiton-external"
}
export const Notes = (RequestData, isbackgroudApp, whereToview) => {
    var clientJSON = ""
    // if(whereToview !=='CheckoutView'){
    //   return;
    // }
    var validationResponse = validateRequest(RequestData)
    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
    }
    else {
        var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];//this.state.cartproductlist;
        clientJSON = {
            command: RequestData.command,
            method: RequestData.method,
            version: "1.0",
            status_code: 200,
        }

        if (RequestData.method == 'get') {
            var data = []
            cartlist && cartlist.map(item => {
                if (!item.product_id && !item.Price) { // only notes  can check
                    if (RequestData.note_id) {
                        if (item.note_id && item.note_id == RequestData.note_id) {
                            data.push({
                                "note_id": item.note_id,
                                "contents": item.Title
                            })
                        }
                    } else {
                        data.push({
                            "note_id": item.note_id ? item.note_id : "",
                            "contents": item.Title
                        })
                    }
                }
            })
            clientJSON['data'] = data;

        }
        if (RequestData.method == 'put') {
            var data = ""
            cartlist && cartlist.map(item => {
                if (!item.product_id && !item.Price) { // only notes  can check
                    if (RequestData.note_id) {
                        if (item.note_id && item.note_id == RequestData.note_id) {
                            item.Title = RequestData.contents;
                            data = {
                                "note_id": RequestData.note_id,
                                "contents": RequestData.contents
                            }
                        }
                    }
                }
            })
            if (data == "") {
                clientJSON['error'] = "not found";
            } else {
                clientJSON['data'] = data;
            }


        }
        if (RequestData.method == 'delete') {
            var data = ""
            cartlist && cartlist.map((item, index) => {
                if (!item.product_id && !item.Price) { // only notes  can check
                    if (RequestData.note_id) {
                        if (item.note_id && item.note_id == RequestData.note_id) {
                            cartlist.splice(index, 1)
                            data = {
                                "note_id": RequestData.note_id,
                                "contents": RequestData.contents
                            }
                        }
                    }
                }
            })

            if (data == "") {
                clientJSON['error'] = "not found";
            } else {
                clientJSON['data'] = data;
            }

        }
        else if (RequestData.method == 'post') {
            cartlist.push({ "note_id": RequestData.note_id, "Title": (RequestData.contents ? RequestData.contents : "") })

        }
        if (cartlist) {
            //store.dispatch(cartProductActions.addtoCartProduct(cartlist));
            var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
            if (list != null) {
                list.ListItem = cartlist
                localStorage.setItem('CHECKLIST', JSON.stringify(list))

            } else {
                list = cartlist
            }
            setTimeout(() => {
                // store.dispatch(checkoutActions.getAll(list));
                addCartProductAction(list)
            }, 200)
        }
    }


    postmessage(clientJSON)
    if (RequestData.method == 'post')
        return "app-modificaiton-external"
}

export function DoParkSale(RequestData) {
    const { getByID: getProductByID, getAll: getAllProducts } = useIndexedDB("products");
    var clientJSON = {};
    var validationResponse = validateRequest(RequestData)
    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
        return postmessage(clientJSON)
    }

    if (RequestData.method == "get" && RequestData.wc_order_no) {

        // var productList = []
        // var idbKeyval = FetchIndexDB.fetchIndexDb();
        // idbKeyval.get('ProductList').then(val => {
        //     if (!val || val.length == 0 || val == null || val == "") {
        //     } else { productList = val; }
        // });
        //var wc_order_no= RequestData.wc_order_no;
        var UID = get_UDid('UDID');
        //store.dispatch(activityActions.getDetail(RequestData.wc_order_no, UID));
        var single_Order_list = {};
        setTimeout(() => {
            const state = store.getState();
            if (state.single_Order_list && state.single_Order_list.items && state.single_Order_list.items.content) {
                single_Order_list = state.single_Order_list && state.single_Order_list.items.content;

                localStorage.removeItem("oliver_order_payments"); //remove existing payments   
                // sessionStorage.getItem("OrderDetail") for mobile view.............
                //var single_Order_list = sessionStorage.getItem("OrderDetail") && sessionStorage.getItem("OrderDetail") !== undefined ? JSON.parse(sessionStorage.getItem("OrderDetail")) : this.props.single_Order_list.content;
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
                    //var _productList = [];
                    var productData = null;
                    getAllProducts().then((rows) => {
                        //_productList.push(rows)
                        productData = rows.find(prdID => prdID.WPID == item.product_id && (item.bundled_parent_key == '' || item.bundled_parent_key == null));
                    })

                    // _productList = productList && productList.length > 0 ? productList : this.state.productList;
                    //productData = _productList.find(prdID => prdID.WPID == item.product_id && (item.bundled_parent_key == '' || item.bundled_parent_key == null));
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
                window.location = '/checkout';

            }
            clientJSON =
            {
                command: RequestData.command,
                method: RequestData.method,
                version: "2.0",
                status: 200,
            };
        }, 2000);

        //var wc_order_no= RequestData.wc_order_no;

    }
    else if (RequestData.method == "post" && RequestData.tempOrderId) {

        var tempOrdrId = RequestData.tempOrderId;


        const { Email } = ActiveUser.key;

        const myInterval = setInterval(() => {

            var TempOrders = localStorage.getItem(`TempOrders_${Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${Email}`)) : []; if (TempOrders && TempOrders.length > 0) {
                var filteredOrder = null;
                if (TempOrders && TempOrders.length > 0) {
                    filteredOrder = TempOrders && TempOrders.filter(tOrder => tOrder.TempOrderID == tempOrdrId)
                }
                var _orderID = tempOrdrId;
                if (filteredOrder && filteredOrder.length > 0 && filteredOrder[0].OrderID !== 0) {
                    _orderID = filteredOrder[0].OrderID;

                    clientJSON =
                    {
                        oliverpos:
                        {
                            command: RequestData.command,
                            method: RequestData.method,
                            version: "2.0",
                            status: 200,
                        },
                        data:
                        {
                            oliver_order_id: RequestData.tempOrderId,
                            wc_order_no: _orderID,
                        }
                    };
                    postmessage(clientJSON);
                    clearInterval(myInterval);
                    setTimeout(() => {
                        //history.push('/shopview');
                    }, 3000);
                }
                else {
                    // checkOrderStatus(tempOrdrId);
                }
            }
        }, 300);
    }
    else if (RequestData.method == "post") {
        return 'do_app_orderPark'
    }
    postmessage(clientJSON);
}

export const doCustomFee = (RequestData) => {
    var validationResponse = validateRequest(RequestData)
    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
        return postmessage(clientJSON)
    }
    var clientJSON = {};
    if (RequestData.method == "get") {
        var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
        var customFes = [];
        if (cartlist.length > 0) {
            cartlist.map(item => {
                if (item && !item.hasOwnProperty("product_id") && item.Price) {// amount=lowest denomination (e.g. 200 = $2.00)
                    customFes.push({ name: item.Title, amount: item.Price * 100, is_taxable: item.TaxStatus == "taxable" ? true : false });
                }
            });
            if (RequestData.hasOwnProperty('name') && RequestData.name != "") {
                customFes = customFes.filter(item => (item.name == RequestData.name));
            }
        }
        clientJSON =
        {
            command: RequestData.command,
            method: RequestData.method,
            version: "2.0",
            status: 200,
            data:
            {
                fees: customFes
            }
        };
        postmessage(clientJSON);
    }
    else if (RequestData.method == "post" || RequestData.method == "put") {
        clientJSON =
        {
            command: RequestData.command,
            method: RequestData.method,
            version: "2.0",
            status: 200,
        };
        let amount = RequestData.data.amount ? RequestData.data.amount / 100 : null;
        let add_title = RequestData.data.name;
        let isfeeTaxable = RequestData.data.is_taxable;
        var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
        cartlist = cartlist == null ? [] : cartlist;
        var new_title = add_title !== '' ? add_title : LocalizedLanguage.customFee;
        var title = new_title;
        var new_array = [];
        var isCustomFeeFound = false;
        if (cartlist.length > 0) {
            cartlist.map(item => {

                if (item && RequestData.method == "put" && (typeof item.product_id == 'undefined' || item.product_id == null)) {
                    if (item.Title == add_title) {
                        isCustomFeeFound = true;
                        if (typeof isfeeTaxable == 'undefined') {
                            isfeeTaxable = item.isTaxable;  //set istaxable if RequestData.data.is_taxable not passed
                        }
                        if (!amount) {
                            amount = item.Price; //set amount if RequestData.data.amount not passed
                        }

                        item.Price = parseFloat(amount);
                        item.old_price = isfeeTaxable == true && parseFloat(amount);
                        item.isTaxable = isfeeTaxable;
                        item.TaxStatus = isfeeTaxable == true ? "taxable" : "none";
                    }
                }

                if (item && typeof item.product_id == 'undefined') {
                    if (item.Price !== null) {
                        new_array.push(item)
                    }
                }
            })

            if (isCustomFeeFound == false && RequestData.method == "put") {
                clientJSON['status'] = 206;
                clientJSON['error'] = "No matching fee found";
                postmessage(clientJSON);
                return;
            }
            if (RequestData.method == "post" && new_array.length > 0) {
                var withNoDigits = new_array.map(item => {
                    var remveNum = item.Title.replace(/[0-9]/g, '')
                    return remveNum;
                });
                var isDuplicate = false;  //Check for duplicate name
                withNoDigits.length > 0 && withNoDigits.map((item, index) => {
                    if (item == title) {
                        isDuplicate = true;
                    }
                })
                if (isDuplicate == true) {
                    clientJSON['status'] = 209;
                    clientJSON['error'] = "fee name already exist";
                    postmessage(clientJSON);
                    return;
                }
            }
        }

        if (amount != 0) {
            var data = {
                Title: new_title,
                Price: parseFloat(amount),
                old_price: isfeeTaxable == true && parseFloat(amount),
                isTaxable: isfeeTaxable,
                TaxStatus: isfeeTaxable == true ? "taxable" : "none",
                TaxClass: '',
                quantity: 1
            }
            if (RequestData.method != "put") {
                cartlist.push(data)
            }
            cartlist && cartlist.map(itm => {
                if ((!itm.TaxStatus) || itm.TaxStatus == "none") {
                    itm.incl_tax = 0;
                    itm.excl_tax = 0;
                }
            });

            setTimeout(() => {
                //store.dispatch(cartProductActions.addtoCartProduct(cartlist));
                addCartProductAction(cartlist)
                var _cartDiscountAmount = 0.00;
                var _total = 0.0;
                var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
                let _subTotalPrice = cartlist.map(o => o.Price).reduce((a, c) => { return a + c });
                var _tax = 0.00;
                var _exclTax = 0.00;
                cartlist.map(itm => {
                    _tax += itm.incl_tax + itm.excl_tax;
                    _exclTax += itm.excl_tax;
                });
                _cartDiscountAmount += list.discountCalculated;

                _total = parseFloat(_subTotalPrice) + parseFloat(_exclTax) - parseFloat(_cartDiscountAmount)

                if (list != null) {
                    //  var subTotal = parseFloat(list.subTotal + data.Price).toFixed(2);
                    //var tax= parseFloat(list.tax +  data.Price).toFixed(2);
                    const CheckoutList = {
                        ListItem: cartlist,
                        customerDetail: list.customerDetail,
                        totalPrice: _total,
                        discountCalculated: list.discountCalculated,
                        // tax: list.tax,
                        tax: _tax,
                        subTotal: _subTotalPrice,
                        TaxId: list.TaxId,
                        order_id: list.order_id !== 0 ? list.order_id : 0,
                        showTaxStaus: list.showTaxStaus,
                        _wc_points_redeemed: list._wc_points_redeemed,
                        _wc_amount_redeemed: list._wc_amount_redeemed,
                        _wc_points_logged_redemption: list._wc_points_logged_redemption,

                    }
                    localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList))
                    // store.dispatch(checkoutActions.getAll(CheckoutList));


                }
            }, 300);

        }

        if (RequestData.method == "put") {
            clientJSON["data"] = {
                name: add_title,
                amount: amount
            }
        }
        postmessage(clientJSON);
    }


    else if (RequestData.method == "delete") {
        var name = '';
        var amount = 0;
        var is_taxable = false;
        var cartlist_fee = [];
        var error = "";
        var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];//
        var i = 0;
        var index = null;
        if (RequestData.hasOwnProperty('name') && RequestData.name != "") {
            for (i = 0; i < cartlist.length; i++) {
                if (cartlist[i].Title == RequestData.name && cartlist[i].Price && cartlist[i].Price != 0) {
                    index = i;
                    name = cartlist[i].Title;
                    amount = cartlist[i].Price;
                    is_taxable = cartlist[i].TaxStatus == "taxable" ? true : false
                }
            }
            if (index != null) {
                cartlist.splice(index, 1);
            } else {  //No item found for given name
                error = "Not found"
            }
        }
        else {
            var _cartDiscountAmount = 0.00;
            var _total = 0.0;
            cartlist_fee = cartlist.filter(item => !item.hasOwnProperty("product_id") && item.Price)
            cartlist = cartlist.filter((el) => !cartlist_fee.includes(el));
            let _subTotalPrice = cartlist.map(o => o.Price).reduce((a, c) => { return a + c });
            var _tax = 0.00;
            cartlist.map(itm => {
                _tax += itm.incl_tax + itm.excl_tax;
            });
            var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : cartlist;
            _cartDiscountAmount += list.discountCalculated ? list.discountCalculated : 0;
            _total = parseFloat(_subTotalPrice) - parseFloat(_cartDiscountAmount)
            if (list != null) {
                // var subTotal = parseFloat(list.subTotal + data.Price).toFixed(2);
                //var tax= parseFloat(list.tax +  data.Price).toFixed(2);
                const CheckoutList = {
                    ListItem: cartlist,
                    customerDetail: list.customerDetail,
                    totalPrice: _total,
                    discountCalculated: list.discountCalculated,
                    // tax: list.tax,
                    tax: _tax,
                    subTotal: _subTotalPrice,
                    TaxId: list.TaxId,
                    order_id: list.order_id !== 0 ? list.order_id : 0,
                    showTaxStaus: list.showTaxStaus,
                    _wc_points_redeemed: list._wc_points_redeemed,
                    _wc_amount_redeemed: list._wc_amount_redeemed,
                    _wc_points_logged_redemption: list._wc_points_logged_redemption,
                }
                localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList))
                //store.dispatch(cartProductActions.addtoCartProduct(cartlist));
                addCartProductAction(cartlist)
            }
        }

        // cartlist_fee =  cartlist.filter(item => !item.hasOwnProperty("product_id") && item.Price)
        // cartlist = cartlist.filter( ( el ) => !cartlist_fee.includes( el ) );
        let _subTotalPrice = cartlist.map(o => o.Price).reduce((a, c) => { return a + c });
        var _tax = 0.00;
        cartlist.map(itm => {
            _tax += itm.incl_tax + itm.excl_tax;
        });
        var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : cartlist;
        _cartDiscountAmount = list && list !== null && list.discountCalculated ? list.discountCalculated : 0;
        _total = parseFloat(_subTotalPrice) - parseFloat(_cartDiscountAmount)
        if (list != null) {
            const CheckoutList = {
                ListItem: cartlist,
                customerDetail: list.customerDetail,
                totalPrice: _total,
                discountCalculated: list.discountCalculated,
                // tax: list.tax,
                tax: _tax,
                subTotal: _subTotalPrice,
                TaxId: list.TaxId,
                order_id: list.order_id !== 0 ? list.order_id : 0,
                showTaxStaus: list.showTaxStaus,
                _wc_points_redeemed: list._wc_points_redeemed,
                _wc_amount_redeemed: list._wc_amount_redeemed,
                _wc_points_logged_redemption: list._wc_points_logged_redemption,
            }
            localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList))
        }
        localStorage.setItem("CARD_PRODUCT_LIST", JSON.stringify(cartlist));
        //store.dispatch(cartProductActions.addtoCartProduct(cartlist));
        addCartProductAction(cartlist)
        clientJSON =
        {
            command: RequestData.command,
            method: RequestData.method,
            version: "2.0",
            status: 200,
            data:
            {
                name: name,
                amount: amount,
                is_taxable: is_taxable
            }
        };
        if (cartlist_fee && cartlist_fee.length > 0) {
            var deleted_fees = [];
            cartlist_fee.map(itm => {
                deleted_fees.push({ name: itm.Title, amount: itm.Price, is_taxable: itm.TaxStatus == "taxable" ? true : false })
            });
            clientJSON["data"] = deleted_fees;
        }
        if (error !== "") {
            clientJSON['status'] = 204;
            clientJSON['data'] = "";
            clientJSON['error'] = error;
        }


        postmessage(clientJSON);
    }
}

export const getReceiptData = (RequestData, whereToview) => {
    var validationResponse = validateRequest(RequestData)
    // if (validationResponse.isValidationSuccess == false) {
    //     clientJSON = validationResponse.clientJSON;
    //     return postmessage(clientJSON)
    // }
    // if (whereToview == 'ActivityView') {
    //     var clientJSON =
    //     {
    //         oliverpos:
    //         {
    //             command: RequestData.command,
    //             method: RequestData.method,
    //             version: "2.0",
    //             status: 200,
    //         },
    //         data:
    //         {
    //             logo_img: RequestData.data.logo_img,
    //             logo_text: RequestData.data.logo_text,
    //             print_slip_size: RequestData.data.print_slip_size,
    //             rows: RequestData.data.data
    //         }
    //     };
    //     postmessage(clientJSON);


    // } else {
    //     var type = 'completecheckout';
    //     var address;
    //     var site_name;
    //     var register_id = localStorage.getItem('register')
    //     var location_name = localStorage.getItem('UserLocations') && JSON.parse(localStorage.getItem('UserLocations'));
    //     var tempOrderId = localStorage.getItem('tempOrder_Id') ? JSON.parse(localStorage.getItem('tempOrder_Id')) : ''
    //     var siteName = localStorage.getItem('clientDetail') && JSON.parse(localStorage.getItem('clientDetail'));

    //     var udid = get_UDid('UDID');
    //     var AllProductList = []
    //     var idbKeyval = FetchIndexDB.fetchIndexDb();
    //     idbKeyval.get('ProductList').then(val => {
    //         if (!val || val.length == 0 || val == null || val == "") {
    //         } else { AllProductList = val; }
    //     });

    //     if (siteName && siteName.subscription_detail && siteName.subscription_detail !== "") {
    //         if (siteName.subscription_detail.udid == udid) {
    //             site_name = siteName.subscription_detail.host_name && siteName.subscription_detail.host_name
    //         }
    //     }

    //     location_name && location_name.map(item => {
    //         if (item.Id == register_id) {
    //             address = item;
    //         }
    //     })
    //     var order_reciept = localStorage.getItem('orderreciept') && localStorage.getItem('orderreciept') !== 'undefined' ? JSON.parse(localStorage.getItem('orderreciept')) : "";
    //     var productxList = localStorage.getItem('PRODUCTX_DATA') ? JSON.parse(localStorage.getItem('PRODUCTX_DATA')) : "";
    //     var TotalTaxByName = (order_reciept && order_reciept.ShowCombinedTax == false) ? getTotalTaxByName(type, productxList) : "";
    //     var checkList = localStorage.getItem('PrintCHECKLIST') ? JSON.parse(localStorage.getItem('PrintCHECKLIST')) : ""; // localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : "";
    //     var orderList = localStorage.getItem('oliver_order_payments') ? JSON.parse(localStorage.getItem('oliver_order_payments')) : "";
    //     var orderMeta = localStorage.getItem("GTM_ORDER") && localStorage.getItem("GTM_ORDER") !== undefined ? JSON.parse(localStorage.getItem("GTM_ORDER")) : null;
    //     var cash_rounding_total = '';
    //     if (orderMeta !== null && orderMeta.order_meta !== null && orderMeta.order_meta !== undefined) {
    //         cash_rounding_total = orderMeta.order_meta[0].cash_rounding && orderMeta.order_meta[0].cash_rounding !== null && orderMeta.order_meta[0].cash_rounding !== undefined && orderMeta.order_meta[0].cash_rounding !== 0 ? orderMeta.order_meta[0].cash_rounding : '';
    //     }
    //     var findTicketInfo = "";
    //     if (checkList && checkList != "") {
    //         findTicketInfo = checkList.ListItem.find(findTicketInfo => (findTicketInfo.ticket_info && findTicketInfo.ticket_info.length > 0))
    //     }

    //     var printData = {};
    //     if (tempOrderId) {
    //         var getPdfdateTime = ''; var isTotalRefund = ''; var cash_rounding_amount = '';
    //         if (ActiveUser.key.isSelfcheckout == true) {
    //             printData = PrintPage.PrintElem(checkList, getPdfdateTime = '', isTotalRefund = '', cash_rounding_amount = cash_rounding_total, textToBase64Barcode(tempOrderId), orderList, type, productxList, AllProductList, TotalTaxByName, 0, null, false)
    //         }
    //         else {
    //             printData = PrintPage.PrintElem(checkList, getPdfdateTime = '', isTotalRefund = '', cash_rounding_amount = cash_rounding_total, textToBase64Barcode(tempOrderId), orderList, type, productxList, AllProductList, TotalTaxByName, 0, null, false)
    //         }

    //     }
    //     var DataToSend = printData.data;
    //     //DataToSend.push({"rn": 0,"cms":1,"c1": "d_img","c2": Config.key.RECIEPT_IMAGE_DOMAIN +printData.logo_img,"c3":"","bold":"0,0,0","fs":"24","alg":"1"} )  

    //     var clientJSON =
    //     {
    //         oliverpos:
    //         {
    //             command: RequestData.command,
    //             method: RequestData.method,
    //             version: "2.0",
    //             status: 200,
    //         },
    //         data:
    //         {
    //             logo_img: printData.logo_img,
    //             logo_text: printData.logo_text,
    //             print_slip_size: printData.print_slip_size,
    //             rows: DataToSend //printData.data
    //         }
    //     };
    //     postmessage(clientJSON);

    // }

}
export const getOrderStatus = (RequestData, whereToview) => {
    var validationResponse = validateRequest(RequestData)
    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
        postmessage(clientJSON)
    }
    else {
        var tempOrdrId = localStorage.getItem('tempOrder_Id') && localStorage.getItem('tempOrder_Id') !== undefined ? JSON.parse(localStorage.getItem("tempOrder_Id")) : null;
        var clientJSON = {};

        const { Email } = ActiveUser.key;
        var TempOrders = localStorage.getItem(`TempOrders_${Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${Email}`)) : []; if (TempOrders && TempOrders.length > 0) {
            var filteredOrder = null;
            if (TempOrders && TempOrders.length > 0) {
                filteredOrder = TempOrders && TempOrders.filter(tOrder => tOrder.TempOrderID == tempOrdrId)
            }
        }
        if (RequestData.method == 'get') {
            clientJSON = {
                command: RequestData.command,
                version: "2.0",
                method: RequestData.method,
                status: 200,
            }

            if (filteredOrder && filteredOrder.length > 0 && whereToview !== 'ActivityView' && whereToview !== 'RefundView') {
                filteredOrder && filteredOrder.map(order => {
                    clientJSON['data'] = {
                        wc_status: order.order_status_DB ? order.order_status_DB : order.order_status,
                        wc_order_no: order.OrderID,
                        oliver_order_id: order.TempOrderID

                    }
                })

            } else if (whereToview == 'RefundView' && localStorage.getItem('getorder')) {
                var _order = JSON.parse(localStorage.getItem('getorder'));
                clientJSON['data'] = {
                    wc_status: _order && _order.order_status,
                    wc_order_no: _order && _order.order_id,
                    oliver_order_id: _order && _order.OliverReciptId

                }
            }
            else {
                const state = store.getState();
                if (state.single_Order_list && state.single_Order_list.items && state.single_Order_list.items.content) {
                    var _order = state.single_Order_list.items.content
                    if (_order) {
                        clientJSON['data'] = {
                            wc_status: _order.order_status,
                            wc_order_no: _order.order_id,
                            oliver_order_id: _order.OliverReciptId
                        }
                    }


                }
            }
        }
        else {
            //clientJSON['error'] == "no transaction found"
        }

        postmessage(clientJSON);
    }
}
export const percentage = (num, per) => {
    return (parseFloat(num) / 100) * parseFloat(per);
}
export const addDiscountCoupon = (RequestData, isbackgroudApp, whereToview) => {
    if (whereToview !== 'CheckoutView') {
        return;
    }
    var clientJSON = ""
    var validationResponse = validateRequest(RequestData)

    if (validationResponse.isValidationSuccess == false) {
        clientJSON = validationResponse.clientJSON;
        return postmessage(clientJSON)
    }
    if (RequestData.method == 'get') {

        clientJSON = {
            command: RequestData.command,
            version: "1.0",
            method: RequestData.method,
            status_code: 200,
            error: null
        }
        const CartDiscountAmount = localStorage.getItem("CART") ? JSON.parse(localStorage.getItem("CART")) : '';

        if (CartDiscountAmount && CartDiscountAmount !== "") {
            clientJSON['discount_name'] = "";
            clientJSON['amount'] = CartDiscountAmount.discount_amount;
            if (CartDiscountAmount.discountType.toLowerCase() == "number" || CartDiscountAmount.discountType.toLowerCase() == "$") {
                clientJSON['amount_type'] = "$";
            } else if (CartDiscountAmount.discountType.toLowerCase() == "percentage" || CartDiscountAmount.discountType.toLowerCase() == "%") {
                clientJSON['amount_type'] = "%";
            }

        } else {
            clientJSON['status_code'] = 406
            clientJSON['error'] = 'No discount applied'
        }
        postmessage(clientJSON)
    }
    else {

        ///check duplicate -------------
        var isCouponFound = null
        if (RequestData && RequestData.data && localStorage.getItem("couponApplied")) {
            var localCouponApplied = JSON.parse(localStorage.getItem("couponApplied"));

            if (RequestData && RequestData.data) {
                isCouponFound = localCouponApplied.find(coupon => { return coupon.coupon_code == RequestData.data.coupon_code })
            }


            // })
            if (isCouponFound) {
                // alert("Coupon '" + isCouponFound.discount_name + "' already exist!")
                return "app-coupon_duplicate";
            }
        }
        // //---------------------------------------

        var requestDiscountAmount = 0
        var discount_type = ""
        if (RequestData && RequestData.data) {// && RequestData.data.length > 0 && RequestData.data.map(request => { //for multiple discount

            discount_type = RequestData.data.amount_type && RequestData.data.amount_type == '%' ? 'Percentage' : RequestData.data.amount_type == '$' ? 'Number' : 'Number';

            requestDiscountAmount += RequestData.data && RequestData.data.amount ? parseFloat(RequestData.data.amount) : 0;
        }
        // });


        try {
            var checkList = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
            const cartproductlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
            const CartDiscountAmount = localStorage.getItem("CART") ? JSON.parse(localStorage.getItem("CART")) : '';
            var subTotal = checkList && checkList.subTotal;
            var previousCartDiscount = 0;
            var product_after_discount = 0;
            var totalPrice = 0;
            var discount_amount = 0;
            var status = false;
            // var discount_type = RequestData && RequestData.amount_type && RequestData.amount_type == '%' ? 'percent' : RequestData.amount_type == '$' ? 'number' : 'number';
            cartproductlist && cartproductlist.map((item, index) => {
                product_after_discount += parseFloat(item.product_discount_amount);
                if (item.product_id) {//donothing
                    totalPrice += item.Price
                }
            })

            if (CartDiscountAmount) {
                if (CartDiscountAmount.discountType.toLowerCase() == "number" && discount_type == "percent") {
                    previousCartDiscount = percentage(CartDiscountAmount.discount_amount, totalPrice - product_after_discount)
                } else if (CartDiscountAmount.discountType.toLowerCase() == "percentage" && discount_type == "number") {
                    previousCartDiscount = number(CartDiscountAmount.discount_amount, subTotal - product_after_discount)
                } else if (CartDiscountAmount.discountType.toLowerCase() == "number" && discount_type == "number") {
                    previousCartDiscount = CartDiscountAmount.discount_amount;
                } else {
                    previousCartDiscount = CartDiscountAmount.discount_amount;
                }
            }
            discount_amount = requestDiscountAmount + parseFloat(previousCartDiscount);
            if (discount_type == "percent") {
                if (discount_amount > 100) {
                    status = true
                    setTimeout(function () {
                        //showModal('no_discount');
                    }, 100)
                }
            }
            if (discount_type == "number") {
                if (discount_amount > totalPrice) {
                    status = true
                    setTimeout(function () {
                        //showModal('no_discount');
                    }, 100)
                }
            }

            if (status == false) {
                var cart = {
                    type: 'card',
                    discountType: discount_type,//RequestData && RequestData.amount_type ? RequestData.amount_type == "%" ? "Percentage" : "Number" : "Number",
                    discount_amount: discount_amount,// parseFloat(RequestData.amount) + parseFloat(previousCartDiscount),
                    Tax_rate: 0
                }

                localStorage.setItem("CART", JSON.stringify(cart))
                //store.dispatch(cartProductActions.addtoCartProduct(cartproductlist));
                setTimeout(() => {
                    var _price = 0;
                    var _tax = 0;
                    var _discount = 0;
                    var _incltax = 0;
                    var _excltax = 0;
                    var cartproductlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
                    checkList.ListItem = cartproductlist;
                    checkList.ListItem.map(items => {
                        if (items.Price) {
                            _price += parseFloat(items.Price);
                            _tax += parseFloat(items.excl_tax) + parseFloat(items.incl_tax);
                            _discount += parseFloat(items.discount_amount);
                            _incltax += parseFloat(items.incl_tax);
                            _excltax += parseFloat(items.excl_tax)
                        }
                    })

                    const CheckoutList = {
                        ListItem: checkList.ListItem,
                        customerDetail: checkList.customerDetail,
                        totalPrice: (_price + _excltax) - _discount,
                        discountCalculated: _discount,
                        tax: _tax,
                        subTotal: _price - _discount,
                        TaxId: checkList.TaxId,
                        order_id: checkList.order_id !== 0 ? checkList.order_id : 0,
                        showTaxStaus: checkList.showTaxStaus,
                        _wc_points_redeemed: checkList._wc_points_redeemed,
                        _wc_amount_redeemed: checkList._wc_amount_redeemed,
                        _wc_points_logged_redemption: checkList._wc_points_logged_redemption
                    }
                    localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));
                    //store.dispatch(checkoutActions.getAll(CheckoutList));
                    clientJSON = {
                        command: RequestData.command,
                        version: "1.0",
                        method: RequestData.method,
                        status_code: 200,
                        error: null
                    }
                    if (RequestData.data) {
                        var coupons = []
                        if (localStorage.getItem("couponApplied"))
                            var coupons = JSON.parse(localStorage.getItem("couponApplied"))
                        if (RequestData.data) {
                            coupons.push(RequestData.data)
                        }
                        localStorage.setItem("couponApplied", JSON.stringify(coupons))
                    }
                    // if (RequestData.coupondetail) {
                    //   localStorage.setItem("couponDetail", JSON.stringify(RequestData.coupondetail))
                    // }
                    postmessage(clientJSON)

                }, 500);

                return "app-coupon_discount"


            }
        } catch (error) {
            console.error('App Error : ', error);
        }

    }

}
export const number = (num, per) => {
    return parseFloat(num) * 100 / parseFloat(per);
}


const validateRequest = (RequestData) => {

    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    var urlReg = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;

    var isValidationSuccess = true;
    var clientJSON = {
        command: RequestData.command,
        version: RequestData.version,
        method: RequestData.method,
        status: 406,
    }
    if (RequestData.command.toLowerCase() == ('CartValue').toLowerCase()) { //|| RequestData.command=='Receipt'
        if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        }
        if (RequestData && RequestData.method && RequestData.method == 'put') {
            if (RequestData.data && RequestData.data.discount && RequestData.data.tender_amt) {
                if (typeof RequestData.data.discount == 'string' || typeof RequestData.data.tender_amt == 'string') {
                    isValidationSuccess = false;
                    clientJSON['error'] = "Invalid Value" //GR[4]  
                }
            } else {
                isValidationSuccess = false;
                clientJSON['error'] = "Invalid Attribute"
            }
        }
    }
    else if (RequestData.command.toLowerCase() == ('Cart').toLowerCase()) { //|| RequestData.command=='Receipt'
        if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        }
        else if (RequestData && (RequestData.method || !RequestData.method == 'post')) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        } else if (RequestData && !RequestData.url) {
            isValidationSuccess = false;
            clientJSON['error'] = "Missing Attribute(s)" //GR[3]

        } else if (RequestData && !urlReg.test(RequestData.url)) {
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Value" //GR[5]  
        }
    } else if (RequestData.command.toLowerCase() == ('cartDiscount').toLowerCase()) {
        if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        }
        else if (RequestData && (RequestData.method && RequestData.method == 'get')) {
            //NOTHING
        } else {
            if (RequestData && (RequestData.method && !RequestData.method == 'post')) { //missing attribut/invalid attribute name
                isValidationSuccess = false;
                clientJSON['error'] = "Invalid Attribute"
            }
            else if (RequestData && (RequestData.method && (!RequestData.amount_type || !RequestData.amount))) { //missing attribut/invalid attribute name
                isValidationSuccess = false;
                clientJSON['error'] = "Missing Attribute(s)"  //GR[3]          
            }
            else if (RequestData && (RequestData.method && (RequestData.amount_type == null || RequestData.amount == null))) { //missing attribut/invalid attribute name
                isValidationSuccess = false;
                clientJSON['error'] = "Invalid Value"  //GR[5]          
            }
            else if (RequestData && (RequestData.method && isNaN(RequestData.amount))) { //missing attribut/invalid attribute name
                isValidationSuccess = false;
                clientJSON['error'] = "Invalid Data Type"  //GR[4]          
            }
        }


    }
    else if (RequestData.command.toLowerCase() == ('cartTaxes').toLowerCase()) {
        if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        }
        if (RequestData && (RequestData.method && !RequestData.method == 'get' && !RequestData.method == 'post')) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        }
        if (RequestData && (RequestData.method && RequestData.method == 'get')) {
            // no data for validation
        }
        else if (RequestData && (RequestData.method && RequestData.method == 'post')) {
            if (RequestData && (RequestData.method && (!RequestData.data || !RequestData.data.name || !RequestData.data.rate))) { //missing attribut/invalid attribute name
                isValidationSuccess = false;
                clientJSON['error'] = "Missing Attribute(s)"  //GR[3]          
            }
            else if (RequestData && (RequestData.method && (RequestData.data.name == null || RequestData.data.rate == null))) { //missing attribut/invalid attribute name
                isValidationSuccess = false;
                clientJSON['error'] = "Invalid Value"  //GR[5]          
            }
            else if (RequestData && (RequestData.method && isNaN(RequestData.data.rate))) { //missing attribut/invalid attribute name
                isValidationSuccess = false;
                clientJSON['error'] = "Invalid Data Type"  //GR[4]          
            }
            else if (RequestData && parseInt(RequestData.data.rate) >= 100) {
                isValidationSuccess = false;
                clientJSON['error'] = "Invalid Value-amount must be < 100 %"  //GR[5]          
            }
        }
    } else if (RequestData.command.toLowerCase() == ('addProductToCart').toLowerCase()) {
        if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        }
        else if (RequestData && (RequestData.method && !RequestData.method == 'post')) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        }
        else if (RequestData && (RequestData.method && (!RequestData.product_id || !RequestData.product_name || !RequestData.quantity || !RequestData.total_price))) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Missing Attribute(s)"  //GR[3]          
        }
        else if (RequestData && (RequestData.method && (RequestData.product_id == null || RequestData.total_price == null || RequestData.quantity == null))) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Value"  //GR[5]          
        }
        else if (RequestData && (RequestData.method && isNaN(RequestData.total_price))) {
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Data Type"  //GR[4]          
        }

    }
    else if (RequestData.command.toLowerCase() == ('productPriceUpdate').toLowerCase()) {
        if (RequestData && (!RequestData.method || !RequestData.method == 'post')) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        }
    }
    else if (RequestData.command.toLowerCase() == ('Notes').toLowerCase()) {
        if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        }
        else if (RequestData.method == 'put' || RequestData.method == 'post') {
            if (RequestData && RequestData && (RequestData.contents == null || RequestData.contents == '')) {

                isValidationSuccess = false;
                clientJSON['error'] = "Missing attribute" //GR[3] 
            }
            if (RequestData.method == 'put' && (!RequestData.note_id || RequestData.note_id == "" || RequestData.note_id == null)) {

                isValidationSuccess = false;
                clientJSON['error'] = "Missing attribute" //GR[3] 
            }
            //  else if (RequestData && RequestData && (RequestData.description == null || RequestData.description == '')) {

            //   isValidationSuccess = false;
            //   clientJSON['error'] = "Missing attribute" //GR[3] 
            // }
        }
        else if (RequestData && RequestData.method == 'delete' && (!RequestData.note_id || RequestData.note_id == "" || RequestData.note_id == null)) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Missing attribute"
        }
        else {
            if (RequestData && (!RequestData.method || !RequestData.method == 'get')) { //missing attribut/invalid attribute name
                isValidationSuccess = false;
                clientJSON['error'] = "Invalid Method"
            }
            else if (RequestData && RequestData && (RequestData.command == null || RequestData.command == '')) { // missing commond and invalid
                isValidationSuccess = false;
                clientJSON['error'] = "Invalid Command" //GR[4]
            }
        }
    } else if (RequestData.command.toLowerCase() == ('OrderStatus').toLowerCase()) {
        //missing attributes
        if (RequestData && (!RequestData.command || !RequestData.method || RequestData.method != 'get')) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        }
        else if (RequestData && (RequestData.method == 'get')) { // main attributes for customer update/delete 
            if (RequestData.method == "") {
                isValidationSuccess = false;
                clientJSON['error'] = "Missing Attribute(s)" //GR[3]
            }

        }
    }
    else if (RequestData.command.toLowerCase() == ('ParkSale').toLowerCase()) {
        //missing attributes
        if (RequestData && (!RequestData.command || !RequestData.method)) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        }

        else if (RequestData && (RequestData.method == 'get')) { // main attributes for customer update/delete 
            if (RequestData.method == "" || !RequestData.wc_order_no || RequestData.wc_order_no == null || RequestData.wc_order_no == "") {
                isValidationSuccess = false;
                clientJSON['error'] = "Missing Attribute(s)" //GR[3]
            }
        }

    }
    else if (RequestData.command.toLowerCase() == ('CustomFee').toLowerCase()) {
        if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Attribute"
        }
        else if (RequestData.method == 'put' || RequestData.method == 'post') {
            if (RequestData && RequestData && (!RequestData.data || RequestData.data == null || RequestData.data == '')) {

                isValidationSuccess = false;
                clientJSON['error'] = "Missing attribute" //GR[3] 
            }
            else if (RequestData && RequestData && (RequestData.data.name == "" || RequestData.data.amount == '' || RequestData.data.amount == '0' || RequestData.data.is_taxable === "")) {

                isValidationSuccess = false;
                clientJSON['error'] = "Missing attribute" //GR[3] 
            }
            else if (RequestData && RequestData && RequestData.method == 'post' &&
                (!RequestData.data.name || !RequestData.data.amount || !RequestData.data.hasOwnProperty("is_taxable"))) {
                isValidationSuccess = false;
                clientJSON['error'] = "Missing attribute" //GR[3] 
            } else if (RequestData && RequestData && RequestData.method == 'put' &&
                (!RequestData.data.name || (!RequestData.data.amount && !RequestData.data.hasOwnProperty("is_taxable")))) {
                isValidationSuccess = false;
                clientJSON['error'] = "Missing attribute" //GR[3] 
            } else if (RequestData && RequestData && RequestData.data.amount && (isNaN(RequestData.data.amount) || RequestData.data.amount < 0)) {

                isValidationSuccess = false;
                clientJSON['error'] = "Invalid attribute" //GR[3] 
            }
        }
        // else if (RequestData && RequestData.method == 'delete' /*&& (!RequestData.name || RequestData.name=="")*/) { //missing attribut/invalid attribute name
        //     isValidationSuccess = false;
        //     clientJSON['error'] = "Missing attribute"               

        // }
        else {
            if (RequestData && (!RequestData.method || !RequestData.method == 'get')) { //missing attribut/invalid attribute name
                isValidationSuccess = false;
                clientJSON['error'] = "Invalid Method"
            }

        }
    }
    else {// no command found
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Value" //GR[5]          
    }
    return { isValidationSuccess, clientJSON };
}