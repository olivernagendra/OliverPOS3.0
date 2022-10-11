import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import X_Icon_DarkBlue from '../../../assets/images/svg/X-Icon-DarkBlue.svg';
import EmptyCart from '../../../assets/images/svg/EmptyCart.svg';
import CircledX_Grey from '../../../assets/images/svg/CircledX-Grey.svg';
import { deleteProduct } from './productLogic';
import { RoundAmount } from "../../common/TaxSetting";
import { product } from "./productSlice";
import { useNavigate } from "react-router-dom";
import { checkStock } from "../../checkout/checkoutSlice";
import { typeOfTax } from "../../common/TaxSetting";
import STATUSES from "../../../constants/apiStatus";
import { LoadingModal } from "../../common/commonComponents/LoadingModal";
import { popupMessage } from "../../common/commonAPIs/messageSlice";
import { get_customerName } from "../../common/localSettings";
import LocalizedLanguage from "../../../settings/LocalizedLanguage";
import { useIndexedDB } from 'react-indexed-db';
import { NumericFormat } from 'react-number-format'
const CartList = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [subTotal, setSubTotal] = useState(0.00);
    const [taxes, setTaxes] = useState(0.00);
    const [discount, setDiscount] = useState(0.00);
    const [total, setTotal] = useState(0.00);
    const [taxRate, setTaxRate] = useState(0.00);
    const [checkoutData, setCheckoutData] = useState(0.00);
    const [updateProductStatus, setUpdateProductStatus] = useState(false)
    const [checkseatStatus, setCheckseatStatus] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [totalItems, setTotalItems] = useState(0)
    const [isShowMobileCartList, setisShowMobileCartList] = useState(false)
    const [discountType, setDiscountType] = useState('');
    const [discountCalculated,setDiscountCalculated]=useState(0);
    const [showTaxStaus,setShowTaxStaus]=useState(false);
    const { add, update, getByID, getAll, deleteRecord } = useIndexedDB("products");
    const toggleMobileCartList = () => {
        setisShowMobileCartList(!isShowMobileCartList)
    }
    useEffect(() => {
        getDiscountAmount_Type();
        calculateCart();

    }, [props.listItem]);

    const editPopUp = async (a, index) => {
        if (a && (a.Type === "variation" || a.Type === "variable")) {
            var _item = await getByID(a.product_id);
            _item["quantity"]=a.quantity;

            _item['after_discount'] = a ? a.after_discount : 0;
            _item['discount_amount'] = a ? a.discount_amount : 0;
            _item['product_after_discount'] = a ? a.product_after_discount : 0;
            _item['product_discount_amount'] = a ? a.product_discount_amount : 0;
            _item['discount_type'] = a ? a.discount_type : "";
            _item['new_product_discount_amount'] = a ? a.new_product_discount_amount : 0;
            _item['cart_after_discount'] = a.cart_after_discount?a.cart_after_discount:0;
            _item['cart_discount_amount'] = a.cart_discount_amount?a.cart_discount_amount:0;
            if (_item && _item.ParentId != 0) {
                var _parent = await getByID(_item.ParentId);

                var allCombi = _item && _item.combination !== null && _item.combination !== undefined && _item.combination.split("~");
                allCombi = allCombi.map(a => { return a.replace(/\//g, "-").toLowerCase() });

                _parent["selectedOptions"] = allCombi;
                _parent["quantity"]=a.quantity;

                _parent['after_discount'] = a ? a.after_discount : 0;
                _parent['discount_amount'] = a ? a.discount_amount : 0;
                _parent['product_after_discount'] = a ? a.product_after_discount : 0;
                _parent['product_discount_amount'] = a ? a.product_discount_amount : 0;
                _parent['discount_type'] = a ? a.discount_type : "";
                _parent['new_product_discount_amount'] = a ? a.new_product_discount_amount : 0;
                _parent['cart_after_discount'] = a.cart_after_discount?a.cart_after_discount:0;
                _parent['cart_discount_amount'] = a.cart_discount_amount?a.cart_discount_amount:0;
                props.updateVariationProduct(_item);
                props.openPopUp(_parent, index);
            }
            else {
                props.updateVariationProduct(_item);
                props.openPopUp(_item, index);
            }
        }
        else {
            props.updateVariationProduct(a);
            props.openPopUp(a,index);
        }
    }
    const getDiscountAmount_Type = () => {
        if (localStorage.getItem("CART")) {
            let cart = JSON.parse(localStorage.getItem("CART"));
            let dtype = cart.discountType === "Percentage" ? '%' : "$";
            let damount = cart.discount_amount;
            setDiscountType(damount + "" + dtype);
            
        }
        else
        {
            setDiscountType('')
        }
    }
    const deleteItem = (item) => {
        if (item) {
            deleteProduct(item);
            //deleting the product note for the product
            var products = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
            if (products.length > 0) {
                var notes = products.filter(a => a.hasOwnProperty("pid") && !a.hasOwnProperty("product_id") && (!a.hasOwnProperty("Price") || a.Price == null) && a.pid === item.product_id);
                if (notes && notes.length > 0) {
                    notes.map(n => {
                        deleteProduct(n);
                    })
                }
            }
            dispatch(product());
        }
    }
    const doCheckout = () => {
        checkout(props.listItem);
        //navigate('/checkout');
    }

    const checkout = (ListItem) => {
        // ListItem && ListItem.length > 0 && ListItem.map(litem => {
        //     if (this.props.AllProductList) {
        //         var itemFound = this.props.AllProductList.find(item => item.WPID == litem.product_id);
        //         if (itemFound) {
        //             litem["ManagingStock"] = itemFound.ManagingStock;
        //         }
        //     }
        // })
        //this.setState({ isLoading: true })
        setIsLoading(true);
        localStorage.removeItem('RESERVED_SEATS');
        localStorage.removeItem("BOOKED_SEATS");
        var setting = localStorage.getItem('TickeraSetting') && typeof (localStorage.getItem('TickeraSetting')) !== 'undefined' && localStorage.getItem('TickeraSetting') !== 'undefined' ? JSON.parse(localStorage.getItem('TickeraSetting')) : '';
        var selectedSeats = [];
        var tikeraSelectedSeats = localStorage.getItem('TIKERA_SELECTED_SEATS') ? JSON.parse(localStorage.getItem('TIKERA_SELECTED_SEATS')) : [];
        var getDistinctTicketSeat = {};
        tikeraSelectedSeats.length > 0 && tikeraSelectedSeats.map(item => {
            if (item.seat_check == "true") {
                var dateKey = item.product_id;
                if (!getDistinctTicketSeat.hasOwnProperty(dateKey)) {
                    getDistinctTicketSeat[dateKey] = new Array(item);
                } else {
                    if (typeof getDistinctTicketSeat[dateKey] !== 'undefined' && getDistinctTicketSeat[dateKey].length > 0) {
                        getDistinctTicketSeat[dateKey].push(item)
                    }
                }
            }
        })
        var productCount = 0;
        ListItem !== null && ListItem.length > 0 && ListItem.map(items => {
            if (items.product_id != null) {
                productCount += 1;
                if (getDistinctTicketSeat) {
                    var getTicketSeats = getDistinctTicketSeat[items.product_id];
                    getTicketSeats && getTicketSeats.map((Tkt, indexing) => {
                        if (Tkt.product_id == items.product_id) {
                            items.ticket_info && items.ticket_info.map((match_index, index) => {
                                if (index == indexing) {
                                    match_index['seat_label'] = Tkt.seat_label;
                                    match_index['chart_id'] = Tkt.chart_id;
                                    match_index['seat_id'] = Tkt.seat_id;
                                }
                            })
                        }
                    })
                }
            }
        })
        var discountIs = 0;
        discountIs = discountCalculated;
        var _checklist = (typeof localStorage.getItem("CHECKLIST") !== 'undefined') ? JSON.parse(localStorage.getItem("CHECKLIST")) : null;
        var taxratelist;
        var _TaxIs = [];
        var deafult_tax = localStorage.getItem('APPLY_DEFAULT_TAX') ? JSON.parse(localStorage.getItem("APPLY_DEFAULT_TAX")) : null;
        var selected_tax = localStorage.getItem('TAXT_RATE_LIST') ? JSON.parse(localStorage.getItem("TAXT_RATE_LIST")) : null;
        var apply_defult_tax = localStorage.getItem('DEFAULT_TAX_STATUS') ? localStorage.getItem('DEFAULT_TAX_STATUS').toString() : null;
        var TaxRate = apply_defult_tax == "true" ? deafult_tax : selected_tax;
        if (TaxRate && TaxRate.length > 0) {
            TaxRate.map(addTax => {
                if (addTax.check_is == true) {
                    if (apply_defult_tax == "true") {
                        _TaxIs.push({ [addTax.TaxId]: parseFloat(addTax.TaxRate) })
                    }
                    if (apply_defult_tax == "false") {
                        _TaxIs.push({ [addTax.TaxId]: parseFloat(addTax.TaxRate) })
                    }
                }
            })
        }
        // const { dispatch } = this.props;
        // const { addcust, taxRate } = this.state;
        var addcust = null
        var AdCusDetail = localStorage.getItem('AdCusDetail');
        if (AdCusDetail != null) {
            addcust = JSON.parse(AdCusDetail);
        }


        // var taxRate = [];
        const CheckoutList = {
            ListItem: ListItem,
            customerDetail: addcust,
            totalPrice: total,
            discountCalculated: discountIs ? discountIs : 0,
            tax: taxes,
            subTotal: subTotal,
            TaxId: _TaxIs,
            TaxRate: taxRate,
            _checklist: _checklist !== null ? _checklist.order_id : 0,
            oliver_pos_receipt_id: _checklist && _checklist !== null && _checklist.oliver_pos_receipt_id !== null ? _checklist.oliver_pos_receipt_id : "",
             showTaxStaus: showTaxStaus,
            //showTaxStaus: typeOfTax(),
            _wc_points_redeemed: 0,
            _wc_amount_redeemed: 0,
            _wc_points_logged_redemption: 0
        }

        if (addcust && addcust.content) {
            sessionStorage.setItem("CUSTOMER_ID", addcust.content.UID ? addcust.content.UID : addcust.content.WPId);
        } else {
            sessionStorage.removeItem("CUSTOMER_ID");
        }
        if (ListItem.length == 0 || productCount == 0) {
            // alert("Please add at least one product in cart !");
            // dispatch(popupMessage({data:{title:"",msg:"Please add at least one product in cart !"},is_success:true}));
            var data = { title: "", msg: LocalizedLanguage.messageCartNoProduct, is_success: true }
            dispatch(popupMessage(data));
            setIsLoading(false)
        } else {
            setUpdateProductStatus(true);
            var tickValiData = []
            var field = ''
            var staticField_value = ["first_name", "last_name", "owner_email"];
            var staticField = [];
            var quant = 0;
            ListItem.find(findId => {
                quant = findId.quantity;
                if (findId.ticket_status == true && (findId.ticket_info.length == 0 || quant !== findId.ticket_info.length)) {
                    staticField = staticField_value.filter(function (value, index, arr) {
                        return value == "first_name" && setting !== null && setting !== undefined && setting.show_attendee_first_and_last_name_fields == "yes" ||
                            value == "last_name" && setting !== null && setting !== undefined && setting.show_attendee_first_and_last_name_fields == "yes"
                            || value == "owner_email" && setting !== null && setting !== undefined && setting.show_owner_email_field == "yes";
                    });
                    tickValiData.push(findId.ticket_info);
                    field = findId.product_ticket ? JSON.stringify(findId.product_ticket.fields) : ''
                }

            })
            if (staticField.length == 0) {
                setCheckoutData(false);
            }
            if (tickValiData && tickValiData.length > 0) {
                var requiredDataIsNull = tickValiData.find(is_null => is_null.length == 0 || quant !== is_null.length);
                if (requiredDataIsNull) {
                    var requiredList = field && JSON.parse(field);
                    var a = requiredList ? requiredList.map(itm => {
                        var is_field = itm.field_info && JSON.parse(itm.field_info);
                        if (is_field.is_required == true || staticField !== '') {
                            setCheckoutData(true);
                        }
                    })
                        :
                        staticField !== ''
                    setCheckoutData(true);
                }
            }
            if (checkoutData == true) {
                setIsLoading(false)
                // this.setState({ isLoading: false })
                alert("Please fill the required fields of selected ticket.");
                //     if (isMobileOnly == true) {
                //         $('#common_msg_popup').addClass('show')
                //     }
                //    // $('#common_msg_popup').modal('show')
                //     showModal('common_msg_popup');
            }
            checkoutData == false && ListItem.map(findId => {
                if (findId.ticket_info && findId.ticket_info.length > 0 && findId.ticket_info !== '[]') {
                    findId.ticket_info.map(chart_Id => {
                        var chart_id = chart_Id && chart_Id.chart_id ? chart_Id.chart_id : null;
                        if (chart_id) {
                            setCheckseatStatus(true)
                            // ### this.setState({
                            //     isLoading: true,
                            //     checkseatStatus: true
                            // })
                            //### this.props.dispatch(cartProductActions.getReservedTikeraChartSeat(chart_id, 1));
                        }
                    })
                }
            })
            if (addcust && addcust.customerDetail && addcust.customerDetail.content) {
                var cust = addcust.customerDetail.content;
                sessionStorage.setItem("CUSTOMER_ID", cust.UID ? cust.UID : cust.WPId);
            }
            localStorage.setItem("CHECKLIST", JSON.stringify(CheckoutList))
            var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
            if (demoUser == 'true') {
                navigate('/checkout')
                //window.location = '/checkout'
            } else {
                checkItemList(CheckoutList);
                //dispatch(checkoutActions.checkItemList(CheckoutList))
            }
        }
    }
    const checkItemList = (checkout_list) => {
        //var list_item = checkout_list ? checkout_list.ListItem : null;   
        var list_item = checkout_list && checkout_list.ListItem ? checkout_list.ListItem.filter(item => { return (item.ManagingStock !== false) }) : null;
        if (!list_item || list_item == null || list_item.length == 0) {
            var _item = [];
            if (checkout_list && checkout_list.ListItem) {
                checkout_list.ListItem.map(item => {
                    if (item.hasOwnProperty("product_id"))
                        _item.push({ Message: "", ProductId: item.product_id, Quantity: item.quantity, Message: "", success: true, psummary: item.psummary });
                });
            }
            dispatch(checkStock(_item));
            //  dispatch(success( _item ));
            //return _item;
        } else {
            var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
            if (demoUser == false) {
                var _item = [];
                if (list_item) {
                    list_item.map(item => {
                        if (item.hasOwnProperty("product_id"))
                            _item.push(item);
                    });
                }
                dispatch(checkStock(_item));
            }
        }

    }
    const checkStockResult = (checkout_list) => {
        var msg = '';
        var cartProductList = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : null;
        var blank_quntity = []
        var new_data = [];
        checkout_list && checkout_list.map(checkfalse => {
            if (checkfalse.success === false) {
                new_data.push(checkfalse)
            }
        })

        if (cartProductList && new_data) {
            new_data.map(isExsit => {
                cartProductList.map(idExsit => {
                    if (idExsit.variation_id == 0 ? idExsit.product_id === isExsit.ProductId : idExsit.variation_id === isExsit.ProductId) {
                        blank_quntity.push(idExsit.Title)
                    }
                })
            })
        }
        if (blank_quntity.length > 0) {
            msg = 'Stock is not sufficient for below products, please remove them from cart! ';
            msg += blank_quntity.map(name => {
                return (
                    name + ", "
                )
            })
        }
        else {
            msg = "messageCartNoProduct";
        }
        //show message popup here

        var data = { title: "", msg: msg, is_success: true }
        dispatch(popupMessage(data));
        //alert(msg);
        setIsLoading(false)
    }
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
        props.listItem && props.listItem.map((item, index) => {
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

        //total count of the prodcuts in the cart
        setTotalItems(0)
        if (props.listItem && props.listItem.length > 0) {
            var qty = 0;
            props.listItem.map(item => {
                if (item && item.Price && item.Price != "" && typeof item.product_id != "undefined") {
                    qty += item.quantity;
                }
            })
            if (qty !== 0) {
                setTotalItems(qty)
            }

        }

        _seprateDiscountAmount = _subtotalPrice - _subtotalDiscount;
        _subtotal = _subtotalPrice - _productDiscountAmount;
        _totalDiscountedAmount = _subtotalDiscount;
        if (_taxRate) {
            _taxAmount = parseFloat(_exclTax) + parseFloat(_inclTax);
        }
        _total = parseFloat(_seprateDiscountAmount) + parseFloat(_exclTax);
        setSubTotal(RoundAmount(_subtotal));
        setTotal(RoundAmount(_total));
        setDiscount(_cartDiscountAmount > 0 ? RoundAmount(_cartDiscountAmount) : 0);
        setTaxes(RoundAmount(_taxAmount));
        setDiscountCalculated(_totalDiscountedAmount > 0 ? RoundAmount(_totalDiscountedAmount) : 0);
        setShowTaxStaus(typeOfTax() == 'incl' ? LocalizedLanguage.inclTax : LocalizedLanguage.exclTax);
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
    const [resCheckStock] = useSelector((state) => [state.checkStock])
    useEffect(() => {
        if (resCheckStock && resCheckStock.status == STATUSES.IDLE && resCheckStock.is_success) {
            console.log("---resCheckStock--" + JSON.stringify(resCheckStock.data));
            var checkout_list = resCheckStock.data.content;
            var IsExist = false;
            var IsExsitTicket = false;
            if (checkout_list && checkout_list.length > 0 && updateProductStatus == true) {
                var checkProductUpdate;
                IsExist = false
                checkProductUpdate = checkout_list.find(item => item.success == false);
                if (checkProductUpdate && checkProductUpdate.ProductId !== 0) {
                    IsExist = false;
                    checkStockResult(checkout_list);
                } else {
                    IsExist = true;
                }
                // if (nextProps.cartproductlist) {
                //     nextProps.cartproductlist && nextProps.cartproductlist.map(ticketInfo => {
                //         if (ticketInfo.ticket_info && ticketInfo.ticket_info.length > 0 && ticketInfo.ticket_info !== "[]") {
                //             CHECKLIST && CHECKLIST.ListItem.map(findId => {
                //                 if (findId.ticket_info && findId.ticket_info.length > 0) {
                //                     findId.ticket_info.map(chart_Id => {
                //                         var chart_id = chart_Id && chart_Id.chart_id ? chart_Id.chart_id : null;
                //                         if (chart_id) {
                //                             IsExsitTicket = true;
                //                         }
                //                     })
                //                 }
                //             })
                //         }
                //     })
                // }

                if (IsExist === true && IsExsitTicket === false && checkseatStatus == false && checkoutData == false) {
                    localStorage.removeItem("oliver_order_payments");
                    localStorage.removeItem("VOID_SALE")
                    navigate('/checkout');
                }
                setUpdateProductStatus(true);
            }
        }
    }, [resCheckStock]);


    const RemoveCustomer = () => {
        localStorage.removeItem('AdCusDetail');
        sessionStorage.removeItem("CUSTOMER_ID");
        var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
        if (list != null) {
            var _wc_amount_redeemed = list._wc_amount_redeemed ? parseFloat(list._wc_amount_redeemed) : 0
            const CheckoutList = {
                ListItem: list.ListItem,
                customerDetail: null,
                totalPrice: parseFloat(list.totalPrice) + _wc_amount_redeemed,
                discountCalculated: parseFloat(list.discountCalculated) - _wc_amount_redeemed,
                tax: list.tax,
                subTotal: list.subTotal,
                TaxId: list.TaxId,
                showTaxStaus: list.showTaxStaus,
                TaxRate: list.TaxRate,
                order_id: list.order_id,
                oliver_pos_receipt_id: list.oliver_pos_receipt_id,
                order_date: list.order_date,
                order_id: list.order_id,
                status: list.status,
                _wc_points_redeemed: 0,
                _wc_amount_redeemed: 0,
                _wc_points_logged_redemption: 0
            }
            localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList))
        }
        dispatch(product());
    }

    return (
        <React.Fragment>
            {isLoading ? <LoadingModal></LoadingModal> : null}
            <div className={isShowMobileCartList == true ? "cart open" : "cart"}>
                <div className="mobile-header">
                    <p>Cart</p>
                    <button id="exitCart" onClick={() => toggleMobileCartList()}>
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
                    {get_customerName() != null && <div className="cart-item">
                        <div className="main-row aligned">
                            <div className="tag customer">Customer</div>
                            <div className="content-style">{get_customerName().Name}</div>
                            <button className="remove-cart-item" onClick={() => RemoveCustomer()}>
                                <img src={CircledX_Grey} alt="" />
                            </button>
                        </div>
                    </div>}
                    {props && props.listItem && props.listItem.length > 0 && props.listItem.map((a, index) => {
                        
                        var notes =  props.listItem.find(b => b.hasOwnProperty('pid') && a.hasOwnProperty('product_id') && (b.pid === a.product_id /*&& b.vid === a.variation_id*/));
                        
                        var item_type = "";
                        if ((!a.hasOwnProperty('Price') || a.Price == null) && !a.hasOwnProperty('product_id')) { item_type = "no_note"; }
                        else if (a.hasOwnProperty('product_id')) { item_type = "product"; }
                        else if (a.hasOwnProperty('Price') && !a.hasOwnProperty('product_id')) { item_type = "custom_fee"; }
                        if ((!a.hasOwnProperty('Price') || a.Price == null) && !a.hasOwnProperty('product_id')&& !a.hasOwnProperty('pid')) { item_type = "note"; }

                        switch (item_type) {
                            case "product":
                                return <div className="cart-item" key={a.product_id ? a.product_id : a.Title}>
                                    <div className="main-row" >
                                        <p className="quantity" onClick={() => editPopUp(a, index)}>{a.quantity && a.quantity}</p>
                                        <p className="content-style" onClick={() => editPopUp(a, index)}>{a.Title && a.Title}</p>
                                        <p className="price" onClick={() => editPopUp(a, index)}>
                                        <NumericFormat className={a.product_discount_amount !=0?"strike-through":""} value={a.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                            </p>
                                            {a.product_discount_amount !=0 &&<p className="price" onClick={() => editPopUp(a, index)}>
                                            <NumericFormat value={a.discount_type == "Number" ? a.Price - (a.product_discount_amount):a.Price - (a.product_discount_amount * a.quantity)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                              {/* <NumericFormat   value={a.Price - a.product_discount_amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> */}
                                            </p>}
                                        <button className="remove-cart-item" onClick={() => deleteItem(a)}>
                                            <img src={CircledX_Grey} alt="" />
                                        </button>
                                    </div>
                                    <div className="secondary-col" onClick={() => editPopUp(a, index)}>
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
                                        {
                                            !a.hasOwnProperty("pid") &&
                                            <button className="remove-cart-item" onClick={() => deleteItem(a)}>
                                                <img src={CircledX_Grey} alt="" />
                                            </button>
                                        }
                                    </div>
                                </div>
                            case "custom_fee":
                                return <div className="cart-item">
                                    <div className="main-row aligned">
                                        <div className="tag custom-fee">Custom Fee</div>
                                        <div className="content-style">{a.Title && a.Title}</div>
                                        <div className="price"><NumericFormat  value={a.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></div>
                                        <button className="remove-cart-item" onClick={() => deleteItem(a)}>
                                            <img src={CircledX_Grey} alt="" />
                                        </button>
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
                                return <div className="cart-item">
                                    <div className="main-row aligned">
                                        <div className="tag group">Group</div>
                                        <p className="content-style">Table 1</p>
                                        <button className="remove-cart-item" onClick={() => deleteItem(a)}>
                                            <img src={CircledX_Grey} alt="" />
                                        </button>
                                    </div>
                                </div>
                            default:
                                return null;
                        }
                        // return <div className="cart-item" /*onClick={()=>props.editPopUp(a)}*/ key={a.product_id ? a.product_id : a.Title}>
                        //     <div className="main-row" >
                        //         <p className="quantity">{a.quantity && a.quantity}</p>
                        //         <p className="content-style">{a.Title && a.Title}</p>
                        //         <p className="price">{a.Price && a.Price}</p>
                        //         <button className="remove-cart-item" onClick={() => deleteItem(a)}>
                        //             <img src={CircledX_Grey} alt="" />
                        //         </button>
                        //     </div>
                        //     <div className="secondary-col">
                        //         {/* <p>Medium</p>
                        //     <p>Navy</p> */}
                        //     </div>
                        // </div>

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
                            <p>{LocalizedLanguage.printSubtotal}</p>
                            <p><b>${subTotal}</b></p>
                        </div>
                        {discountType !="" ?
                            <div className="row">
                                <p>Cart Discount - {discountType}</p>
                                <button id="editCartDiscount" onClick={() => props.toggleEditCartDiscount()}>edit</button>
                                <p><b>-${<NumericFormat  value={discount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</b></p>
                            </div> : null}
                        <div className="row">
                            <button id="taxesButton" onClick={() => props.toggleTaxList()}>Taxes { typeOfTax() == 'incl' ? LocalizedLanguage.inclTax : LocalizedLanguage.exclTax}</button>
                            <p>(%)</p>
                            <p><b>${<NumericFormat  value={taxes} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</b></p>
                        </div>
                    </div>
                    <div className="checkout-container">
                        <button onClick={() => doCheckout()}>{LocalizedLanguage.checkout} - ${<NumericFormat  value={total} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</button>
                    </div>
                </div>
            </div>
            <div className="mobile-homepage-footer">
                <button id="openMobileCart" onClick={() => toggleMobileCartList()}>View Cart {totalItems != 0 ? ("(" + totalItems + ")") : ""} - ${<NumericFormat  value={total} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</button>
            </div>
        </React.Fragment>)
}

export default CartList 