import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import AngledBracket_Left_Blue from '../../assets/images/svg/AngledBracket-Left-Blue.svg'
import EmptyCart from '../../assets/images/svg/EmptyCart.svg'
import person from '../../assets/images/svg/person.svg'
import { get_customerName, get_UDid, get_userName } from '../common/localSettings';

import STATUSES from "../../constants/apiStatus";
import { useNavigate } from 'react-router-dom';
import LeftNavBar from "../common/commonComponents/LeftNavBar";
import Header from "./Header";
import CartListBody from "../common/commonComponents/CartListBody";
import { RoundAmount, typeOfTax, getProductxChlidProductTax, getTotalTaxByName, getExtensionCheckoutList, setListActivityToCheckout, getCheckoutList } from "../common/TaxSetting";
import { popupMessage } from "../common/commonAPIs/messageSlice";
import { NumericFormat } from 'react-number-format';
import LocalizedLanguage from "../../settings/LocalizedLanguage";
import NumberPad from "../common/commonComponents/NumberPad";
import { GetRoundCash } from "../../settings/CheckoutFunction";
import PartialPayment from "./PartialPayment";
import ActiveUser from '../../settings/ActiveUser';
import paymentsType from '../../settings/PaymentsType'
import { getAddonsField, getBookingField, productxArray } from "../../settings/CommonModuleJS";
import Config from '../../Config';
import moment from "moment";
import { isSafari, isMobileOnly, isTablet } from "react-device-detect";
import { product } from "../dashboard/product/productSlice";
import { addtoCartProduct } from "../dashboard/product/productLogic";
import { makeOnlinePayments, getMakePayment, save, paymentAmount,changeReturnAmount } from "../checkout/checkoutSlice";
import { LoadingModal } from "../common/commonComponents/LoadingModal";
const Checkout = () => {

    const [subTotal, setSubTotal] = useState(0.00);
    const [taxes, setTaxes] = useState(0.00);
    const [discount, setDiscount] = useState(0.00);
    const [total, setTotal] = useState(0.00);
    const [discountType, setDiscountType] = useState('');
    const [isShowNumberPad, setisShowNumberPad] = useState(false);
    const [isShowPartialPayment, setisShowPartialPayment] = useState(false);
    const [balance, setbalance] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);
    const [partialAmount, setPartialAmount] = useState(0);

    const [checkList, setCheckList] = useState(JSON.parse(localStorage.getItem("CHECKLIST")));
    const [changeAmount, setChangeAmount] = useState(0);
    const [cashPayment, setCashPayment] = useState(0);
    const [afterPaymentIs, setAfterPaymentIs] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [cashRound, setCashRound] = useState(0);
    const [isPaymentStart, setIsPaymentStart] = useState(false);
    const [onlinePayCardData, setOnlinePayCardData] = useState({});
    const [global_Payments, setGlobal_Payments] = useState({});
    const [onlinePayments, setOnlinePayments] = useState({});
    const [myInput, setMyInput] = useState(0);
    const [loading, setLoading] = useState(false);
    const [activeCash, setActiveCash] = useState(false);
    const [payment_Type, setPayment_Type] = useState()
    const [count, setCount] = useState(0)
    const [paymentsArr, setPaymentsArr] = useState([])
    const [set_calculator_remaining_amount, set_set_calculator_remaining_amount] = useState(0);
    const [emvData, setEmvData] = useState([]);
    const [AllProductList, setAllProductList] = useState([]);
    const [orderType, setOrderType] = useState('');
    const [Notes, setNotes] = useState('');
    const [extensionMetaData, setExtensionMetaData] = useState({});
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [Email, setEmail] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [extensionOrderNote, setExtensionOrderNote] = useState([]);
    const [extensionUpdateCart, setExtensionUpdateCart] = useState(false);
    const [set_order_notes, set_set_order_notes] = useState([]);
    const [partialType, setPartialType] = useState('');
    // change_amount: change_amount,
    // cash_payment: paying_amount,
    // after_payment_is: payment_is

    const [resSave] = useSelector((state) => [state.save])
    useEffect(() => {
        if (resSave && resSave.status == STATUSES.IDLE && resSave.is_success && loading === true) {
            setLoading(false);
            dispatch(paymentAmount(null));
            dispatch(changeReturnAmount(null));
            navigate('/salecomplete');
        }
    }, [resSave]);
    //var paidAmount = 0;
    // const setPaidAmount = (amt) => {
    //     if (amt == null) {
    //         paidAmount = 0;
    //         var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : [];
    //         if (getPayments !== null) {
    //             getPayments.forEach(paid_payments => {
    //                 paidAmount += parseFloat(paid_payments.payment_amount);
    //             });
    //         }
    //         if (checkList && checkList.totalPrice && parseFloat(checkList.totalPrice) >= paidAmount) {
    //             paidAmount = (parseFloat(checkList.totalPrice) - parseFloat(paidAmount));
    //         }
    //     }
    //     paidAmount = amt;
    // }
    //setPaidAmount(null);
    // useEffect(() => {
    //     var remPrice = getRemainingPrice();
    //     remPrice=remPrice ? parseFloat(RoundAmount(remPrice)).toFixed(2) : 0
    //     setPaidAmount(remPrice);
    // },[])

    const dispatch = useDispatch();
    const navigate = useNavigate();

    var cash_rounding = ActiveUser.key.cash_rounding;

    const toggleNumberPad = () => {
        setisShowNumberPad(!isShowNumberPad)
    }
    const toggleShowPartialPayment = () => {
        setPartialType('');
        setisShowPartialPayment(!isShowPartialPayment)
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
    const showPartial=(val)=>
    {
        setPartialType(val);
        setisShowPartialPayment(true);
    }

    const setValues = (st, tx, dis, tt) => {
        getDiscountAmount_Type();
        setSubTotal(RoundAmount(st));
        setTaxes(RoundAmount(tx));
        setDiscount(RoundAmount(dis));
        setTotal(RoundAmount(tt));
        setbalance(RoundAmount(tt))
        setPaidAmount(RoundAmount(tt));
    }
    const addCustomer = () => {
        dispatch(paymentAmount(null));
        navigate('/customer');
        // var data ={title:"",msg:"Please add at least one product in cart !",is_success:true}
        // dispatch(popupMessage(data));
        //alert('add customer to order');
    }

    const getRemainingPrice = () => {
        //var checkList = JSON.parse(localStorage.getItem("CHECKLIST"));
        var paid_amount = 0;
        var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : [];
        if (getPayments !== null) {
            getPayments.forEach(paid_payments => {
                paid_amount += parseFloat(paid_payments.payment_amount);
            });
        }
        if (checkList && checkList.totalPrice && parseFloat(checkList.totalPrice) >= paid_amount) {
            return (parseFloat(checkList.totalPrice) - parseFloat(paid_amount));
        }
    }

    const getRemainingPriceForCash = () => {
        // var checkList = JSON.parse(localStorage.getItem("CHECKLIST"));
        var paid_amount = 0;
        var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : [];
        if (getPayments !== null) {
            getPayments.forEach(paid_payments => {
                paid_amount += parseFloat(paid_payments.payment_amount);
            });
        }
        var totalPrice = checkList && checkList.totalPrice ? parseFloat(RoundAmount(checkList.totalPrice)) : 0;
        var cashRoundReturn = parseFloat(GetRoundCash(cash_rounding, totalPrice - paid_amount))
        //this.state.CashRound = parseFloat(GetRoundCash(cash_rounding, totalPrice - paid_amount))
        setCashRound(parseFloat(GetRoundCash(cash_rounding, totalPrice - paid_amount)));
        var new_total_price = (totalPrice - paid_amount) + parseFloat(cashRoundReturn)
        return new_total_price;
    }
    const pay_by_cash = (amount) => {
        toggleNumberPad();
        setPaidAmount(amount);
        setPartialAmount(null);
        dispatch(paymentAmount({ "type": "cash", "amount": amount }));
        //pay_amount("cash");
        //setPayment_Type("cash");
    }
    const pay_partial = (amount, type) => {
        toggleShowPartialPayment();
        //setPaidAmount(amount);
        setPartialAmount(amount);

        dispatch(paymentAmount({ "type": type, "amount": amount }));
        //pay_amount(type);
        //setPayment_Type("cash");
    }

    const [respPaymentAmount] = useSelector((state) => [state.paymentAmount])
    useEffect(() => {
        if ((respPaymentAmount && respPaymentAmount.status == STATUSES.IDLE && respPaymentAmount.is_success)) {
            console.log("----" + JSON.stringify(respPaymentAmount));
            if (respPaymentAmount.data.type == "cash") {
                pay_amount("cash");
            }
            else {
                if (partialAmount != null) {
                    setPartialPayment(respPaymentAmount.data.type, partialAmount)
                }
                else
                    pay_amount(respPaymentAmount.data.type);
            }
        }
    }, [respPaymentAmount]);

    const [respChangeAmount] = useSelector((state) => [state.changeReturnAmount])
    useEffect(() => {
        if ((respChangeAmount && respChangeAmount.status == STATUSES.IDLE && respChangeAmount.is_success)) {
            //console.log("--respChangeAmount--" + JSON.stringify(respChangeAmount));
            finalAdd();
        }
    }, [respChangeAmount]);
    // useEffect(() => {
    //     pay_amount("cash");
    // },[partialAmount]);
    // useEffect(() => {
    //     pay_amount(payment_Type);
    // }, [payment_Type]);
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
                if (closingTab == false) {
                    payment_amount = parseFloat(RoundAmount(_getRemainingPrice))
                    setPartialPayment(paymentType, payment_amount)
                } else {
                    setPartialPayment(paymentType, payment_amount)
                }
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
                var global_amount = myInput;
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

                let online_amount = myInput;
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
                var stripePayAmount = myInput;
                stripePayAmount = ActiveUser.key.isSelfcheckout == true ? payment_amount : stripePayAmount
                var paymentMode = paymentType;
                payment_amount = parseFloat(RoundAmount(_getRemainingPrice));
                if (parseFloat(stripePayAmount) !== 0 && parseFloat(payment_amount) >= parseFloat(stripePayAmount)) {
                    setPartialPayment(paymentMode, stripePayAmount)
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
                var payconiqAmount = myInput;
                payconiqAmount = ActiveUser.key.isSelfcheckout == true ? payment_amount : payconiqAmount
                var paymentMode = paymentType;
                payment_amount = parseFloat(RoundAmount(_getRemainingPrice));
                if (parseFloat(payconiqAmount) !== 0 && parseFloat(payment_amount) >= parseFloat(payconiqAmount)) {
                    setPartialPayment(paymentMode, payconiqAmount)
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
    const activeForCash = (st) => {
        setActiveCash(st);

    }
    const setPartialPayment = (paymentType, paymentAmount) => {
        activeForCash(false);
        //var checkList = JSON.parse(localStorage.getItem("CHECKLIST"));
        var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : [];
        var paid_amount = 0;
        setPaidAmount(0);
        //this.setState({ paidAmount: 0 })
        if (getPayments !== null) {
            getPayments.forEach(paid_payments => {
                paid_amount += parseFloat(paid_payments.payment_amount);
            });
        }
        var remianAmount = parseFloat(checkList.totalPrice) - parseFloat(paid_amount + parseFloat(paymentAmount));

        if (typeof paymentType !== 'undefined') {
            if (parseFloat(paymentAmount) <= 0) {
                // this.setState({ paidAmount: parseFloat(RoundAmount(remianAmount)).toFixed(2) })
                setPaidAmount(parseFloat(RoundAmount(remianAmount)).toFixed(2));
                extraPayAmount(LocalizedLanguage.zeroPaymentMsg)
            } else if (parseFloat(RoundAmount(checkList.totalPrice)) >= parseFloat(parseFloat(paid_amount + parseFloat(paymentAmount))) && paymentType !== paymentsType.typeName.cashPayment) {
                setPaidAmount(parseFloat(RoundAmount(remianAmount)).toFixed(2));
                setLoading(true);
                //this.setState({ loading: true })
                setOrderPartialPayments(parseFloat(paymentAmount), paymentType);
            } else if (paymentType == paymentsType.typeName.cashPayment) {
                setPaidAmount(parseFloat(RoundAmount(remianAmount)).toFixed(2));
                setLoading(true);
                //this.setState({ paidAmount: parseFloat(RoundAmount(remianAmount)).toFixed(2), loading: true })
                setOrderPartialPayments(parseFloat(paymentAmount), paymentType);
            } else if (parseFloat(checkList.totalPrice) == parseFloat(RoundAmount(parseFloat(paid_amount) + parseFloat(paymentAmount)))) {
                setPaidAmount(parseFloat(RoundAmount(remianAmount)).toFixed(2));
                setLoading(true);
                setOrderPartialPayments(parseFloat(paymentAmount), paymentType);
            } else if (parseFloat(checkList.totalPrice) < parseFloat(parseFloat(paid_amount) + parseFloat(paymentAmount))) {
                setPaidAmount(parseFloat(RoundAmount(checkList.totalPrice - paid_amount)).toFixed(2));
                extraPayAmount(LocalizedLanguage.amountNotExceedMsg)
            } else if (RoundAmount(parseFloat(checkList.totalPrice)) == parseFloat(RoundAmount(parseFloat(paid_amount) + parseFloat(paymentAmount)))) {
                //this.setState({ paidAmount: 0, loading: true })
                setPaidAmount(0);
                setLoading(true);
                setOrderPartialPayments(parseFloat(paymentAmount), paymentType);
            }
        } else {
            setLoading(false);
            extraPayAmount(LocalizedLanguage.validModeMsg)
        }
    }
    const globalPayments = (paycode, amount) => {
        var UID = get_UDid('UDID');
        setPaidAmount(amount);
        setGlobal_Payments(paycode);
        dispatch(getMakePayment(UID, localStorage.getItem('register'), paycode, amount, "sale"))

        // if(ActiveUser.key.isSelfcheckout==true)
        // history.push('/cardpaymentRes')
    }
    // handle online payment payamount
    const onlineCardPayments = (paycode, amount) => {
        setPaidAmount(amount);
        setOnlinePayments(paycode);
        dispatch(makeOnlinePayments(onlinePayCardData))
    }
    const extraPayAmount = (msg) => {
        console.log(msg)
        setLoading(false);
        // this.setState({ common_Msg: msg })
        // setTimeout(function () {
        //     showModal('common_msg_popup');
        // }, 100)
        // if (isMobileOnly == true) { $('#common_msg_popup').addClass('show') }
    }
    const paymentType = (type) => {
        // var totalPrice = this.state.checkList && this.state.checkList.totalPrice;
        // var cash_round = parseFloat(this.getRemainingPriceForCash())
        // if (type == 'cash') {
        //     this.state.cash_round = cash_round;
        //     this.setState({
        //         cash_round: cash_round
        //     })
        // } else {
        //     this.state.cash_round = 0;
        //     this.setState({
        //         cash_round: 0,
        //         total_price: 0
        //     })
        // }

    }
    const finalAdd=()=> {
        // if (isMobileOnly == true) {
        //     $("#popup_cash_rounding").removeClass("show")
        //     hideModal('popup_cash_rounding');
        // }
        //const { checkList, total_price, cash_round } = this.state;
        var after_payment_is = 0;
        var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : [];
        if (getPayments !== null) {
            getPayments.forEach(paid_payments => {
                after_payment_is += parseFloat(paid_payments.payment_amount);
            });
        }
        var totalPrice = checkList && checkList.totalPrice;
        var order_id = (typeof checkList.order_id !== "undefined") ? checkList.order_id : 0;
        var cash_round_is = parseFloat(getRemainingPriceForCash())
        //this.setState({ cash_round: cash_round_is })
        setCashRound(cash_round_is);
        if (localStorage.getItem("oliver_order_payments")) {
            var payments = JSON.parse(localStorage.getItem("oliver_order_payments"));
            payments.push({
                "Id": 0,
                "payment_type": 'cash',
                "payment_amount": RoundAmount((totalPrice + cash_round_is) - after_payment_is),
                "order_id": order_id,
                "description": ''
            });
            localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
        } else {

            var payments = new Array();
            payments.push({
                "Id": 0,
                "payment_type": 'cash',
                "payment_amount": RoundAmount(totalPrice + cashRound),
                "order_id": order_id,
                "description": ''
            });
            localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
            localStorage.setItem("VOID_SALE", "void_sale");
            //this.props.dispatch(checkoutActions.changeStatusSaleToVoid("void_sale"));
        }
        setLoading(false);
        getPaymentDetails();
        isOrderPaymentComplete(order_id, cash_round_is);

    }
    // its set the order payments
    const setOrderPartialPayments = (paying_amount, payment_type) => {
        //var checkList = JSON.parse(localStorage.getItem('CHECKLIST'));
        var _totalPrice = checkList && checkList.totalPrice
        var change_amount = 0;
        var payment_is = 0;
        var order_id = checkList && checkList.order_id !== 0 ? checkList && checkList.order_id : 0;
        var transection_id = checkList && checkList.transection_id !== 0 ? checkList && checkList.transection_id : 0;
        if (checkList && checkList.transection_id) { //fix the issue same transation id should not used in other payment type 
            var temp_checkList = checkList;
            temp_checkList.transection_id = 0;
            setCheckList(checkList);
            //checkList.transection_id = 0;
        }
        var actual_amount = totalPrice == 0 ? checkList && checkList.totalPrice : totalPrice;
        var cash_round = 0;//parseFloat(getRemainingPriceForCash())
        var check_required_field = false;
        var paymentTypeName = localStorage.getItem("PAYMENT_TYPE_NAME") && JSON.parse(localStorage.getItem("PAYMENT_TYPE_NAME"))
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
            var payments = localStorage.getItem("oliver_order_payments") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : [];
            // cash payment 
            if (payment_type == 'cash') {
                if (localStorage.getItem("oliver_order_payments")) {
                    payments = JSON.parse(localStorage.getItem("oliver_order_payments"));
                    payments.map((items) => {
                        return payment_is += parseFloat(items.payment_amount);
                    })
                    var ret = payment_is;
                    var total_pay = ret + parseFloat(paying_amount);
                    // setCashRound(cash_round);
                    setCashRound(cash_round);
                    paying_amount = paying_amount ? String(paying_amount).replace(',', '') : 0;
                    if (total_pay > parseFloat(RoundAmount(_totalPrice + cash_round))) {
                        change_amount = paying_amount - (actual_amount - payment_is + cash_round);
                        // this.setState({
                        //     change_amount: change_amount,
                        //     cash_payment: paying_amount,
                        //     after_payment_is: payment_is
                        // })
                        setChangeAmount(change_amount);
                        setCashPayment(paying_amount);
                        setAfterPaymentIs(payment_is);

                        dispatch(changeReturnAmount({ "cashPayment": paying_amount, "change": parseFloat(paying_amount)-parseFloat(actual_amount) }));
                        //make payment while enter amount is greater than total price
                        //finalAdd();
                        //---------- 
                

                        // this.freezScreen();
                        // if (isMobileOnly == true) {
                        //     $('#popup_cash_rounding').addClass('show')
                        // }
                        // //$('#popup_cash_rounding').modal('show')
                        // setTimeout(function () {
                        //     showModal('popup_cash_rounding');
                        // }, 100)

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
                        localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
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
                        // this.setState({
                        //     change_amount: change_amount,
                        //     cash_payment: paying_amount,
                        //     after_payment_is: 0
                        // })

                        setChangeAmount(change_amount);
                        setCashPayment(paying_amount);
                        setAfterPaymentIs(0);
                        dispatch(changeReturnAmount({ "cashPayment": paying_amount, "change": parseFloat(paying_amount)-parseFloat(actual_amount) }));
                        //dispatch(changeReturnAmount({ "cashPayment": paying_amount, "change": change_amount }));
                        //make payment while enter amount is greater than total price
                        //finalAdd();
                    

                        //show message if payment amount is greater than total amount

                        // this.freezScreen();
                        // if (isMobileOnly == true) {
                        //     $('#popup_cash_rounding').addClass('show')
                        // }
                        // // $('#popup_cash_rounding').modal('show')

                        // setTimeout(function () {
                        //     showModal('popup_cash_rounding');
                        // }, 100)
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
                        localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
                        //this.gtmEvent(payments);
                        getPaymentDetails();
                        isOrderPaymentComplete(order_id, cash_round);
                    }

                }
            }
            //  global  payments
            else if (isGlobalPay == true) {
                var g_payment = this.props.global_payment ? this.props.global_payment : localStorage.getItem('GLOBAL_PAYMENT_RESPONSE') && localStorage.getItem('GLOBAL_PAYMENT_RESPONSE') !== 'undefined' && JSON.parse(localStorage.getItem('GLOBAL_PAYMENT_RESPONSE'));
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
                    localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
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
                    localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
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

                    localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
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
                    localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
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

                    localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
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
                    localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
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

                    localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
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
                    localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
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
                localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
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

    const getPaymentDetails = () => {
        //var checkList = JSON.parse(localStorage.getItem('CHECKLIST'));
        var paid_amount = 0.0;
        var payments = new Array();
        if (checkList && checkList !== null && checkList.totalPrice !== null) {
            // this.setState({
            //     totalPrice: checkList.totalPrice
            // })
            setTotalPrice(totalPrice);
        }
        if (localStorage.getItem("oliver_order_payments") && checkList && checkList.totalPrice !== null && checkList.totalPrice) {
            var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : new Array();
            getPayments.forEach(paid_payments => {
                paid_amount += parseFloat(paid_payments.payment_amount);
                payments.push({
                    "payment_type": paid_payments.payment_type,
                    "payment_amount": paid_payments.payment_amount,
                });
            });
            setTotalPrice(checkList.totalPrice - paid_amount);
            setCount(payments.length);
            setPaymentsArr(payments);
            setPaidAmount(paid_amount);
            // this.setState({
            //     totalPrice: checkList.totalPrice - paid_amount,
            //     payments: payments,
            //     count: payments.length,
            //     paid_amount: paid_amount
            // })
            if (checkList.totalPrice >= paid_amount) {
                setCalculatorRemainingprice(paidAmount);
            } else {
                setCalculatorRemainingprice(0);
            }
        }
    }

    const setCalculatorRemainingprice = (amount) => {
        set_set_calculator_remaining_amount(amount);
        // this.setState({
        //     set_calculator_remaining_amount: amount,
        // })
    }
    // its check the order paymets complete or not
    const isOrderPaymentComplete = (order_id, cash_round1) => {
        //const { checkList, total_price } = this.state;
        //var checkList = JSON.parse(localStorage.getItem('CHECKLIST'));
        var amountToBePaid = checkList && (typeof checkList !== 'undefined') ? parseFloat(checkList.totalPrice) : 0;
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
    const createOrder = (status) => {
        // this.setState({
        //     isShowLoader: true,
        // });
        setLoading(true);
        setPayment(status);
    }
    const setPayment = (get_order_status, updatedBy = "") => {
        var location_id = localStorage.getItem('Location');
        const activityToCheckout = localStorage.getItem("BACK_CHECKOUT");
        //const { extensionMetaData, cash_payment, change_amount, cash_round, PhoneNumber, Email, FirstName, LastName, Notes, checkList, UDID, user_id, orderType, extensionUpdateCart, AllProductList } = this.state;
        //const { dispatch } = this.props;
        // var checkList = JSON.parse(localStorage.getItem('CHECKLIST'));
        var checkoutList = checkList && checkList.customerDetail && checkList.customerDetail.content;
        var place_order;
        var order_payments = [];
        var newList = [];
        var order_custom_fee = [];
        var order_notes = [];
        var totalPrice = checkList && checkList.totalPrice;
        var order_id = checkList && (typeof checkList.order_id !== "undefined") && checkList.order_id !== null && checkList.order_id !== 0 ? checkList.order_id : 0;
        var oliver_pos_receipt_id = checkList && (typeof checkList.oliver_pos_receipt_id !== "undefined") && checkList.oliver_pos_receipt_id !== 0 ? checkList.oliver_pos_receipt_id : "";
        var status = get_order_status;
        var storeCredit = checkoutList ? checkoutList.StoreCredit : 0;
        var paidAmount = 0;
        var managerData = JSON.parse(localStorage.getItem('user'));
        var manager_name = '';
        var ListItem = null;
        var discountIs = 0;
        var update_local_payment = [];
        var order_meta = [];
        var oliver_order_payments = getOrderPayments(order_id);
        var redeemAmount = checkList && checkList._wc_amount_redeemed ? parseFloat(checkList._wc_amount_redeemed) : 0;
        var productXArray = localStorage.getItem("PRODUCTX_DATA") ? JSON.parse(localStorage.getItem("PRODUCTX_DATA")) : "";
        var checkoutProductList = [];
        var productxAddons = {}
        // add extention field in meta data
        const productX = productXArray && productXArray.length > 0 ? [...new Map(productXArray.map(item =>
            [item['strProductX'], item])).values()] : "";
        //for uniqness we used strProductX instead of product_id

        productX && productX.map((prodX) => {
            //productxAddons[prodX.product_id] = prodX.addons
            var _detail = prodX.details ? prodX.details : [];

            //for addOns 
            if (prodX.addons && prodX.addons.length > 0) {
                _detail = [..._detail, ...getAddonsField(prodX)];
                prodX["details"] = _detail;
            }
            //for Measurement 
            if (prodX.addons && prodX.pricing_item_meta_data) {
                _detail = [..._detail, ...getAddonsField(prodX)];
                prodX["details"] = _detail;
            }
            //for booking
            if (prodX.booking) {
                _detail = [..._detail, ...getBookingField(prodX)];
                prodX["details"] = _detail;
            }
        })

        // add Tip to order notes
        var tipAmount = 0;
        var tipPaymentRefrence = ''
        var tipNoteData = localStorage.getItem('PAYMENT_RESPONSE') ? JSON.parse(localStorage.getItem('PAYMENT_RESPONSE')) : null
        if (tipNoteData && tipNoteData.is_success == true && tipNoteData.content && tipNoteData.content.Tip) {
            tipAmount = tipNoteData.content.Tip && tipNoteData.content.Tip > 0 ? (tipNoteData.content.Tip / 100) : 0
            tipPaymentRefrence = tipNoteData.content.RefranseCode;
            // order_notes.push({
            //     note_id: '',
            //     note: `Tip : ${tipAmount}`,
            //     is_customer_note: 1,
            // })
            var tipPercent = 0;
            if (checkList.totalPrice && checkList.totalPrice != 0 && tipAmount != 0) {
                tipPercent = (tipAmount / checkList.totalPrice) * 100;
            }
            var customfeeData = {
                fee_id: '',
                Title: `Tip (${parseFloat(tipPercent).toFixed(2)}%)`,
                amount: tipAmount,
                Price: tipAmount
            }
            checkList.ListItem.push(customfeeData)

        }
        if (typeof oliver_order_payments !== "undefined") {
            var _paymentNotes = [];
            oliver_order_payments.map(items => {
                var amountForPayType = 0.0;
                if (tipPaymentRefrence && tipPaymentRefrence !== '' && tipPaymentRefrence == items.transection_id) {
                    //Add tip amount into payment amount..
                    paidAmount += parseFloat(items.payment_amount) + parseFloat(tipAmount);
                    amountForPayType = parseFloat(items.payment_amount) + parseFloat(tipAmount);
                } else {
                    paidAmount += parseFloat(items.payment_amount);
                    amountForPayType = parseFloat(items.payment_amount);
                }

                var _paymentDetail = {
                    "Id": (typeof items.Id !== "undefined") ? items.Id : 0,
                    "amount": amountForPayType,
                    "payment_type": "order",
                    "type": items.payment_type,
                    "description": (typeof items.Id !== "undefined") ? items.description : '',
                    "transection_id": items.transection_id && items.transection_id !== 0 ? (items.transection_id).toString() : "",
                    "emv_data": items.emv_data ? items.emv_data : ""
                }
                if (items.payment_date) {
                    _paymentDetail["payment_date"] = items.payment_date;
                }
                order_payments.push(_paymentDetail);

                //  add order notes for payments type and transaction id 
                var transactionStr = items.transection_id && items.transection_id !== 0 ? `(${(items.transection_id).toString()})` : ""
                _paymentNotes.push(`${items.payment_type}${transactionStr}`)

            })
            if (_paymentNotes.length > 0) { }
            order_notes.push({
                note_id: '',
                note: `Payment done with: ${_paymentNotes.join(", ")}`,
                is_customer_note: 0,
                is_extension_note: true
            })
        }

        // add extension's notes for order to order_notes field
        //Need to display into receipt so make the is_customer_note=ture
        if (extensionOrderNote && extensionOrderNote.length) {
            extensionOrderNote.map((itm, ind) => {
                order_notes.push({
                    note_id: '',
                    note: itm,
                    is_customer_note: true,
                    is_extension_note: false
                })
            });

        }





        // update payments for place order
        if (cashRound > 0) {
            var length_is = order_payments.length - 1;
            var update_rounding_amount = parseFloat(totalPrice + cashRound) - parseFloat(paidAmount);
            var new_amount = parseFloat(order_payments[length_is].amount);
            order_payments[length_is].amount = parseFloat(parseFloat(new_amount) + parseFloat(RoundAmount(update_rounding_amount)))
        }

        // update loacal staorage for show payment in rounded amount
        if (order_payments) {
            order_payments.map(items => {
                var _paymentDetail = {
                    "Id": items.Id,
                    "payment_type": items.type,
                    "payment_amount": items.amount,
                    "order_id": order_id,
                    "description": items.description,
                    "emv_data": items.emv_data
                };
                if (items.payment_date) {
                    _paymentDetail["payment_date"] = items.payment_date;
                }
                update_local_payment.push(_paymentDetail)
            })
        }
        ListItem = checkList && checkList.ListItem;
        localStorage.setItem('oliver_order_payments', JSON.stringify(update_local_payment))
        //discountIs = checkList && checkList.discountCalculated ? getDiscountAmount(ListItem) : 0;    note: generate wrong calc when product and cart discount applied
        discountIs = checkList && checkList.discountCalculated ? checkList.discountCalculated : 0; // getDiscountAmount(ListItem)
        if (extensionUpdateCart == true) {
            getExtensionCheckoutList(ListItem);
            if (productX) { getProductxChlidProductTax(productX, AllProductList) }
        } else if (activityToCheckout == "true") {
            setListActivityToCheckout(ListItem)
        } else {
            getCheckoutList(ListItem);
            if (productX) { getProductxChlidProductTax(productX, AllProductList) }
        }
        var SingleTax = checkList && checkList.TaxId && checkList.TaxId.length > 0 ? checkList.TaxId[0] : '';
        var _tax_id = SingleTax ? Object.keys(SingleTax)[0] : 0;
        var _subtotal_tax = 0;
        var _total_tax = 0;
        if (ListItem !== null && ListItem.length > 0) {
            var ListItemLenght = ListItem.length
            ListItem.map((items, i) => {
                if (items.product_id != null) {
                    var _details = [];

                    // fix issue for other tax class other then standerd -------  
                    var _subtotaltax = 0.00;

                    if (items.subtotal_tax) { //&& items.subtotal_tax[0] && items.subtotal_tax[0][_tax_id] ==undefined
                        items.subtotal_tax.map(itm => {
                            for (var k in itm) {
                                _subtotaltax += itm[k];
                            }
                        })
                    }
                    //-----------------------------------------------------------------
                    _subtotal_tax = _subtotaltax
                    _total_tax = _subtotaltax
                    // _subtotal_tax = _tax_id !== 0 ? items.subtotal_tax ? items.subtotal_tax[0] && items.subtotal_tax[0][_tax_id]==undefined ? _subtotaltax : items.subtotal_tax[0] && items.subtotal_tax[0][_tax_id]  : items.subtotaltax ? items.subtotaltax : 0 : 0;
                    // _total_tax = _tax_id !== 0 ? items.total_tax ? items.total_tax[0] && items.total_tax[0][_tax_id]==undefined ? _subtotaltax :items.total_tax[0] && items.total_tax[0][_tax_id] : items.totaltax ? items.totaltax : 0 : 0;

                    var _addOns = productX && productX.filter(prodX => (prodX.product_id == items.product_id && prodX.strProductX == items.strProductX)) //strProductX added in condition if the same product having the diffrent variation 

                    if (items.Sku && items.Sku != '') {
                        _details.push({ "Sku": items.Sku });
                    }
                    if (_addOns && _addOns.length > 0 && _addOns[0].addons) {
                        _details = [..._details, ..._addOns[0].addons];
                    }

                    var _addExtMetaData = ''
                    if (extensionMetaData && extensionMetaData.line_item_id && extensionMetaData.line_item_id == items.product_id) {
                        _addExtMetaData = extensionMetaData.metaData
                    }
                    else if (extensionMetaData && ListItemLenght == i + 1) {
                        _addExtMetaData = extensionMetaData.metaData
                    }
                    var productCost = AllProductList && AllProductList.length > 0 && AllProductList.find(element => element.WPID == ((typeof items.variation_id !== "undefined" && items.variation_id !== 0) ? items.variation_id : (typeof items.product_id !== "undefined") ? items.product_id : items.WPID))
                    newList.push({
                        line_item_id: items.line_item_id,
                        name: items.Title,
                        Sku: items.Sku,
                        product_id: (typeof items.product_id !== "undefined") ? items.product_id : items.WPID,
                        variation_id: _addOns && _addOns[0] && _addOns[0].variation_id && _addOns[0].variation_id !== 0 ? _addOns[0].variation_id : items.variation_id,
                        quantity: items.quantity,
                        subtotal: items.subtotal ? items.subtotal : items.subtotalPrice,
                        subtotal_tax: _subtotal_tax,
                        subtotal_taxes: items.subtotal_tax ? items.subtotal_tax : items.subtotaltax,
                        total: items.total || items.total == 0 ? items.total : items.totalPrice,
                        total_tax: _total_tax,
                        total_taxes: items.total_tax ? items.total_tax : items.totaltax,
                        isTaxable: items.isTaxable,
                        ticket_info: items.ticket_info,
                        is_ticket: items.ticket_status ? items.ticket_status : '',
                        discount_amount: items.discount_amount ? items.discount_amount : 0,
                        // Type: items && items.Type ? items.Type : '', // added Type to check product simple and variation for productX
                        Type: _addOns && _addOns[0] && _addOns[0].Type ? _addOns[0].Type : items && items.Type ? items.Type : '',

                        //  addons_meta_data:items.addons_meta_data  ,
                        //_addOns && _addOns.length > 0 && _addOns[0].addons ? JSON.stringify(_addOns[0].addons) : '',

                        addons_meta_data: items.addons_meta_data ? items.addons_meta_data : productX !== '' ? JSON.stringify(_details) : "",

                        meta_data: items.addons_meta_data ? items.addons_meta_data : _addExtMetaData && _addExtMetaData !== '' ? [_addExtMetaData] : '',
                        details: _details,
                        cost_per_item: productCost && productCost.Cost ? productCost.Cost : 0,
                        psummary: items && items.psummary ? items.psummary : '',
                        //cart_item_discount_amount: items.cart_discount_amount ? items.cart_discount_amount : 0,
                        //individual_discount_amount: items.product_discount_amount ? items.product_discount_amount : 0,
                    })


                }
                if (items.product_id == null) {
                    // fix issue for other tax class other then standerd -------  
                    var _subtotaltax = 0.00;
                    if (items.subtotal_tax) { //&& items.subtotal_tax[0] && items.subtotal_tax[0][_tax_id] ==undefined
                        items.subtotal_tax.map(itm => {
                            for (var k in itm) {
                                _subtotaltax += itm[k];
                            }
                        })
                    }
                    //-----------------------------------------------------------------
                    _subtotal_tax = _subtotaltax
                    _total_tax = _subtotaltax

                    var _cfee_total = items.total || items.total == 0 ? items.total : items.totalPrice;
                    var _cfee_sub_total = items.subtotal ? items.subtotal : items.subtotalPrice;
                    if ((typeof items.Price !== 'undefined') && items.Price !== null) {
                        if (_cfee_total == 0 && items.subtotal_tax.length == 0) {
                            _cfee_total = items.Price;
                        }
                        if (!_cfee_sub_total || typeof _cfee_sub_total == "undefined") {
                            _cfee_sub_total = items.Price;
                        }
                        order_custom_fee.push({
                            fee_id: items.fee_id ? items.fee_id : '',
                            amount: items.Price,
                            note: items.Title,
                            Price: items.Price,
                            TaxClass: items.TaxClass,
                            TaxStatus: items.TaxStatus,
                            Title: items.Title,
                            Sku: items.Sku,
                            after_discount: items.after_discount ? items.after_discount : 0,
                            cart_after_discount: items.cart_after_discount,
                            cart_discount_amount: items.cart_discount_amount,
                            discount_amount: items.discount_amount,
                            discount_type: items.discount_type,
                            excl_tax: items.excl_tax,
                            incl_tax: items.incl_tax,
                            isTaxable: items.isTaxable,
                            new_product_discount_amount: items.new_product_discount_amount,
                            old_price: items.old_price,
                            product_after_discount: items.product_after_discount,
                            product_discount_amount: items.product_discount_amount,
                            quantity: items.quantity,
                            subtotal: _cfee_sub_total,
                            subtotal_tax: _subtotal_tax,
                            subtotal_taxes: items.subtotal_tax ? items.subtotal_tax : items.subtotaltax,
                            total: _cfee_total,
                            total_tax: _total_tax,
                            total_taxes: items.total_tax ? items.total_tax : items.totaltax,
                        })
                    } else {
                        order_notes.push({
                            note_id: items.id ? items.id : '',
                            note: items.Title,
                            is_customer_note: items.extention_custom_id ? 0 : 1
                        })
                    }
                }
            })
        }
        if (set_order_notes.length !== 0) {
            var note = set_order_notes[0]
            order_notes.push({
                note_id: '',
                note: note.note,
                is_customer_note: note.is_customer_note,
                is_extension_note: note.is_extension_note
            })
        }
        var Index = [];
        newList.map(calc => {
            // if (calc.total_taxes && calc.total_taxes.length > 0) {  
            //Checking each product for isTaxable. 01/08/2022
            if (calc.total_taxes && calc.total_taxes.length > 0 && calc.hasOwnProperty('isTaxable') && calc.isTaxable == true) {
                calc.total_taxes.map(ids => {
                    Index.push(ids)
                })
            }
        })
        order_custom_fee.map(calc => {
            if (calc.total_taxes && calc.total_taxes.length > 0) {
                calc.total_taxes.map(ids => {
                    Index.push(ids)
                })
            }
        })
        var distinctTaxIdsObject = new Object();
        Index.map(function (element, index) {
            var getObjectKey = Object.keys(element)[0];
            var getObjectValues = Object.values(element)[0];
            if (distinctTaxIdsObject.hasOwnProperty(getObjectKey)) {
                var existingValue = parseFloat(distinctTaxIdsObject[getObjectKey]);
                distinctTaxIdsObject[getObjectKey] = existingValue + parseFloat(getObjectValues);
            } else {
                distinctTaxIdsObject[getObjectKey] = getObjectValues;
            }
        });
        var distinctTaxIdsArray = new Array();
        for (var key in distinctTaxIdsObject) {
            var obj = new Object();
            obj[key] = distinctTaxIdsObject[key];
            distinctTaxIdsArray.push(obj)
        }
        if (managerData && managerData.display_name !== " " && managerData.display_name !== 'undefined') {
            manager_name = managerData.display_name;
        } else {
            manager_name = managerData !== null ? managerData.user_email : ''
        }

        //Updating the productX data from LineItem Data to calculate tax, total and subtotal;S
        if (productX && newList && newList.length > 0) {



            productX.map(_prodx => {
                var findProdxItems = newList.filter(_Item => (parseInt(_Item.product_id) == parseInt(_prodx.product_id)));

                var productXItemPrice = _prodx.cardSubToal
                var productXItemTax = _prodx.cardtax
                //     var divContainer= document.createElement("div");   //  ------------ html string into plain text 
                //     divContainer.innerHTML = productXItemPrice;                
                //    var filterCardPrice =  divContainer.textContent || divContainer.innerText || "";
                //   var priceNum = filterCardPrice.replace(/\$/g,'');
                //   var priceNum = parseFloat(priceNum.replace(/,/g, ''));

                if (findProdxItems && findProdxItems.length > 0) {
                    _prodx['SKu'] = findProdxItems[0].Sku;
                    _prodx['line_tax_data'] = [{ subtotal: findProdxItems[0].subtotal_taxes }, { total: findProdxItems[0].total_taxes }];
                    _prodx['line_subtotal'] = productXItemPrice;
                    _prodx['line_subtotal_tax'] = parseFloat(productXItemTax);
                    _prodx['line_total'] = findProdxItems[0].total;
                    _prodx['line_tax'] = findProdxItems[0].total_tax;
                    _prodx['line_subtotal_taxes'] = findProdxItems[0].subtotal_taxes;
                    _prodx['line_total_taxes'] = findProdxItems[0].total_taxes;
                    _prodx['quantity'] = findProdxItems[0].quantity;
                    _prodx['psummary'] = findProdxItems[0].psummary;
                    //In the case of inclusive tax minus the tax from the subtotal 28-07-20022
                    if (typeOfTax() == "incl")
                        _prodx['line_subtotal'] = _prodx.cardSubToal - _prodx.cardtax;

                }
            })
            // removing simpleproductX and variationProductX type from productX to show data into wooCommerce 
            newList.map((removeProductxItems, i) => {
                productX.map((prod, index) => {
                    if ((removeProductxItems.Type == 'simple' || removeProductxItems.Type == 'variable') && removeProductxItems.product_id == prod.product_id) {
                        //This field is added to dispaly the simple and variation productX measurement data 
                        removeProductxItems["pricing_item_meta_data"] = prod.pricing_item_meta_data ? prod.pricing_item_meta_data : "";
                        //for Measurement 
                        if (prod && prod.pricing_item_meta_data) {
                            removeProductxItems["details"] = getAddonsField(prod);
                        }
                        productX.splice(index, 1);
                    }
                })
            })

            localStorage.setItem("PRODUCTX_DATA", JSON.stringify(productX))
        }
        checkoutProductList = newList;
        //Removing the productX data from the LineItem because we are passing ProductX data in saperate variavle i.e. productx_line_items
        if (checkoutProductList && checkoutProductList.length > 0 && productX && productX.length > 0) {
            productX.map(prod => {
                checkoutProductList.map((removeProductxItems, index) => {
                    prod["psummary"] = removeProductxItems.psummary;
                    if (removeProductxItems.Type !== 'simple' && removeProductxItems.Type !== 'variable' && removeProductxItems.product_id == prod.product_id) {
                        checkoutProductList.splice(index, 1);
                    }
                })
            })
        }
        //Geting the all product of the order and their discount applied on them to send into meta-data, this will used when reopen the park sale
        var productDiscout = []
        var checklist = localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST'));
        const cartProducts = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
        const CartDiscountAmount = localStorage.getItem("CART") ? JSON.parse(localStorage.getItem("CART")) : '';

        if (cartProducts && cartProducts.length > 0) {
            // sent total_subTotal_fileds to use in activity view  incase of park and lay-away  
            var subTotal_Total_sent_to_part = {
                'total_subTotal_fileds': {
                    subTotal: checklist && checklist.subTotal ? checklist.subTotal : 0,
                    totalPrice: checklist && checklist.totalPrice ? checklist.totalPrice : 0
                }
            }
            productDiscout && productDiscout.push(subTotal_Total_sent_to_part)

            // var discount_amount = 0
            cartProducts.map((item, index) => {
                if (item.product_id) {

                    var _product = AllProductList && AllProductList.length > 0 && AllProductList.find(element => element.WPID == ((typeof item.variation_id !== "undefined" && item.variation_id !== 0) ? item.variation_id : (typeof item.product_id !== "undefined") ? item.product_id : item.WPID))
                    // if (item.product_id && item.variation_id) {
                    // discount_total += item.cart_discount_amount 
                    productDiscout.push({
                        // order_notes: (typeof order_notes !== "undefined") && order_notes.length > 0 ? order_notes : [],
                        product_id: item.product_id,
                        variation_id: item.variation_id ? item.variation_id : 0,
                        product_discount_amount: item.product_discount_amount,
                        cart_discount_amount: item.cart_discount_amount,
                        discount_type: item.discount_type,
                        after_discount: item.after_discount,
                        discount_amount: item.discount_amount,
                        cart_after_discount: item.cart_after_discount,
                        product_after_discount: item.product_after_discount,
                        ticket_status: item.ticket_status,
                        tick_event_id: item.tick_event_id,
                        ticket_info: item.ticket_info,
                        product_ticket: item.product_ticket,
                        new_product_discount_amount: item.new_product_discount_amount,
                        TaxStatus: item.TaxStatus,
                        tcForSeating: item.tcForSeating,
                        TaxClass: item.TaxClass,
                        old_price: item.old_price,
                        Price: item.Price,
                        Title: item.Title,
                        Sku: item.Sku,
                        quantity: item.quantity,
                        discountCart: CartDiscountAmount,
                        isTaxable: item.isTaxable,
                        //Sort description length and html tag issue
                        shortDescription: _product && _product.ShortDescription ? _product.ShortDescription : "",
                        // subTotal: checklist && checklist.subTotal ? checklist.subTotal : 0,
                        // totalPrice: checklist && checklist.totalPrice ? checklist.totalPrice : 0
                        psummary: item.psummary
                    });
                }
            })
        }


        // get system ip, system id and device type 
        var deviceType = ''
        var deviceIP = ''
        var deviceName = ''
        if (isMobileOnly == true) {
            deviceType = 'Mobile'
        } else if (isTablet == true) {
            deviceType = 'Tablet'
        } else {
            deviceType = 'Desktop'
        }
        // $.getJSON("https://jsonip.com/?callback=?").then((data) => {
        //     deviceIP = data.ip
        //     place_order.device_ip = data.ip
        // });
        if (localStorage.getItem('IPAddress')) {
            deviceIP = localStorage.getItem('IPAddress')
        }
        var _cashPayment=0;
        var _changeAmount=0;
        if ((respChangeAmount && respChangeAmount.status == STATUSES.IDLE && respChangeAmount.is_success && respChangeAmount.data)) {
            //console.log("--respChangeAmount--" + JSON.stringify(respChangeAmount));
            _cashPayment=respChangeAmount.data.cashPayment;
            _changeAmount=respChangeAmount.data.change;
        }
        // push order_custom_fee in discount meta data
        productDiscout && productDiscout.push({ order_custom_fee: order_custom_fee })
        productDiscout && productDiscout.push({ order_notes: (typeof order_notes !== "undefined") && order_notes.length > 0 ? order_notes : [] })
        productDiscout && productDiscout.push({ taxType: typeOfTax() })
        var selectedGroupSale = localStorage.getItem('selectedGroupSale') ? JSON.parse(localStorage.getItem('selectedGroupSale')) : null;
        var couponDetail = localStorage.getItem('couponDetail') ? JSON.parse(localStorage.getItem('couponDetail')) : null;
        localStorage.removeItem('couponDetail');
        localStorage.removeItem("couponApplied");
        order_meta.push({
            "manager_id": localStorage.getItem('demoUser') && localStorage.getItem('demoUser') == "true" ? localStorage.getItem('VisiterUserID') : localStorage.getItem('user') !== null && localStorage.getItem('user') !== undefined ? JSON.parse(localStorage.getItem('user')).user_id : "",
            "manager_name": localStorage.getItem('demoUser') && localStorage.getItem('demoUser') == "true" ? localStorage.getItem('VisiterUserEmail') : manager_name,
            "location_id": location_id,
            "register_id": localStorage.getItem('register'),

            "_order_oliverpos_group_name": selectedGroupSale && selectedGroupSale.GroupName,
            "_order_oliverpos_group_slug": selectedGroupSale && selectedGroupSale.Slug,
            "_order_oliverpos_group_qrcode": selectedGroupSale && selectedGroupSale.QRCode,
            "_order_oliverpos_group_label": selectedGroupSale && selectedGroupSale.Label,
            "cash_rounding": cashRound,
            "refund_cash_rounding": 0,
            "_order_oliverpos_extension_data": orderType,
            "_wc_points_logged_redemption": checkList && checkList._wc_points_logged_redemption ? checkList._wc_points_logged_redemption : "",
            // "_wc_amount_redeemed":  checkList && checkList._wc_amount_redeemed ? checkList._wc_amount_redeemed:"",
            "_wc_points_redeemed": checkList && checkList._wc_points_redeemed ? checkList._wc_points_redeemed : "",
            "_order_oliverpos_product_discount_amount": productDiscout,
            // "_order_oliverpos_order_custom_fee" : order_custom_fee
            "_order_oliverpos_park_sale_notes": (typeof order_notes !== "undefined") && order_notes.length > 0 ? order_notes : [],
            "_order_oliverpos_cash_change": { "cashPayment": _cashPayment, "change": _changeAmount },
            //"_order_oliverpos_addons" : productxAddons && productxAddons!== {} ? JSON.stringify(productxAddons) : {}      
            "_order_oliverpos_coupon": couponDetail
        })

        var loginUser = JSON.parse(localStorage.getItem("user"));
        var CustomerDetail = JSON.parse(localStorage.getItem('AdCusDetail'));
        var ShippingAddress = CustomerDetail && CustomerDetail.content && CustomerDetail.content.customerAddress ? CustomerDetail.content.customerAddress.find(Items => Items.TypeName == "shipping") : '';

        //If shipping address of the customer is blank then billind address will be shown as shipping address START
        if (ShippingAddress && ShippingAddress.City == "" && ShippingAddress.State == "" && ShippingAddress.Country == "" && ShippingAddress.PostCode == "") {
            var BillingAddress = CustomerDetail && CustomerDetail.content && CustomerDetail.content.customerAddress ? CustomerDetail.content.customerAddress.find(Items => Items.TypeName == "billing") : '';
            if (BillingAddress && BillingAddress.City != "" && BillingAddress.Country != "") {
                ShippingAddress = BillingAddress;
            }
        }
        //END
        place_order = {
            order_id: order_id,
            oliver_pos_receipt_id: oliver_pos_receipt_id,
            status: status,
            customer_note: Notes ? Notes : 'Add Note',
            customer_id: CustomerDetail && CustomerDetail.WPId ? CustomerDetail.WPId : 0,
            order_tax: checkList && checkList.tax ? checkList.tax : 0,
            order_total: (status == 'park_sale' || status == 'lay_away') ? checkList && checkList.totalPrice + tipAmount : checkList && parseFloat(RoundAmount(checkList.totalPrice + cashRound + tipAmount)),
            order_discount: parseFloat(discountIs) + redeemAmount,
            tax_id: _tax_id,
            tax_ids: distinctTaxIdsArray,
            //line_items: newList,
            line_items: checkoutProductList,
            productx_line_items: productX, //Sending the ProductX data.
            customer_email: CustomerDetail && CustomerDetail.Email ? CustomerDetail.Email : '',
            billing_address: [{
                first_name: FirstName ? FirstName : '',
                last_name: LastName ? LastName : '',
                company: "",
                email: Email ? Email : '',
                phone: PhoneNumber ? PhoneNumber : '',
                address_1: loginUser ? loginUser.shop_address1 : "", // Street_Address ? Street_Address : '',
                address_2: loginUser ? loginUser.shop_address2 : "", // Street_Address2 ? Street_Address2 : '',
                city: loginUser ? loginUser.shop_city : "", //  city ? city : '',
                state: loginUser ? loginUser.shop_state : "", //  "",
                postcode: loginUser ? loginUser.shop_postcode : "", //  Pincode ? Pincode : '',
                country: loginUser ? loginUser.shop_country_full_Name : ""
            }],
            shipping_address: [{
                first_name: CustomerDetail && CustomerDetail.FirstName ? CustomerDetail.FirstName : "", // FirstName ? FirstName : '',
                last_name: CustomerDetail && CustomerDetail.LastName ? CustomerDetail.LastName : "", //  LastName ? LastName : '',
                company: "",
                email: Email ? Email : '',
                phone: PhoneNumber ? PhoneNumber : '',
                address_1: ShippingAddress ? ShippingAddress.Address1 : "", // CustomerDetail. Street_Address ? Street_Address : '',
                address_2: ShippingAddress ? ShippingAddress.Address2 : "", //  Street_Address2 ? Street_Address2 : '',
                city: ShippingAddress ? ShippingAddress.City : "", // city ? city : '',
                state: ShippingAddress ? ShippingAddress.State : "", // ,
                postcode: ShippingAddress ? ShippingAddress.PostCode : "",  // Pincode ? Pincode : '',
                country: ShippingAddress ? ShippingAddress.Country : "", // 
            }],
            order_custom_fee: order_custom_fee,
            order_notes: (typeof order_notes !== "undefined") && order_notes.length > 0 ? order_notes : [],
            order_payments: order_payments,
            order_meta: order_meta,
            Udid: get_UDid(),
            device_type: deviceType,
            // device_ip: deviceIP,
            device_id: deviceName,
            _currentTime: moment().format(isSafari ? Config.key.DATETIME_FORMAT_SAFARI : 'YYYY-MM-DD, h:mm:ss a')  //date used for cloud print
        }
        localStorage.setItem('placedOrderList', JSON.stringify(newList));
        // add cash rounding amount in localstorage for android and ios section
        // get tax name for android and ios section
        var TotalTaxByName = getTotalTaxByName('completecheckout', productX);
        if (localStorage.getItem('CHECKLIST')) {
            //var checklist = JSON.parse(localStorage.getItem('CHECKLIST'));
            if (productX && productX.length > 0) {
                checklist.ListItem.map(item => {
                    var sub_tilte = productxArray(item.product_id, AllProductList, 'setPayment');
                    if (sub_tilte && sub_tilte !== "") {
                        item['productx_subtitle'] = sub_tilte;
                    }
                })
            }
            checklist['cash_rounding'] = cashRound;
            checklist['servedby'] = manager_name;
            checklist['multiple_tax'] = TotalTaxByName;
            //added into checklist for android print receipt
            checklist['_order_oliverpos_cash_change'] = { "cashPayment": _cashPayment, "change": _changeAmount };

            localStorage.setItem('CHECKLIST', JSON.stringify(checklist))
        }
        //------------------------------------

        setTimeout(() => {
            localStorage.setItem("GTM_ORDER", JSON.stringify(place_order));
            if (status.includes("park_sale") || status.includes("lay_away")) {
                setTimeout(() => {
                    dispatch(save(place_order, 2, updatedBy));
                }, 500);
            } else {
                dispatch(save(place_order, 1));
            }
            //Android Call----------------------------
            // androidDisplayScreen("Total", place_order.order_total, 0, "finalcheckout");
            //androidDisplayScreen("Total", place_order.order_total, 0, "cart");
            //-----------------------------------------

        }, 1000);
    }
    const handleChange = (e) => {
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
        if (e.target.value === '' || re.test(e.target.value)) {
            const { value } = e.target;
            setPaidAmount(value);
            //this.props.normapNUM(value);
            this.setState({
                paidAmount: '',
                paidAmountStatus: true,
                temporary_vaule: value
            })
        }
    }
    //its used for get the order payments
    const getOrderPayments = (order_id) => {
        if (localStorage.getItem("oliver_order_payments")) {
            var paid_amount = 0;
            var payments = new Array();

            JSON.parse(localStorage.getItem("oliver_order_payments")).forEach(paid_payments => {
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
    const pay_amount_cash = (item) => {
        if (item.toLowerCase() === "cash") {
            toggleNumberPad();
        }
        else { pay_amount(item); }
    }
    var paymentTypeName = localStorage.getItem("PAYMENT_TYPE_NAME") ? JSON.parse(localStorage.getItem("PAYMENT_TYPE_NAME")) : [];
    //Arranging array to put cash and card type in the first and the second 
    if (paymentTypeName && paymentTypeName.length > 0) {
        var card = paymentTypeName.find(a => a.Name.toLowerCase() === "card");
        var cash = paymentTypeName.find(a => a.Name.toLowerCase() === "cash");
        paymentTypeName = paymentTypeName.filter(a => a.Name.toLowerCase() != "cash" && a.Name.toLowerCase() != "card");
        if (card && typeof card != "undefined")
            paymentTypeName.unshift(card);
        if (cash && typeof cash != "undefined")
            paymentTypeName.unshift(cash);
    }

    return (<React.Fragment>
        {loading === true ? <LoadingModal></LoadingModal> : null}
        <div className="checkout-wrapper">
            <LeftNavBar ></LeftNavBar>
            <Header ></Header>
            <div className="cart">
                <div className="checkout-cart-header">
                    {get_customerName() == null ?
                        <button onClick={() => addCustomer()}>Add Customer to Order</button> :
                        <div className="cart-customer">
                            <div className="avatar">
                                <img src={person} alt="" />
                            </div>
                            <div className="text-col">
                                <p className="style1">{get_customerName().Name}</p>
                                <p className="style2">{get_customerName().Email}</p>
                            </div>
                        </div>
                    }
                </div>
                <CartListBody setValues={setValues}></CartListBody>
                <div className="footer">
                    <div className="totals">

                        <div className="row">
                            <p>Subtotal</p>
                            <p><b>${<NumericFormat value={subTotal} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</b></p>
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

                        {taxes !== 0 ?
                            <div className="row">
                                <p>Taxes {typeOfTax() == 'incl' ? LocalizedLanguage.inclTax : LocalizedLanguage.exclTax}</p>
                                <p><b>${<NumericFormat value={taxes} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</b></p>
                            </div> : null}
                        <div className="row">
                            <p><b>{LocalizedLanguage.total}</b></p>
                            <p><b>${<NumericFormat value={total} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</b></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="checkout-body">
                <button id="balanceButton" className="balance-container" onClick={() => toggleShowPartialPayment()}>
                    <div className="row">
                        <p className="style1">Balance Due</p>
                        <p className="style2">${(parseFloat(balance) - (paymentsArr && paymentsArr.length > 0 ? (paymentsArr.reduce((a, v) => a = parseFloat(a) + parseFloat(v.payment_amount), 0)) : 0)).toFixed(2)}</p>
                    </div>
                    {paymentsArr && paymentsArr.map(p => {
                        return <div className="row">
                            <p className="style3">{p.payment_type}</p>
                            <p className="style3">${(parseFloat(p.payment_amount)).toFixed(2)}</p>
                            {/* -(paymentsArr && paymentsArr.length>0 ?(paymentsArr.reduce((a,v) =>  a = parseFloat( a) + parseFloat(v.payment_amount) , 0 )):0) */}
                        </div>
                    })}
                    {/* <div className="row">
                        <p className="style3">Card</p>
                        <p className="style3">$60.00</p>
                    </div>
                    <div className="row">
                        <p className="style3">Cash</p>
                        <p className="style3">$20.00</p>
                    </div> */}
                    {paymentsArr && paymentsArr.length > 0 && <div className="row">
                        <p className="style4">Total Paid</p>
                        <p className="style4">${parseFloat((paymentsArr.reduce((a, v) => a = parseFloat(a) + parseFloat(v.payment_amount), 0))).toFixed(2)}</p>
                    </div>}

                </button>
                <p className="style1">Click to make a partial payment</p>
                <p className="style2">Quick Split</p>
                <div className="button-row">
                    <button onClick={()=>showPartial(2)}>1/2</button>
                    <button onClick={()=>showPartial(3)}>1/3</button>
                    <button onClick={()=>showPartial(4)}>1/4</button>
                </div>
                <div className="button-row">
                    <button>By Product</button>
                    <button>By People</button>
                </div>
                <p className="style2">Customer Payment Types</p>
                <p className="style3">Please add a customer to make customer payment types available</p>
                <div className="button-row">
                    <button disabled={get_customerName() == null ? true : false}>Layaway</button>
                    <button disabled={get_customerName() == null ? true : false}>Store Credit ($24.99)</button>
                </div>

                <div className="payment-types">
                    <p>Payment Types</p>
                    <div className="button-container">
                        {
                            paymentTypeName && paymentTypeName.length > 0 && paymentTypeName.map(payment => {
                                return <button style={{ backgroundColor: payment.ColorCode, borderColor: payment.ColorCode }} key={payment.Id} onClick={() => pay_amount_cash(payment.Code)}>
                                    {payment.Name}
                                    {/* <img src="../Assets/Images/SVG/spongebob-squarepants-2.svg" alt="" /> */}
                                </button>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
        {isShowNumberPad ? <NumberPad isShow={isShowNumberPad} toggleNumberPad={toggleNumberPad} pay_by_cash={pay_by_cash} amount={(parseFloat(balance) - (paymentsArr && paymentsArr.length > 0 ? (paymentsArr.reduce((a, v) => a = parseFloat(a) + parseFloat(v.payment_amount), 0)) : 0)).toFixed(2)} getRemainingPriceForCash={getRemainingPriceForCash} ></NumberPad> : null}
        {isShowPartialPayment ? <PartialPayment isShow={isShowPartialPayment} toggleShowPartialPayment={toggleShowPartialPayment} amount={paidAmount} pay_partial={pay_partial} getRemainingPrice={getRemainingPrice} partialType={partialType}></PartialPayment> : null}
    </React.Fragment>)
}
export default Checkout