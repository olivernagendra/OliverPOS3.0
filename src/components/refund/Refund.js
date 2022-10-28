import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import AngledBracket_Left_Blue from '../../assets/images/svg/AngledBracket-Left-Blue.svg';
import Stripe_Icon from '../../assets/images/svg/Stripe Icon.svg';
import EmptyCart from '../../assets/images/svg/EmptyCart.svg'
import person from '../../assets/images/svg/person.svg'
import { get_customerName, get_UDid, get_userName } from '../common/localSettings';
import paymentsType from '../../settings/PaymentsType'
import STATUSES from "../../constants/apiStatus";
import { useNavigate } from 'react-router-dom';
import LeftNavBar from "../common/commonComponents/LeftNavBar";
import Header from "../checkout/Header";
import RefundCartListBody from "./RefundCartListBody";
import { popupMessage } from "../common/commonAPIs/messageSlice";
import { NumericFormat } from 'react-number-format';
import LocalizedLanguage from "../../settings/LocalizedLanguage";
import NumberPad from "../common/commonComponents/NumberPad";
import { GetRoundCash } from "../../settings/CheckoutFunction";
import PartialPayment from "../checkout/PartialPayment";
import ActiveUser from '../../settings/ActiveUser';
import ManualPayment from "../common/commonComponents/paymentComponents/ManualPayment";
import UPIPayments from "../common/commonComponents/paymentComponents/UPIPayment";
import StripePayment from "../common/commonComponents/paymentComponents/StripePayment";
import GlobalPayment from "../common/commonComponents/paymentComponents/GlobalPayment";
import MsgPopup from "../common/commonComponents/MsgPopup";
import ParkSale from "../checkout/ParkSale";
import { makeOnlinePayments, getMakePayment, save, paymentAmount, changeReturnAmount } from "../checkout/checkoutSlice";
import { make_payconiq_payment } from "../common/commonComponents/paymentComponents/paymentSlice";
import { getAddonsField, getBookingField, productxArray } from "../../settings/CommonModuleJS";
import { RoundAmount, typeOfTax, getProductxChlidProductTax, getTotalTaxByName, getExtensionCheckoutList, setListActivityToCheckout, getCheckoutList } from "../common/TaxSetting";
import { isSafari, isMobileOnly, isTablet } from "react-device-detect";
import { refundOrder } from "./refundOrderSlice";
import Config from '../../Config';
import moment from "moment";
import { getDetail } from "../activity/ActivitySlice";
import { LoadingModal } from "../common/commonComponents/LoadingModal";
const Refund = (props) => {

    const [refundSubTotal, setRefundSubTotal] = useState(0.00);
    const [refundTaxes, setRefundTaxes] = useState(0.00);
    const [discount, setDiscount] = useState(0.00);
    // const [total, setRefundTotal] = useState(0.00);
    const [refundTotal, setRefundTotal] = useState(0.00);
    const [discountType, setDiscountType] = useState('');
    const [isShowNumberPad, setisShowNumberPad] = useState(false);
    const [isShowPartialPayment, setisShowPartialPayment] = useState(false);
    const [balance, setbalance] = useState(0);
    const [checkList, setCheckList] = useState(JSON.parse(localStorage.getItem("CHECKLIST")));
    const [cashRound, setCashRound] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [paidAmount, setPaidAmount] = useState(0);
    const [paymentsArr, setPaymentsArr] = useState([]);
    const [partialType, setPartialType] = useState('');
    const [isShowParkSale, setisShowParkSale] = useState(false);
    const [isLayAwayOrPark, setIsLayAwayOrPark] = useState('');
    const [storeCredit, setStoreCredit] = useState(0);
    const [loading, setLoading] = useState(false);
    const [onlinePayCardData, setOnlinePayCardData] = useState({});
    const [isShowMsg, setisShowMsg] = useState(false);
    const [msgTitle, setmsgTitle] = useState('');
    const [msgBody, setmsgBody] = useState('');
    const [global_Payments, setGlobal_Payments] = useState({});
    const [onlinePayments, setOnlinePayments] = useState({});
    const [activeCash, setActiveCash] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [changeAmount, setChangeAmount] = useState(0);
    const [cashPayment, setCashPayment] = useState(0);
    const [afterPaymentIs, setAfterPaymentIs] = useState(0);
    const [count, setCount] = useState(0)
    const [emvData, setEmvData] = useState([]);
    const [partialAmount, setPartialAmount] = useState(null);
    const [extensionOrderNote, setExtensionOrderNote] = useState([]);
    const [extensionUpdateCart, setExtensionUpdateCart] = useState(false);
    const [AllProductList, setAllProductList] = useState([]);
    const [extensionMetaData, setExtensionMetaData] = useState({});
    const [set_order_notes, set_set_order_notes] = useState([]);
    const [orderType, setOrderType] = useState('');
    const [Notes, setNotes] = useState('');
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [Email, setEmail] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [set_calculator_remaining_amount, set_set_calculator_remaining_amount] = useState(0);
    const [refundItemList, setRefundItemList] = useState([]);
    const [payment_Type, setPayment_Type] = useState('');
    const [isPaymentStart, setIsPaymentStart] = useState(false);
    const [myInput, setMyInput] = useState(0);
    const [paymentTypeItem, setPaymentTypeItem] = useState({
        Code: "",
        ColorCode: "",
        EODReconcilliation: true,
        HasTerminal: false,
        Id: 0,
        Name: "",
        Support: "",
        TerminalCount: 0,
        TerminalSerialNo: []
    });
    const [isManualPayment, setisManualPayment] = useState(false);
    const [isUPIPayment, setisUPIPayment] = useState(false);
    const [isStripeTerminalPayment, setisStripeTerminalPayment] = useState(false);
    const [cancleTransaction, setcancleTransaction] = useState(false);
    const [isGlobalPayment, setisGlobalPayment] = useState(false);
    const [paymentTypeName, setPaymentTypeName] = useState(localStorage.getItem("PAYMENT_TYPE_NAME") && JSON.parse(localStorage.getItem("PAYMENT_TYPE_NAME")));
    const [getorder, setGetorder] = useState(localStorage.getItem("getorder") ? JSON.parse(localStorage.getItem("getorder")) : null);
    const [UID, setUID] = useState(get_UDid('UDID'));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    var cash_rounding = ActiveUser.key.cash_rounding;
    const toggleMsgPopup = () => {
        setisShowMsg(!isShowMsg)
    }
    const toggleManualPayment = () => {
        setisManualPayment(!isManualPayment)
    }
    const toggleStripeTerminalPayment = () => {
        setisStripeTerminalPayment(!isStripeTerminalPayment)
    }

    const toggleUPIPayment = () => {
        setisUPIPayment(!isUPIPayment)
    }
    const toggleGlobalPayment = () => {
        setisGlobalPayment(!isGlobalPayment)
    }
    const toggleParkSale = (type) => {
        setisShowParkSale(!isShowParkSale);
        setIsLayAwayOrPark(type);
    }
    const toggleNumberPad = () => {
        setisShowNumberPad(!isShowNumberPad)
    }
    const toggleShowPartialPayment = () => {
        setisShowPartialPayment(!isShowPartialPayment)
    }
    const activeForCash = (st) => {
        setActiveCash(st);

    }
    const setCalculatorRemainingprice = (amount) => {
        set_set_calculator_remaining_amount(amount);
        // this.setState({
        //     set_calculator_remaining_amount: amount,
        // })
    }
    const [respPaymentAmount] = useSelector((state) => [state.paymentAmount])
    useEffect(() => {
        if ((respPaymentAmount && respPaymentAmount.status == STATUSES.IDLE && respPaymentAmount.is_success)) {
            //console.log("-respPaymentAmount---" + JSON.stringify(respPaymentAmount));
            if (respPaymentAmount.data.type == "cash") {
                pay_amount("cash");
            }
            else {
                pay_amount_cash(paymentTypeItem)
                // if (partialAmount != null) {
                //     setPartialPayment(respPaymentAmount.data.type, partialAmount)
                // }
                // else
                //     pay_amount(respPaymentAmount.data.type);
            }
        }
    }, [respPaymentAmount]);

    //its used for get the order payments
    const getOrderPayments = (order_id) => {
        if (localStorage.getItem("oliver_refund_order_payments")) {
            var paid_amount = 0;
            var payments = new Array();

            JSON.parse(localStorage.getItem("oliver_refund_order_payments")).forEach(paid_payments => {
                paid_amount += parseFloat(paid_payments.payment_amount);
                var paymentObj = {
                    "Id": paid_payments.Id !== 0 ? paid_payments.Id : 0,
                    "payment_type": paid_payments.payment_type,
                    "payment_amount": paid_payments.payment_amount,
                    "order_id": order_id,
                    "transection_id": paid_payments.transection_id ? paid_payments.transection_id : 0,
                    "emv_data": paid_payments.emv_data,
                    "description": paid_payments.emv_data && paid_payments.emv_data != "" ? JSON.stringify(paid_payments.emv_data) : paid_payments.description,

                }
                if (paid_payments.payment_date && paid_payments.payment_date != "") {
                    paymentObj['payment_date'] = paid_payments.payment_date;
                }
                payments.push(paymentObj);
            });
            return payments;
        } else {
            //alert("Your browser not support local storage");
        }
    }
    const finalAdd = () => {
        // if (isMobileOnly == true) {
        //     $("#popup_cash_rounding").removeClass("show")
        //     hideModal('popup_cash_rounding');
        // }
        //const { checkList, total_price, cash_round } = this.state;
        var after_payment_is = 0;
        var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_refund_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_refund_order_payments")) : [];
        if (getPayments !== null) {
            getPayments.forEach(paid_payments => {
                after_payment_is += parseFloat(paid_payments.payment_amount);
            });
        }
        var totalPrice = refundTotal;
        // var getorder = {};
        // if (localStorage.getItem("getorder")) {
        //     getorder = JSON.parse(localStorage.getItem("getorder"));
        // }
        var order_id = getorder.order_id;
        var cash_round_is = parseFloat(getRemainingPriceForCash())
        //this.setState({ cash_round: cash_round_is })
        setCashRound(cash_round_is);
        if (localStorage.getItem("oliver_refund_order_payments")) {
            var payments = JSON.parse(localStorage.getItem("oliver_refund_order_payments"));
            payments.push({
                "Id": 0,
                "payment_type": 'cash',
                "payment_amount": RoundAmount((totalPrice + cash_round_is) - after_payment_is),
                "order_id": order_id,
                "description": ''
            });
            localStorage.setItem("oliver_refund_order_payments", JSON.stringify(payments));
        } else {

            var payments = new Array();
            payments.push({
                "Id": 0,
                "payment_type": 'cash',
                "payment_amount": RoundAmount(totalPrice + cashRound),
                "order_id": order_id,
                "description": ''
            });
            localStorage.setItem("oliver_refund_order_payments", JSON.stringify(payments));
            localStorage.setItem("VOID_SALE", "void_sale");
            //this.props.dispatch(checkoutActions.changeStatusSaleToVoid("void_sale"));
        }
        setLoading(false);
        getPaymentDetails();
        isOrderPaymentComplete(order_id, cash_round_is);

    }
    const [respChangeAmount] = useSelector((state) => [state.changeReturnAmount])
    useEffect(() => {
        if ((respChangeAmount && respChangeAmount.status == STATUSES.IDLE && respChangeAmount.is_success)) {
            //console.log("--respChangeAmount--" + JSON.stringify(respChangeAmount));
            finalAdd();
        }
    }, [respChangeAmount]);
    const createOrder = (status) => {
        // this.setState({
        //     isShowLoader: true,
        // });
        // var getorder = {};
        // if (localStorage.getItem("getorder")) {
        //     getorder = JSON.parse(localStorage.getItem("getorder"));
        // }

        // setLoading(true);
        refund(getorder.order_id, cashRound, refundItemList);
        //setPayment(status);
    }
    const refund = (order_id, CashRound, refundItems) => {
        if (getorder) {
            var managerData = JSON.parse(localStorage.getItem('user'));
            var refund_subtotal = refundSubTotal;
            var refund_tax = refundTaxes;
            var refund_total = refundTotal;
            var items = new Array();
            var payments = new Array();
            var total_amount = parseFloat(getorder.total_amount - getorder.refunded_amount).toFixed(2);
            var new_last_amount_is = 0;
            var order_notes = [];
            //create the refund items array
            refundItems.forEach(element => {
                var updateMultiTax = [];
                if (element.Taxes) {
                    var taxArray = element.Taxes && JSON.parse(element.Taxes) && JSON.parse(element.Taxes).total;
                    if (taxArray) {
                        Object.keys(taxArray).forEach(function (key) {
                            var cal = parseFloat(taxArray[key]) / element.quantity;
                            updateMultiTax.push({ [key]: cal * element.quantity_to_refund });
                        })
                    }
                }

                items.push({
                    'Quantity': element.quantity_to_refund,
                    'amount': element.total * element.quantity_to_refund,
                    'tax': (element.total_tax / element.quantity) * element.quantity_to_refund,
                    'item_id': parseInt(element.line_item_id),
                    'taxes': updateMultiTax && updateMultiTax.length > 0 ? updateMultiTax : ((element.total_tax / element.quantity) * element.quantity_to_refund),
                    'item_type': element.product_id == 0 ? 'customFee' : 'product'
                });
            });
            var _paymentNotes = [];
            if (localStorage.oliver_refund_order_payments) {
                var date = new Date();
                var pay = JSON.parse(localStorage.getItem("oliver_refund_order_payments"));
                JSON.parse(localStorage.getItem("oliver_refund_order_payments")).forEach(paid_payments => {
                    if (order_id == paid_payments.order_id) {
                        payments.push({
                            'amount': paid_payments.payment_amount,
                            'payment_type': paid_payments.payment_type,
                            'type': paid_payments.payment_type,
                            'payment_date': `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
                            'description': paid_payments.description
                        });

                        //  add order notes for payments type and transaction id 
                        var transactionStr = paid_payments.transection_id && paid_payments.transection_id !== 0 ? `(${(paid_payments.transection_id).toString()})` : ""
                        _paymentNotes.push(`${paid_payments.payment_type}${transactionStr}`)
                    }
                });
                if (_paymentNotes.length > 0) {
                    order_notes.push({
                        note_id: '',
                        note: `Refund payment done with: ${_paymentNotes.join(", ")}`,
                        is_customer_note: 0,
                        is_extension_note: true
                    })
                }
            }

            // add extension's notes for order to order_notes field
            if (extensionOrderNote && extensionOrderNote.length) {
                extensionOrderNote.map((itm, ind) => {
                    order_notes.push({
                        note_id: '',
                        note: itm,
                        is_customer_note: true,
                    })
                })
            }

            var last_length_of_payments = payments.length - 1;
            var new_amount = 0;
            payments.map(itemP => {
                new_amount += parseFloat(itemP.amount)
            })
            if (CashRound == 0 && payments.length > 0) {
                if (new_amount > total_amount) {
                    var last_amount_is = parseFloat(payments[last_length_of_payments].amount)
                    new_last_amount_is = new_amount - total_amount;
                    payments[last_length_of_payments].amount = parseFloat(last_amount_is - new_last_amount_is).toFixed(2);
                    refund_total = total_amount;
                } else if (new_amount == total_amount) {
                    var last_amount_is = parseFloat(payments[last_length_of_payments].amount)
                    payments[last_length_of_payments].amount = parseFloat(last_amount_is).toFixed(2);
                    refund_total = total_amount;
                } else {
                    var last_amount_is = parseFloat(payments[last_length_of_payments].amount)
                    payments[last_length_of_payments].amount = parseFloat(last_amount_is).toFixed(2);
                    refund_total = new_amount;
                }

            } else if (payments.length > 0) {
                if (new_amount > total_amount) {
                    var last_amount_is = parseFloat(payments[last_length_of_payments].amount)
                    new_last_amount_is = (new_amount - total_amount);
                    payments[last_length_of_payments].amount = parseFloat(last_amount_is - new_last_amount_is).toFixed(2);
                    refund_total = total_amount;
                } else if (new_amount == total_amount) {
                    refund_total = total_amount;
                } else {
                    if (new_amount + CashRound == total_amount) {
                        payments[last_length_of_payments].amount = new_amount + CashRound;
                        refund_total = total_amount;
                    } else if (new_amount - CashRound == total_amount) {
                        payments[last_length_of_payments].amount = new_amount - CashRound;
                        refund_total = total_amount;
                    } else {
                        refund_total = new_amount;
                    }
                }
            }
            var order_meta = [];
            var location_id = localStorage.getItem('Location');

            var manager_name = '';
            if (managerData && managerData.display_name !== " " && managerData.display_name !== 'undefined') {
                manager_name = managerData.display_name;
            } else {
                manager_name = managerData !== null ? managerData.user_email : ''
            }

            order_meta.push({
                "manager_id": localStorage.getItem('demoUser') && localStorage.getItem('demoUser') == "true" ? localStorage.getItem('VisiterUserID') : localStorage.getItem('user') !== null && localStorage.getItem('user') !== undefined ? JSON.parse(localStorage.getItem('user')).user_id : "",
                "manager_name": localStorage.getItem('demoUser') && localStorage.getItem('demoUser') == "true" ? localStorage.getItem('VisiterUserEmail') : manager_name,
                "location_id": location_id,
                "register_id": localStorage.getItem('register'),
                "warehouse_id": localStorage.getItem('WarehouseId') ? localStorage.getItem('WarehouseId') : 0,
            })
            var customer_email = "";
            if (getorder.customer_id != 0) {
                //get customer here if customer_id!=0
            }
            var requestData = {
                'order_id': order_id,
                'refund_tax': refund_tax,
                'refund_amount': parseFloat(refund_total),
                'RefundItems': items,
                'order_refund_payments': payments,
                'udid': UID,
                'customer_email': customer_email,
                'manager_id': managerData.user_id,
                'manager_email': managerData.user_email,
                'refund_cash_rounding': CashRound,
                'register_id': parseInt(localStorage.getItem('register')),
                "order_notes": order_notes,
                "order_meta": order_meta
            }
            console.log("refund requestData", requestData)
            //call the action function   
            setLoading(true);
            dispatch(refundOrder(requestData));
        }
    }


    const getPaymentDetails = () => {
        var paid_amount = 0.0;
        var payments = new Array();
        if (localStorage.getItem("oliver_refund_order_payments")) {
            var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_refund_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_refund_order_payments")) : new Array();
            getPayments.forEach(paid_payments => {
                paid_amount += parseFloat(paid_payments.payment_amount);
                payments.push({
                    "payment_type": paid_payments.payment_type,
                    "payment_amount": paid_payments.payment_amount,
                });
            });
            setTotalPrice(refundTotal - paid_amount);
            setCount(payments.length);
            setPaymentsArr(payments);
            setPaidAmount(paid_amount);
            if (refundTotal >= paid_amount) {
                setCalculatorRemainingprice(paidAmount);
            } else {
                setCalculatorRemainingprice(0);
            }
        }
    }
    // its check the order paymets complete or not
    const isOrderPaymentComplete = (order_id, cash_round1) => {
        var amountToBePaid = refundTotal;
        var paidPaments = getOrderPayments(order_id);
        var paidAmount = 0;
        var cash_round = (cash_round1 == 'undefined') ? 0 : cash_round1
        paidPaments && paidPaments.forEach(paid_payments => {
            paidAmount += parseFloat(paid_payments.payment_amount);
        });
        if (cash_round > 0) {
            if (parseFloat(RoundAmount(amountToBePaid + cash_round)) == parseFloat(RoundAmount(paidAmount))) {
                createOrder("completed");
            } else if (parseFloat(amountToBePaid) <= parseFloat(paidAmount)) {
                createOrder("completed");
            } else if (parseFloat(RoundAmount(amountToBePaid)) <= parseFloat(RoundAmount(paidAmount))) {
                createOrder("completed");
            }
            else { setLoading(false); }

        } else {
            if (parseFloat(RoundAmount(amountToBePaid + cash_round)) == parseFloat(RoundAmount(paidAmount))) {
                createOrder("completed");
            }
            else { setLoading(false); }
        }

    }
    // its set the order payments
    const setOrderPartialPayments = (paying_amount, payment_type) => {
        var _totalPrice = refundTotal//checkList && refundTotal
        var change_amount = 0;
        var payment_is = 0;
        var order_id = getorder.order_id;
        var transection_id = '';//checkList && checkList.transection_id !== 0 ? checkList && checkList.transection_id : 0;
        if (checkList && checkList.transection_id) { //fix the issue same transation id should not used in other payment type 
            var temp_checkList = checkList;
            temp_checkList.transection_id = 0;
            setCheckList(checkList);
        }
        var actual_amount = totalPrice == 0 ? refundTotal : totalPrice;
        var cash_round = 0;//parseFloat(getRemainingPriceForCash())
        var check_required_field = false;
        //var paymentTypeName = localStorage.getItem("PAYMENT_TYPE_NAME") && JSON.parse(localStorage.getItem("PAYMENT_TYPE_NAME"))
        var isGlobalPay = false;
        paymentTypeName.map((pay_name, index) => {
            if (pay_name.Code !== "cash" && payment_type !== 'stripe_terminal' && pay_name.Code == payment_type && (pay_name.HasTerminal == true && pay_name.TerminalCount > 0)) {
                isGlobalPay = true;
            }
        });
        var isOnline = false;
        paymentTypeName.map((pay_name, index) => {
            if (pay_name.Support == 'Online' && pay_name.Code == payment_type) {
                isOnline = true;
            }
        });

        var isUPIPayment = false;
        paymentTypeName.map((pay_name, index) => {
            if (pay_name.Support == paymentsType.typeName.UPISupport && pay_name.Code == payment_type) {
                isUPIPayment = true;
            }
        });
        if (typeof (Storage) !== "undefined") {
            var payments = localStorage.getItem("oliver_refund_order_payments") ? JSON.parse(localStorage.getItem("oliver_refund_order_payments")) : [];
            // cash payment 
            if (payment_type == 'cash') {
                if (localStorage.getItem("oliver_refund_order_payments")) {
                    payments = JSON.parse(localStorage.getItem("oliver_refund_order_payments"));
                    payments.map((items) => {
                        return payment_is += parseFloat(items.payment_amount);
                    })
                    var ret = payment_is;
                    var total_pay = ret + parseFloat(paying_amount);
                    setCashRound(cash_round);
                    paying_amount = paying_amount ? String(paying_amount).replace(',', '') : 0;
                    if (total_pay > parseFloat(RoundAmount(_totalPrice + cash_round))) {
                        change_amount = paying_amount - (actual_amount - payment_is + cash_round);
                        setChangeAmount(change_amount);
                        setCashPayment(paying_amount);
                        setAfterPaymentIs(payment_is);

                        dispatch(changeReturnAmount({ "cashPayment": paying_amount, "change": parseFloat(paying_amount) - parseFloat(actual_amount) }));
                        //make payment while enter amount is greater than total price
                        //finalAdd();
                        //show message if payment amount is greater than total amount

                    } else {
                        if (paying_amount && paying_amount !== null)
                            payments.push({
                                "Id": 0,
                                "payment_type": payment_type,
                                "payment_amount": String(paying_amount).replace(',', ''),
                                "order_id": order_id,
                                "description": '',
                                "transection_id": transection_id
                            });
                        localStorage.setItem("oliver_refund_order_payments", JSON.stringify(payments));
                        //this.gtmEvent(payments);
                        getPaymentDetails();
                        isOrderPaymentComplete(order_id, cash_round);
                    }

                }
                else {
                    payments = new Array();
                    setCashRound(cash_round);
                    paying_amount = paying_amount ? String(paying_amount).replace(',', '') : 0.00;
                    if (parseFloat(paying_amount) > parseFloat(RoundAmount(actual_amount + cash_round))) {
                        change_amount = paying_amount - (actual_amount + cash_round);

                        setChangeAmount(change_amount);
                        setCashPayment(paying_amount);
                        setAfterPaymentIs(0);
                        dispatch(changeReturnAmount({ "cashPayment": paying_amount, "change": parseFloat(paying_amount) - parseFloat(actual_amount) }));
                        //make payment while enter amount is greater than total price
                        //finalAdd();


                        //show message if payment amount is greater than total amount
                    }
                    else {
                        if (paying_amount) {
                            payments.push({
                                "Id": 0,
                                "payment_type": payment_type,
                                "payment_amount": String(paying_amount).replace(',', ''),
                                "order_id": order_id,
                                "description": "",
                                "transection_id": transection_id
                            });
                        }
                        localStorage.setItem("oliver_refund_order_payments", JSON.stringify(payments));
                        //this.gtmEvent(payments);
                        getPaymentDetails();
                        isOrderPaymentComplete(order_id, cash_round);
                    }

                }
            }
            //  global  payments
            else if (isGlobalPay == true) {
                var g_payment = global_payment ? global_payment : localStorage.getItem('GLOBAL_PAYMENT_RESPONSE') && localStorage.getItem('GLOBAL_PAYMENT_RESPONSE') !== 'undefined' && JSON.parse(localStorage.getItem('GLOBAL_PAYMENT_RESPONSE'));
                if (g_payment && g_payment !== null && g_payment.is_success === true) {
                    var global_payments = g_payment.content;
                    var data = `TerminalId-${global_payments.TerminalId} , Authrization-${global_payments.Authrization},RefranseCode-${global_payments.RefranseCode}`;

                    if (paying_amount && data)
                        payments.push({
                            "Id": 0,
                            "payment_type": payment_type,
                            "payment_amount": String(paying_amount).replace(',', ''),
                            "order_id": order_id,
                            "description": data,
                            "transection_id": global_payments.RefranseCode ? global_payments.RefranseCode : transection_id
                        });
                    localStorage.setItem("oliver_refund_order_payments", JSON.stringify(payments));
                    //this.gtmEvent(payments);
                    getPaymentDetails();
                    isOrderPaymentComplete(order_id, 0);
                } else {
                    if (paying_amount)
                        payments.push({
                            "Id": 0,
                            "payment_type": payment_type,
                            "payment_amount": String(paying_amount).replace(',', ''),
                            "order_id": order_id,
                            "description": "",
                            "transection_id": transection_id
                        });
                    localStorage.setItem("oliver_refund_order_payments", JSON.stringify(payments));
                    //(payments);
                    getPaymentDetails();
                    isOrderPaymentComplete(order_id, 0);
                }
            }
            // online payments
            else if (isOnline == true) {
                let g_payment = localStorage.getItem('ONLINE_PAYMENT_RESPONSE') && localStorage.getItem('ONLINE_PAYMENT_RESPONSE') !== 'undefined' ? JSON.parse(localStorage.getItem('ONLINE_PAYMENT_RESPONSE')) : null
                if (g_payment !== null && g_payment.is_success === true) {
                    let olnine_payments = g_payment.content;
                    let data = `RefTransID-${olnine_payments.RefranseCode},Authrization-${olnine_payments.Authrization} ,RefranseCode-${olnine_payments.RefranseCode}`;
                    if (paying_amount && data)
                        payments.push({
                            "Id": 0,
                            "payment_type": payment_type,
                            "payment_amount": String(paying_amount).replace(',', ''),
                            "order_id": order_id,
                            "description": data,
                            "transection_id": olnine_payments.RefranseCode ? olnine_payments.RefranseCode : transection_id
                        });

                    localStorage.setItem("oliver_refund_order_payments", JSON.stringify(payments));
                    //this.gtmEvent(payments);
                    getPaymentDetails();
                    isOrderPaymentComplete(order_id, 0);
                } else {
                    if (paying_amount)
                        payments.push({
                            "Id": 0,
                            "payment_type": payment_type,
                            "payment_amount": String(paying_amount).replace(',', ''),
                            "order_id": order_id,
                            "description": "",
                            "transection_id": transection_id
                        });
                    localStorage.setItem("oliver_refund_order_payments", JSON.stringify(payments));
                    //this.gtmEvent(payments);
                    getPaymentDetails();
                    isOrderPaymentComplete(order_id, 0);
                }
            }
            // payconiq payments
            else if (isUPIPayment) {
                let payconiq_pay = localStorage.getItem('PAYCONIQ_PAYMENT_RESPONSE') && localStorage.getItem('PAYCONIQ_PAYMENT_RESPONSE') !== 'undefined' ? JSON.parse(localStorage.getItem('PAYCONIQ_PAYMENT_RESPONSE')) : null
                if (payconiq_pay !== null && payconiq_pay.is_success === true) {
                    let payconiqPaymentData = payconiq_pay.content;
                    let data = `RefTransID-${payconiqPaymentData.RefrenceID},Authrization-${payconiqPaymentData.RefrenceID} ,RefranseCode-${payconiqPaymentData.RefrenceID}`;
                    if (paying_amount && data)
                        payments.push({
                            "Id": 0,
                            "payment_type": payment_type,
                            "payment_amount": String(paying_amount).replace(',', ''),
                            "order_id": order_id,
                            "description": data,
                            "transection_id": payconiqPaymentData.RefrenceID ? payconiqPaymentData.RefrenceID : transection_id
                        });

                    localStorage.setItem("oliver_refund_order_payments", JSON.stringify(payments));
                    //this.gtmEvent(payments);
                    getPaymentDetails();
                    isOrderPaymentComplete(order_id, 0);
                } else {
                    if (paying_amount)
                        payments.push({
                            "Id": 0,
                            "payment_type": payment_type,
                            "payment_amount": String(paying_amount).replace(',', ''),
                            "order_id": order_id,
                            "description": "",
                            "transection_id": transection_id
                        });
                    localStorage.setItem("oliver_refund_order_payments", JSON.stringify(payments));
                    //this.gtmEvent(payments);
                    getPaymentDetails();
                    isOrderPaymentComplete(order_id, 0);
                }
            }
            // Stripe terminal
            else if (payment_type == 'stripe_terminal') {
                let s_payment = localStorage.getItem('STRIPE_PAYMENT_RESPONSE') && localStorage.getItem('STRIPE_PAYMENT_RESPONSE') !== 'undefined' ? JSON.parse(localStorage.getItem('STRIPE_PAYMENT_RESPONSE')) : null
                if (s_payment && s_payment.is_success) {
                    let stripe_payments = s_payment.content;
                    let data = `RefTransID-${stripe_payments.RefranseCode},Authrization-${stripe_payments.RefranseCode} ,RefranseCode-${stripe_payments.RefranseCode}`;
                    if (paying_amount && data)
                        payments.push({
                            "Id": 0,
                            "payment_type": payment_type,
                            "payment_amount": String(paying_amount).replace(',', ''),
                            "order_id": order_id,
                            "description": data,
                            "transection_id": stripe_payments.RefranseCode ? stripe_payments.RefranseCode : transection_id
                        });

                    localStorage.setItem("oliver_refund_order_payments", JSON.stringify(payments));
                    //this.gtmEvent(payments);
                    getPaymentDetails();
                    isOrderPaymentComplete(order_id, 0);
                } else {
                    if (paying_amount)
                        payments.push({
                            "Id": 0,
                            "payment_type": payment_type,
                            "payment_amount": String(paying_amount).replace(',', ''),
                            "order_id": order_id,
                            "description": "",
                            "transection_id": transection_id
                        });
                    localStorage.setItem("oliver_refund_order_payments", JSON.stringify(payments));
                    //this.gtmEvent(payments);
                    getPaymentDetails();
                    isOrderPaymentComplete(order_id, 0);
                }
            }
            // other payments
            else {
                if (paying_amount) {
                    var _emvData = emvData
                    var emvPaymentdata = ""
                    if (_emvData && _emvData.length > 0) {
                        _emvData.map(item => {
                            emvPaymentdata = item[payment_type]
                        });
                    }
                    payments.push({
                        "Id": 0,
                        "payment_type": payment_type,
                        "payment_amount": String(paying_amount).replace(',', ''),
                        "order_id": order_id,
                        "description": "",
                        "transection_id": transection_id,
                        "emv_data": emvPaymentdata
                    });
                }
                localStorage.setItem("oliver_refund_order_payments", JSON.stringify(payments));
                //this.gtmEvent(payments);
                getPaymentDetails();
                isOrderPaymentComplete(order_id, 0);
            }
            // ***  ***//      
            localStorage.setItem("VOID_SALE", "void_sale");
            //this.props.dispatch(checkoutActions.changeStatusSaleToVoid("void_sale"));
        } else {
            //alert("Your browser not support local storage");
        }
    }
    const pay_by_cash = (amount) => {
        toggleNumberPad();
        setPaidAmount(amount);
        setPartialAmount(null);
        dispatch(paymentAmount({ "type": "cash", "amount": amount }));
    }
    const pay_partial = (amount, item) => {
        toggleShowPartialPayment();
        setPartialAmount(amount);
        setPaymentTypeItem(item);
        dispatch(paymentAmount({ "type": item.Code, "amount": amount }));
    }
    const getRemainingPrice = () => {
        //var checkList = JSON.parse(localStorage.getItem("CHECKLIST"));
        var paid_amount = 0;
        var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_refund_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_refund_order_payments")) : [];
        if (getPayments !== null) {
            getPayments.forEach(paid_payments => {
                paid_amount += parseFloat(paid_payments.payment_amount);
            });
        }
        if (refundTotal >= paid_amount) {
            return (parseFloat(refundTotal) - parseFloat(paid_amount));
        }
        //return 0;
    }

    const getRemainingPriceForCash = () => {
        // var checkList = JSON.parse(localStorage.getItem("CHECKLIST"));
        var paid_amount = 0;
        var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_refund_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_refund_order_payments")) : [];
        if (getPayments !== null) {
            getPayments.forEach(paid_payments => {
                paid_amount += parseFloat(paid_payments.payment_amount);
            });
        }
        var totalPrice = refundTotal;
        var cashRoundReturn = parseFloat(GetRoundCash(cash_rounding, totalPrice - paid_amount))
        //this.state.CashRound = parseFloat(GetRoundCash(cash_rounding, totalPrice - paid_amount))
        setCashRound(parseFloat(GetRoundCash(cash_rounding, totalPrice - paid_amount)));
        var new_total_price = (totalPrice - paid_amount) + parseFloat(cashRoundReturn)
        return new_total_price;
    }
    // const pay_amount = (item) => {
    //     if (item.Name.toLowerCase() === "cash") {
    //         toggleNumberPad()
    //     }
    // }

    // refund stripe payments
    const stripePayments = (paycode, payment_amount) => {
        // this.setState({
        //     stripePayments: paycode,
        //     orderId: order_id,
        //     stripeStatus: true,
        //     isPaymentStart: true,
        //     globalPayments: paycode,
        //     globalStatus: true,
        // })
        // var paymentAmount = 0;
        //var payment_amount = partialAmount != null ? partialAmount : paidAmount ? paidAmount : 0;
        //var UID = get_UDid('UDID');
        // this.setState({
        //     refunding_amount: paymentAmount,
        //     paidAmountStatus: true
        // })
        //const {single_Order_list, paymentTypeName,onlinePayCardData} = this.state
        var orderTransacion = ''
        // var paymentTypeName = localStorage.getItem("PAYMENT_TYPE_NAME") && JSON.parse(localStorage.getItem("PAYMENT_TYPE_NAME"))
        paymentTypeName.map((pay_name, index) => {
            // var data  = this.checkIfOrderTypeGlobal(single_Order_list, pay_name)
            var data = getorder && getorder.order_payments && getorder.order_payments.find((orderItem) => orderItem.type == pay_name.Code)
            if (data) {
                orderTransacion = data
            }
        })
        var ordertransId = orderTransacion ? orderTransacion.transection_id : ''
        // onlinePayCardData["refId"] = ordertransId
        dispatch(getMakePayment(UID, localStorage.getItem('register'), paycode, payment_amount, "refund", ordertransId))

        // this.props.dispatch(checkoutActions.makeOnlinePayments(onlinePayCardData))

        // this.props.dispatch(checkoutActions.getMakePayment(UID, localStorage.getItem('register'), paycode, paymentAmount, "refund",ordertransId))
        //this.setRefundPayment(order_id , paycode)
    }
    // refund payconiq payments
    const payconiqPayments = (order_id, paycode, paymentAmount) => {
        // this.setState({
        //     payconiqPayments: paycode,
        //     orderId: order_id,
        //     payconiqStatus: true,
        //     isPaymentStart: true,
        // })
        // var paymentAmount = 0;
        // if (this.state.paidAmountStatus == true) {
        //     paymentAmount = this.state.refunding_amount;
        // } else {
        //     paymentAmount = this.state.refunding_amount !== 0 ? this.state.refunding_amount : this.state.refundingAmount;
        // }
        //var UID = get_UDid('UDID');
        // this.setState({
        //     refunding_amount: paymentAmount,
        //     paidAmountStatus: true
        // })
        // const { single_Order_list, paymentTypeName, onlinePayCardData } = this.state
        var orderTransacion = ''

        paymentTypeName.map((pay_name, index) => {
            var data = getorder && getorder.order_payments && getorder.order_payments.find((orderItem) => orderItem.type == pay_name.Code)
            if (data) {
                orderTransacion = data
            }
        })
        var ordertransId = orderTransacion ? orderTransacion.transection_id : ''
        // onlinePayCardData["refId"] = ordertransId
        var _requestData = {
            "registerId": localStorage.getItem('register') ? localStorage.getItem('register') : 1,
            "amount": parseFloat(paymentAmount),
            "paycode": paycode,
            "command": "refund",
            'refId': ordertransId,
            "SessionId": ''
        }
        dispatch(make_payconiq_payment(_requestData))
    }
    //----
    const [respmake_payconiq_payment] = useSelector((state) => [state.make_payconiq_payment])
    useEffect(() => {
        if (respmake_payconiq_payment && respmake_payconiq_payment.status == STATUSES.IDLE && respmake_payconiq_payment.is_success) {

            if (respmake_payconiq_payment) {
                if (respmake_payconiq_payment.error) {

                }
                else if (respmake_payconiq_payment.data && respmake_payconiq_payment.data.content && loading === false) {
                    // success case
                    setisUPIPayment(false)
                    //  if(refundTotal===paidAmount)
                    //  {
                    //     setLoading(true);
                    //  }
                    setLoading(true);
                    setOrderPartialPayments(parseFloat(paidAmount), "payconiq");
                    //createOrder("");
                }
            }
        }
    }, [respmake_payconiq_payment]);

    //--
    //  function use to check for payment types and perform action accordingly 
    const pay_amount = (paymentType, TerminalCount = 0, Support = '', paymentCode = '', paidConfirmAmount = 0) => {
        var closingTab = '';
        //const { paidAmount, closingTab } = this.state;
        if (paidConfirmAmount !== 0) {// set the achual payment done by payconiq
            setPaidAmount(paidConfirmAmount);
        }

        var payment_amount = partialAmount != null ? partialAmount : paidAmount ? paidAmount : 0;
        setPartialAmount(null);
        setPayment_Type(paymentType);
        const _getRemainingPrice = getRemainingPrice() ? getRemainingPrice() : 0;
        const _getRemainingPriceForCash = getRemainingPriceForCash();

        if (paymentType == paymentsType.typeName.cashPayment) {
            // var amount = paidAmount;// amount entered manually$('#calc_output_cash').val();
            var amount = partialAmount != null ? partialAmount : paidAmount ? paidAmount : 0;;
            payment_amount = amount
            if (payment_amount == 0) {
                // this.state.paidAmount = parseFloat(RoundAmount(getRemainingPrice)).toFixed(2)
                // this.setState({
                //     paidAmount: parseFloat(RoundAmount(getRemainingPrice)).toFixed(2)
                // })
                setPaidAmount(parseFloat(RoundAmount(_getRemainingPrice)).toFixed(2));

                if (RoundAmount(parseFloat(_getRemainingPriceForCash)).toFixed(2) == 0) {
                    setOrderPartialPayments(0, paymentType);
                    // set the current trnasaction status, Used for APP Command "TransactionStatus"
                    localStorage.setItem("CurrentTransactionStatus", JSON.stringify({ "paymentType": "cash", "status": "completed" }))
                } else {
                    extraPayAmount(LocalizedLanguage.zeroPaymentMsg)
                }
            }
        } else {
            if (parseFloat(payment_amount) == 0) {
                setPaidAmount(parseFloat(RoundAmount(_getRemainingPrice)).toFixed(2));
                // this.state.paidAmount = parseFloat(RoundAmount(getRemainingPrice));
                // this.setState({
                //     paidAmount: parseFloat(RoundAmount(getRemainingPrice)).toFixed(2)
                // })
                if (paymentType !== true && RoundAmount(parseFloat(_getRemainingPrice)) == 0) {
                    setOrderPartialPayments(0, paymentType);

                    // set the current trnasaction status, Used for APP Command "TransactionStatus"
                    localStorage.setItem("CurrentTransactionStatus", JSON.stringify({ "paymentType": paymentType, "status": "completed" }))
                } else if (paymentType !== true) {
                    extraPayAmount(LocalizedLanguage.zeroPaymentMsg)
                }
            }
        }
        setPayment_Type(paymentType);
        //this.setState({ paymentType: paymentType })
        if (parseFloat(payment_amount) > 0) {
            if (paymentType !== true && paymentType !== paymentsType.typeName.cashPayment && TerminalCount == 0 && paymentType !== paymentsType.typeName.storeCredit && paymentType !== 'manual_global_payment' && Support !== paymentsType.typeName.Support && paymentType !== 'stripe_terminal' && Support !== paymentsType.typeName.UPISupport) {
                // if (closingTab == false) {
                payment_amount = partialAmount != null ? partialAmount : parseFloat(RoundAmount(_getRemainingPrice));
                setPartialPayment(paymentType, payment_amount)
                // } else {
                //     setPartialPayment(paymentType, payment_amount)
                // }
            }
            if (TerminalCount > 0 && paymentType !== 'manual_global_payment') {

                //var global_amount = (isMobileOnly == true) ? payment_amount : myInput;
                var global_amount = payment_amount;
                if (ActiveUser.key.isSelfcheckout == true) {
                    global_amount = !global_amount ? payment_amount : global_amount;
                }
                payment_amount = parseFloat(RoundAmount(_getRemainingPrice));
                if (parseFloat(global_amount) !== 0 && parseFloat(payment_amount) >= parseFloat(global_amount)) {
                    // this.setState({
                    //     isPaymentStart: true
                    // })
                    setIsPaymentStart(true);
                    // set the current trnasaction status, Used for APP Command "TransactionStatus"
                    localStorage.setItem("CurrentTransactionStatus", JSON.stringify({ "paymentType": paymentType, "status": "processing" }))
                    globalPayments(paymentType, global_amount)
                } else if (parseFloat(global_amount) == 0) {
                    setPaidAmount(parseFloat(payment_amount).toFixed(2));
                    extraPayAmount(LocalizedLanguage.zeroPaymentMsg)

                } else if (parseFloat(payment_amount) < parseFloat(global_amount)) {
                    setPaidAmount(parseFloat(payment_amount).toFixed(2));
                    extraPayAmount(LocalizedLanguage.amountNotExceedMsg)
                }
            }

            if (paymentType == 'manual_global_payment') {
                var global_amount = payment_amount;
                global_amount = ActiveUser.key.isSelfcheckout == true ? payment_amount : global_amount
                var paymentMode = paymentType == "manual_global_payment" ? paymentCode : paymentType;
                payment_amount = parseFloat(RoundAmount(_getRemainingPrice));
                if (parseFloat(global_amount) !== 0 && parseFloat(payment_amount) >= parseFloat(global_amount)) {
                    setPartialPayment(paymentMode, global_amount)
                } else if (parseFloat(global_amount) == 0) {
                    setPaidAmount(parseFloat(payment_amount).toFixed(2));
                    extraPayAmount(LocalizedLanguage.zeroPaymentMsg)

                } else if (parseFloat(payment_amount) < parseFloat(global_amount)) {
                    setPaidAmount(parseFloat(payment_amount).toFixed(2));
                    extraPayAmount(LocalizedLanguage.amountNotExceedMsg)
                }
            }

            if (paymentType == paymentsType.typeName.storeCredit) {
                setPartialPayment(paymentType, payment_amount)
            }

            if (paymentType == paymentsType.typeName.cashPayment) {
                if (_getRemainingPriceForCash > 0) {
                    setPartialPayment(paymentType, payment_amount)
                } else if (_getRemainingPriceForCash == 0 && payment_amount > 0) {
                    extraPayAmount(LocalizedLanguage.amountNotExceedMsg)
                } else {
                    extraPayAmount(LocalizedLanguage.zeroPaymentMsg)
                }
            }

            // payamount for online manula card payment
            if (paymentType == paymentsType.typeName.manualPayment || Support == "Online") {

                //let online_amount = myInput;
                let online_amount = _getRemainingPrice;
                if (ActiveUser.key.isSelfcheckout == true) {
                    online_amount = !online_amount ? payment_amount : online_amount;
                }
                payment_amount = parseFloat(RoundAmount(_getRemainingPrice));
                if (parseFloat(online_amount) !== 0 && parseFloat(payment_amount) >= parseFloat(online_amount)) {
                    // this.setState({
                    //     isPaymentStart: true
                    // })
                    setIsPaymentStart(true);

                    var _tempOnlinePayCardData = onlinePayCardData;
                    _tempOnlinePayCardData.amount = online_amount;
                    setOnlinePayCardData(_tempOnlinePayCardData);

                    onlineCardPayments(paymentType, online_amount)
                } else if (parseFloat(online_amount) == 0) {
                    //  setPaidAmount(parseFloat(payment_amount).toFixed(2));
                    setPaidAmount(parseFloat(payment_amount).toFixed(2));
                    extraPayAmount(LocalizedLanguage.zeroPaymentMsg)

                } else if (parseFloat(payment_amount) < parseFloat(online_amount)) {
                    //  setPaidAmount(parseFloat(payment_amount).toFixed(2));
                    setPaidAmount(parseFloat(payment_amount).toFixed(2));
                    extraPayAmount(LocalizedLanguage.amountNotExceedMsg)
                }
            }

            // payamount forStripe payment

            if (paymentType == 'stripe_terminal') {
                var stripePayAmount = partialAmount != null ? partialAmount : parseFloat(RoundAmount(_getRemainingPrice));;
                stripePayAmount = ActiveUser.key.isSelfcheckout == true ? payment_amount : stripePayAmount
                var paymentMode = paymentType;
                payment_amount = parseFloat(RoundAmount(_getRemainingPrice));
                if (parseFloat(stripePayAmount) !== 0 && parseFloat(payment_amount) >= parseFloat(stripePayAmount)) {
                    // setPartialPayment(paymentMode, stripePayAmount)
                    stripePayments(paymentMode, stripePayAmount)
                } else if (parseFloat(stripePayAmount) == 0) {
                    //  setPaidAmount(parseFloat(payment_amount).toFixed(2));
                    setPaidAmount(parseFloat(payment_amount).toFixed(2));
                    extraPayAmount(LocalizedLanguage.zeroPaymentMsg)

                } else if (parseFloat(payment_amount) < parseFloat(stripePayAmount)) {
                    // setPaidAmount(parseFloat(payment_amount).toFixed(2));
                    setPaidAmount(parseFloat(payment_amount).toFixed(2));
                    extraPayAmount(LocalizedLanguage.amountNotExceedMsg)
                }
            }
            if (Support == paymentsType.typeName.UPISupport) {
                var payconiqAmount = payment_amount;// myInput;
                payconiqAmount = ActiveUser.key.isSelfcheckout == true ? payment_amount : payconiqAmount
                var paymentMode = paymentType;
                payment_amount = parseFloat(RoundAmount(_getRemainingPrice));
                if (parseFloat(payconiqAmount) !== 0 && parseFloat(payment_amount) >= parseFloat(payconiqAmount)) {
                    //setPartialPayment(paymentMode, payconiqAmount)
                    payconiqPayments(getorder.order_id, paymentMode, payment_amount);
                } else if (parseFloat(payconiqAmount) == 0) {
                    //  setPaidAmount(parseFloat(payment_amount).toFixed(2));
                    setPaidAmount(parseFloat(payment_amount).toFixed(2));
                    extraPayAmount(LocalizedLanguage.zeroPaymentMsg)

                } else if (parseFloat(payment_amount) < parseFloat(payconiqAmount)) {
                    //  setPaidAmount(parseFloat(payment_amount).toFixed(2));
                    setPaidAmount(parseFloat(payment_amount).toFixed(2));
                    extraPayAmount(LocalizedLanguage.amountNotExceedMsg)
                }
            }

            //Call GTM paymeny---------------------------
            // if (process.env.ENVIRONMENT == 'production') {
            //     GTM_oliverOrderPayment(paymentType, payment_amount)
            // }
            // trackOliverOrderPayment(paymentType, payment_amount)
            //------------------------------------
        }
    }
    const getDiscountAmount_Type = () => {
        if (localStorage.getItem("CART")) {
            let cart = JSON.parse(localStorage.getItem("CART"));
            let dtype = cart.discountType === "Percentage" ? '%' : "$";
            let damount = cart.discount_amount;
            setDiscountType(damount + "" + dtype);
        }
        else {
            setDiscountType('')
        }
    }


    const setValues = (st, tx, dis, tt, ril) => {
        getDiscountAmount_Type();
        setRefundSubTotal(RoundAmount(st));
        setRefundTaxes(RoundAmount(tx));
        setDiscount(RoundAmount(dis));
        setRefundTotal(RoundAmount(tt));
        setbalance(RoundAmount(tt))
        setRefundItemList(ril);
        setPaidAmount(RoundAmount(tt));
        //setPaidAmount(ril);
    }
    const setPartialPayment = (paymentType, paymentAmount) => {
        activeForCash(false);
        var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_refund_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_refund_order_payments")) : [];
        var paid_amount = 0;
        setPaidAmount(0);
        if (getPayments !== null) {
            getPayments.forEach(paid_payments => {
                paid_amount += parseFloat(paid_payments.payment_amount);
            });
        }
        var remianAmount = parseFloat(refundTotal) - parseFloat(paid_amount + parseFloat(paymentAmount));

        if (typeof paymentType !== 'undefined') {
            if (parseFloat(paymentAmount) <= 0) {
                setPaidAmount(parseFloat(RoundAmount(remianAmount)).toFixed(2));
                extraPayAmount(LocalizedLanguage.zeroPaymentMsg)
            } else if (parseFloat(RoundAmount(refundTotal)) >= parseFloat(parseFloat(paid_amount + parseFloat(paymentAmount))) && paymentType !== paymentsType.typeName.cashPayment) {
                setPaidAmount(parseFloat(RoundAmount(remianAmount)).toFixed(2));
                setLoading(true);
                setOrderPartialPayments(parseFloat(paymentAmount), paymentType);
            } else if (paymentType == paymentsType.typeName.cashPayment) {
                setPaidAmount(parseFloat(RoundAmount(remianAmount)).toFixed(2));
                setLoading(true);
                setOrderPartialPayments(parseFloat(paymentAmount), paymentType);
            } else if (parseFloat(refundTotal) == parseFloat(RoundAmount(parseFloat(paid_amount) + parseFloat(paymentAmount)))) {
                setPaidAmount(parseFloat(RoundAmount(remianAmount)).toFixed(2));
                setLoading(true);
                setOrderPartialPayments(parseFloat(paymentAmount), paymentType);
            } else if (parseFloat(refundTotal) < parseFloat(parseFloat(paid_amount) + parseFloat(paymentAmount))) {
                setPaidAmount(parseFloat(RoundAmount(refundTotal - paid_amount)).toFixed(2));
                extraPayAmount(LocalizedLanguage.amountNotExceedMsg)
            } else if (RoundAmount(parseFloat(refundTotal)) == parseFloat(RoundAmount(parseFloat(paid_amount) + parseFloat(paymentAmount)))) {
                setPaidAmount(0);
                setLoading(true);
                setOrderPartialPayments(parseFloat(paymentAmount), paymentType);
            }
        } else {
            setLoading(false);
            extraPayAmount(LocalizedLanguage.validModeMsg)
        }
    }
    const checkIfOrderTypeGlobal = (single_Order_list, pay_name) => {
        return single_Order_list && single_Order_list.order_payments && single_Order_list.order_payments.find((orderItem) => orderItem.type == pay_name.Code && pay_name.HasTerminal == true && pay_name.TerminalCount > 0)
    }
    const checkIfOrderTypeOnline = (single_Order_list, pay_name) => {
        return single_Order_list && single_Order_list.order_payments && single_Order_list.order_payments.find((orderItem) => orderItem.type == pay_name.Code && pay_name.Support == paymentsType.typeName.Support)
    }
    const globalPayments = (paycode, amount) => {
        setPaidAmount(amount);
        setGlobal_Payments(paycode);

        var orderTransacion = '';
        paymentTypeName.map((pay_name, index) => {
            var data = checkIfOrderTypeGlobal(getorder, pay_name)
            if (data) {
                orderTransacion = data
            }
        })
        var ordertransId = orderTransacion ? orderTransacion.transection_id : ''

        dispatch(getMakePayment(UID, localStorage.getItem('register'), paycode, amount, "refund", ordertransId))
    }
    const [respmakeOnlinePayments] = useSelector((state) => [state.makeOnlinePayments])
    useEffect(() => {
        if ((respmakeOnlinePayments && respmakeOnlinePayments.status == STATUSES.IDLE && respmakeOnlinePayments.is_success && respmakeOnlinePayments.data)) {
            console.log("---online paymet response--" + JSON.stringify(respmakeOnlinePayments))
        }
    }, [respmakeOnlinePayments])

    const [resRefundOrder] = useSelector((state) => [state.refundOrder])
    useEffect(() => {
        if (resRefundOrder && resRefundOrder.status == STATUSES.IDLE && resRefundOrder.is_success && loading === true) {
            setLoading(false);
            dispatch(paymentAmount(null));
            dispatch(changeReturnAmount(null));

            if (JSON.parse(localStorage.getItem("user")).display_sale_refund_complete_screen == false) {
                navigate('/transactions');
            } else {
                var order_id = getorder.order_id;
                dispatch(getDetail(order_id, UID));
                navigate('/refundcomplete');
            }

            //console.log("---refund done-----")
            //navigate('/refundcomplete');
        }
        else if (resRefundOrder && resRefundOrder.status == STATUSES.ERROR && resRefundOrder.is_success === false && loading === true) {
            console.log("error message---" + resRefundOrder.data);
            setLoading(false);
            var data = { title: "", msg: resRefundOrder.error, is_success: true }
            dispatch(popupMessage(data));
        }
    }, [resRefundOrder]);

    // handle online payment payamount
    const onlineCardPayments = (paycode, amount) => {
        setPaidAmount(amount);
        setOnlinePayments(paycode);

        // checking for the transation for the same payment type
        // var paymentTypeName = localStorage.getItem("PAYMENT_TYPE_NAME") && JSON.parse(localStorage.getItem("PAYMENT_TYPE_NAME"))
        var orderTransacion = '';
        paymentTypeName.map((pay_name, index) => {
            var data = getorder && getorder.order_payments && getorder.order_payments.find((orderItem) => orderItem.type == pay_name.Code && pay_name.Support == paymentsType.typeName.Support)
            if (data) {
                orderTransacion = data
            }
        })
        var ordertransId = orderTransacion ? orderTransacion.transection_id : '';
        var _onlinePayCardData = onlinePayCardData;
        _onlinePayCardData["refId"] = ordertransId
        //-----
        dispatch(makeOnlinePayments(_onlinePayCardData))
    }
    const extraPayAmount = (msg) => {
        var data = { title: "", msg: msg, is_success: true }
        dispatch(popupMessage(data));
        console.log(msg)
        setLoading(false);
    }
    const pay_amount_cash = (item) => {
        setPaymentTypeItem(item);
        //item.Code.toLowerCase() === "cash"
        if (item.Code == paymentsType.typeName.cashPayment) {
            toggleNumberPad();
        }
        else if (item.Support == paymentsType.typeName.UPISupport) {
            toggleUPIPayment();
        }
        else if (item.Support == paymentsType.typeName.Support) {
            toggleManualPayment();
        }
        else if (item.HasTerminal == true && item.Support == "Terminal" && item.Code != paymentsType.typeName.stripePayment) {
            toggleGlobalPayment();
        }
        else if (item.Code == paymentsType.typeName.stripePayment) {
            toggleStripeTerminalPayment();
        }
        else if (item.Code == paymentsType.typeName.storeCredit) {
            setPartialPayment(item.Code, paidAmount)
        }
        else {
            setPartialAmount(item.Code, partialAmount);
            pay_amount(item.Code);
        }
    }

    const placeParkLayAwayOrder = (status) => {
        // setCheckList(JSON.parse(localStorage.getItem("CHECKLIST"))) ;
        createOrder(status);
    }
    const closingTab = () => { }
    const onlinePayCardDetails = (cardData) => { setOnlinePayCardData(cardData); }
    const activeDisplay = (st) => {

        // this.closingTab()
        // this.setState({ activeDisplay: st })
    }

    //Arranging array to put cash and card type in the first and the second 
    var _paymentTypeName = paymentTypeName;
    if (_paymentTypeName && _paymentTypeName.length > 0) {
        var card = _paymentTypeName.find(a => a.Name.toLowerCase() === "card");
        var cash = _paymentTypeName.find(a => a.Name.toLowerCase() === "cash");
        _paymentTypeName = _paymentTypeName.filter(a => a.Name.toLowerCase() != "cash" && a.Name.toLowerCase() != "card");
        if (card && typeof card != "undefined")
            _paymentTypeName.unshift(card);
        if (cash && typeof cash != "undefined")
            _paymentTypeName.unshift(cash);
    }
    var _activeDisplay = true;
    var global_payment = null;
    return (<React.Fragment>     {loading === true ? <LoadingModal></LoadingModal> : null}
        <div className="refund-wrapper">
            <LeftNavBar ></LeftNavBar>
            <Header title={LocalizedLanguage.refundTitle}></Header>
            <div className="cart">
                {get_customerName() == null ?
                    null : <div className="refund-cart-header">
                        <div className="cart-customer">
                            <div className="avatar">
                                <img src={person} alt="" />
                            </div>
                            <div className="text-col">
                                <p className="style1">{get_customerName().Name}</p>
                                <p className="style2">{get_customerName().Email}</p>
                            </div>
                        </div>

                    </div>}
                <RefundCartListBody setValues={setValues} refresh={refresh} setRefresh={setRefresh}></RefundCartListBody>
                <div className="footer">
                    <div className="totals">
                        <div className="row">
                            <p>Subtotal</p>
                            <p><b>${<NumericFormat value={refundSubTotal} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</b></p>
                        </div>

                        {/* {discountType !="" ?
                            <div className="row">
                                <p>Cart Discount - {discountType}</p>
                                <button id="editCartDiscount" onClick={() => props.toggleEditCartDiscount()}>edit</button>
                                <p><b>-${<NumericFormat  value={discount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</b></p>
                            </div> : null} */}

                        {discountType != "" ?
                            <div className="row">
                                <p>Cart Discount - {discountType}</p>
                                <p><b>-${<NumericFormat value={discount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</b></p>
                            </div> : null}

                        {refundTaxes !== 0 ?
                            <div className="row">
                                <p>Taxes {typeOfTax() == 'incl' ? LocalizedLanguage.inclTax : LocalizedLanguage.exclTax}</p>
                                <p><b>${<NumericFormat value={refundTaxes} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</b></p>
                            </div> : null}
                        <div className="row">
                            <p><b>Total</b></p>
                            <p><b>${<NumericFormat value={refundTotal} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</b></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="refund-body">
                <button id="balanceButton" className="balance-container" onClick={() => toggleShowPartialPayment()}>
                    <div className="row">
                        <p className="style1">Refund Amount</p>
                        <p className="style2">${(parseFloat(balance) - (paymentsArr && paymentsArr.length > 0 ? (paymentsArr.reduce((a, v) => a = parseFloat(a) + parseFloat(v.payment_amount), 0)) : 0)).toFixed(2)}</p>
                    </div>
                    {paymentsArr && paymentsArr.map(p => {
                        return <div className="row">
                            <p className="style3">{p.payment_type}</p>
                            <p className="style3">${(parseFloat(p.payment_amount)).toFixed(2)}</p>
                            {/* -(paymentsArr && paymentsArr.length>0 ?(paymentsArr.reduce((a,v) =>  a = parseFloat( a) + parseFloat(v.payment_amount) , 0 )):0) */}
                        </div>
                    })}
                </button>
                <p className="style1">Click to make a partial payment</p>
                <p className="style2">Quick Split</p>
                <div className="button-row">
                    <button>1/2</button>
                    <button>1/3</button>
                    <button>1/4</button>
                </div>
                <div className="button-row">
                    <button id="splitByProductButton">By Product</button>
                    <button id="splitByPeopleButton">By People</button>
                </div>
                <p className="style2">Customer Payment Types</p>
                <p className="style3">Please add a customer to make customer payment types available</p>
                <div className="button-row">
                    {/* <button disabled>Layaway</button>
					<button disabled>Store Credit</button> */}
                    <button disabled={get_customerName() == null ? true : false}>Layaway</button>
                    <button disabled={get_customerName() == null ? true : false}>Store Credit</button>
                </div>
                <div className="payment-types">
                    <p>Payment Types</p>
                    <div className="button-container">
                        {
                            _paymentTypeName && _paymentTypeName.length > 0 && _paymentTypeName.map(payment => {

                                var isOrderPaymentGlobal = checkIfOrderTypeGlobal(getorder, payment)
                                isOrderPaymentGlobal = isOrderPaymentGlobal ? true : false
                                var isOrderPaymentOnline = checkIfOrderTypeOnline(getorder, payment)
                                isOrderPaymentOnline = isOrderPaymentOnline ? true : false

                                return payment.image || payment.Code === "stripe_terminal" ?
                                    // <img src={payment.image}  alt=""></img>
                                    <button >
                                        <img src={Stripe_Icon} alt=""></img></button>
                                    :
                                    //(payment.HasTerminal == true && payment.Support == "Terminal" && payment.Code != paymentsType.typeName.stripePayment)?
                                    <button style={{ backgroundColor: payment.ColorCode, borderColor: payment.ColorCode }} key={payment.Id} onClick={() => pay_amount_cash(payment)}>
                                        {payment.Name}
                                    </button>
                                    //:null
                            })


                            // paymentTypeName && paymentTypeName.length > 0 && paymentTypeName.map(payment => {
                            //     return <button style={{ backgroundColor: payment.ColorCode, borderColor: payment.ColorCode }} key={payment.Id} onClick={() => pay_amount_cash(payment)}>
                            //         {payment.Name}
                            //         {/* <img src="../Assets/Images/SVG/spongebob-squarepants-2.svg" alt="" /> */}
                            //     </button>
                            // })
                        }
                    </div>
                </div>
            </div>

        </div>
        {isStripeTerminalPayment === true ? <StripePayment
            type="refund"
            isShow={isStripeTerminalPayment}
            toggleStripeTerminalPayment={toggleStripeTerminalPayment}
            color={"#f75f40"}
            Name={"Stripe Terminal"}
            code={"stripe_terminal"}
            pay_amount={(text) => pay_amount(text)}
            activeDisplay={(text) => activeDisplay(text)}
            styles={activeDisplay == false || activeDisplay == `stripe_terminal_true` ? '' : 'none'}
            paymentDetails={paymentTypeItem}
            terminalPopup={(msg) => extraPayAmount(msg)}
            paidAmount={paidAmount}
            cancleTransaction={false}
            partialAmount={partialAmount}
        /> : null}
        {isManualPayment === true ? <ManualPayment isShow={isManualPayment} toggleManualPayment={toggleManualPayment}
            type="refund"
            color={paymentTypeItem.ColorCode}
            Name={paymentTypeItem.Name}
            code={paymentTypeItem.Code}
            pay_amount={(text) => pay_amount(text, paymentTypeItem.TerminalCount, paymentTypeItem.Support)}
            msg={props.global_payment ? props.global_payment.message : LocalizedLanguage.waitForTerminal}
            activeDisplay={(text) => activeDisplay(text)}
            styles={_activeDisplay == false || _activeDisplay == `${paymentTypeItem.Code}_true` ? '' : 'none'}
            closingTab={(text) => closingTab(text)}
            onlinePayCardDetails={(cardData) => onlinePayCardDetails(cardData)}
            partialAmount={partialAmount}
        /> : null}
        {isUPIPayment === true ? <UPIPayments
            type="refund"
            isShow={isUPIPayment}
            toggleUPIPayment={toggleUPIPayment}
            color={paymentTypeItem.ColorCode}
            Name={paymentTypeItem.Name}
            code={paymentTypeItem.Code}
            pay_amount={(text) => pay_amount(text, paymentTypeItem.TerminalCount, paymentTypeItem.Support)}
            activeDisplay={(text) => activeDisplay(text)}
            styles={_activeDisplay == false || _activeDisplay == `${paymentTypeItem.Code}_true` ? '' : 'none'}
            cancleTransaction={cancleTransaction}
            partialAmount={partialAmount}
        /> : null}
        {isGlobalPayment === true ? <GlobalPayment
            type="refund"
            isShow={isGlobalPayment}
            toggleGlobalPayment={toggleGlobalPayment}
            color={paymentTypeItem.ColorCode}
            Name={paymentTypeItem.Name}
            code={paymentTypeItem.Code}
            pay_amount={(text) => pay_amount(text, paymentTypeItem.TerminalCount, '', paymentTypeItem.Code)}
            msg={global_payment ? global_payment.message : ''}
            activeDisplay={(text) => activeDisplay(text)}
            styles={_activeDisplay == false || _activeDisplay == `${paymentTypeItem.Code}_true` ? '' : 'none'}
            closingTab={(text) => closingTab(text)}
            paymentDetails={paymentTypeItem}
            terminalPopup={(msg) => extraPayAmount(msg)}
            cancleTransaction={cancleTransaction}
            partialAmount={partialAmount}
        /> : null}
        {isShowNumberPad ? <NumberPad isShow={isShowNumberPad} toggleNumberPad={toggleNumberPad} pay_by_cash={pay_by_cash} amount={(parseFloat(balance) - (paymentsArr && paymentsArr.length > 0 ? (paymentsArr.reduce((a, v) => a = parseFloat(a) + parseFloat(v.payment_amount), 0)) : 0)).toFixed(2)} getRemainingPriceForCash={getRemainingPriceForCash} ></NumberPad> : null}
        {isShowPartialPayment ? <PartialPayment isShow={isShowPartialPayment} toggleShowPartialPayment={toggleShowPartialPayment} amount={paidAmount} pay_partial={pay_partial} getRemainingPrice={getRemainingPrice} partialType={partialType}></PartialPayment> : null}
        {isShowParkSale ? <ParkSale toggleParkSale={toggleParkSale} isShow={isShowParkSale} placeParkLayAwayOrder={placeParkLayAwayOrder} isLayAwayOrPark={isLayAwayOrPark}></ParkSale> : null}
        <MsgPopup isShow={isShowMsg} toggleMsgPopup={toggleMsgPopup} msgTitle={msgTitle} msgBody={msgBody}></MsgPopup>
    </React.Fragment>)
}
export default Refund