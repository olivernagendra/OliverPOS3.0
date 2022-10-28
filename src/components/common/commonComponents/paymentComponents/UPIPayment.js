import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isMobileOnly } from "react-device-detect";
// import { LoadingModal } from '../LoadingModal';
import Config from '../../../../Config';
import { v4 as uuidv4 } from 'uuid';
import ActiveUser from '../../../../settings/ActiveUser';
import LocalizedLanguage from '../../../../settings/LocalizedLanguage';
import { make_payconiq_payment, check_payconiq_pay_status, cancel_payconiq_payment } from './paymentSlice'
import STATUSES from '../../../../constants/apiStatus';
import IconDarkBlue from '../../../../assets/images/svg/X-Icon-DarkBlue.svg';
const UPIPayments = (props) => {
    const dispatch = useDispatch();
    const [activeDisplayStatus, setactiveDisplayStatus] = useState(false);
    const [popupClass, setpopupClass] = useState('');
    const [msgColor, setmsgColor] = useState('red');
    const [UPI_error_msg, setUPI_error_msg] = useState('');
    const [barcodeURl, setbarcodeURl] = useState('');
    const [uniqueID, setuniqueID] = useState(uuidv4());
    const [payconiq_payment_cancel_url, setpayconiq_payment_cancel_url] = useState('');
    const [payconiq_current_status, setpayconiq_current_status] = useState('');
    const [pageSatus, setpageSatus] = useState(true);
    const [minutesLeft, setminutesLeft] = useState(0);
    const [secondsLeft, setsecondsLeft] = useState(0);
    const [sessionMsg, setsessionMsg] = useState('');
    const [cancleTrancationCount, setcancleTrancationCount] = useState(0);
    const [payconiqRefundError, setpayconiqRefundError] = useState(0);
    const [timerValue, setTmerValue] = useState('');
    const [checkStatus_Interval, setCheckStatus_Interval] = useState('');
    const [countdown_Interval, setCountdown_Interval] = useState('');
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleUPIPayment && props.toggleUPIPayment();
        }
    }
    const toggleUPIPayment_byCancel = () => {
        clearInterval(checkStatus_Interval);
        clearInterval(countdown_Interval);
        props.toggleUPIPayment();

    }
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         activeDisplayStatus: false,
    //         popupClass: '',
    //         loading: false,
    //         msgColor: 'red',
    //         UPI_error_msg: '',
    //         barcodeURl: '',
    //         uniqueID: null,
    //         payconiq_payment_cancel_url: '',
    //         payconiq_current_status: '',
    //         pageSatus: true,
    //         minutesLeft: 0,
    //         secondsLeft: 0,
    //         sessionMsg: '',
    //         cancleTrancationCount:0
    //         // payconiq_payment_cancel_url: 'https://api.ext.payconiq.com/v3/payments/f23d8c4362936d00650987e6'
    //     }

    // }

    const hideTab = (st) => {
        setUPI_error_msg('');
        setuniqueID(uuidv4());
        setsessionMsg('');
        // this.setState({ UPI_error_msg: '', uniqueID: uuidv4(), sessionMsg: '' })
        // setTimeout(() => {
        if (props.type == 'refund') {
            // check if product selected or not
            var refundItemsQuantity = []
            // $(".refunndingItem").each(function () {
            //     var item_id = $(this).attr('data-id');
            //     var quantity = parseInt($(`#counter_show_${item_id}`).text());
            //     refundItemsQuantity.push({
            //         'Quantity': quantity,
            //     });
            // });
            // if (refundItemsQuantity.length > 0) {
            //     this.setState({
            //         activeDisplayStatus: st,
            //     })
            // }
            pay_amount(props.code)


        } else {
            // call API to make payConiq payment request
            setactiveDisplayStatus(st);
            // this.setState({
            //     activeDisplayStatus: st,
            // })
            setTimeout(() => {
                make_payconiq_payment_request();
            }, 1000);
        }
        // }, 2000);
    }
    const closePopup = () => {
        setactiveDisplayStatus(false);
        // this.setState({ activeDisplayStatus: false })
    }
    useEffect(() => {
        if (props.type && props.type === "refund") {
            props.pay_amount(props.code)
        }
        else {
            make_payconiq_payment_request()
        }
    }, [])
    const [respcheck_payconiq_pay_status] = useSelector((state) => [state.check_payconiq_pay_status])
    useEffect(() => {
        if (respcheck_payconiq_pay_status && respcheck_payconiq_pay_status.status == STATUSES.IDLE && respcheck_payconiq_pay_status.is_success) {


            if (respcheck_payconiq_pay_status) {
                if (respcheck_payconiq_pay_status.error) {
                    setUPI_error_msg(respcheck_payconiq_pay_status.error);
                    // this.setState({
                    //     UPI_error_msg: nextprops.payconiq_payment.error
                    // })
                    // set the current trnasaction status, Used for APP Command "TransactionStatus"               
                    localStorage.setItem("CurrentTransactionStatus", JSON.stringify({ "paymentType": props.code, "status": "cancelled" }))

                } else if (respcheck_payconiq_pay_status.data && respcheck_payconiq_pay_status.data.content) {
                    var _payconiq_status_res = respcheck_payconiq_pay_status.data.content
                    var _payconiq_status = _payconiq_status_res && _payconiq_status_res.Status ? _payconiq_status_res.Status : ''
                    setUPI_error_msg('');
                    setpayconiq_current_status(_payconiq_status);
                    // this.setState({
                    //     UPI_error_msg: '',
                    //     payconiq_current_status: _payconiq_status
                    // })
                    if ((_payconiq_status == "SUCCEEDED") && pageSatus == true) {
                        clearInterval(checkStatus_Interval)
                        clearInterval(countdown_Interval);

                        setpageSatus(false);
                        setUPI_error_msg('');
                        setpayconiq_current_status(_payconiq_status);
                        setactiveDisplayStatus(false);
                        setpayconiq_payment_cancel_url('');
                        // this.setState({
                        //     pageSatus: false,
                        //     UPI_error_msg: '',
                        //     payconiq_current_status: _payconiq_status,
                        //     activeDisplayStatus: false,
                        //     payconiq_payment_cancel_url: ''
                        // })
                        var payConiqPayAmount = 0;
                        if (_payconiq_status_res.Amount && _payconiq_status_res.Amount !== "" && parseFloat(_payconiq_status_res.Amount) > 0) {
                            payConiqPayAmount = parseFloat(_payconiq_status_res.Amount) / 100
                        }
                        props.pay_amount(props.code, 0, '', '', payConiqPayAmount)
                        // set the current trnasaction status, Used for APP Command "TransactionStatus"               
                        localStorage.setItem("CurrentTransactionStatus", JSON.stringify({ "paymentType": props.code, "status": "completed" }))

                    }
                    if ((_payconiq_status == "CANCELLED")) {
                        setUPI_error_msg('Payment Canceled !');
                        setpageSatus(false);
                        setpayconiq_payment_cancel_url('');
                        // this.setState({
                        //     UPI_error_msg: 'Payment Canceled !',
                        //     pageSatus: false,
                        //     payconiq_payment_cancel_url: ''
                        // })
                        clearInterval(checkStatus_Interval)
                        clearInterval(countdown_Interval);
                        // set the current trnasaction status, Used for APP Command "TransactionStatus"               
                        localStorage.setItem("CurrentTransactionStatus", JSON.stringify({ "paymentType": props.code, "status": "cancelled" }))

                    }

                    // regenerate QR code in case of status 'EXPIRED' and clear status interval
                    if (_payconiq_status == 'EXPIRED') {
                        clearInterval(checkStatus_Interval)
                        clearInterval(countdown_Interval);
                        setUPI_error_msg('Session Expired');
                        setpayconiq_payment_cancel_url('');
                        // this.setState({
                        //     UPI_error_msg: 'Session Expired',
                        //     payconiq_payment_cancel_url: '',
                        //     //barcodeURl: ''
                        // })
                        dispatch(check_payconiq_pay_status(null))
                        // set the current trnasaction status, Used for APP Command "TransactionStatus"               
                        localStorage.setItem("CurrentTransactionStatus", JSON.stringify({ "paymentType": props.code, "status": "cancelled" }))

                    }
                }
            }

        }
    }, [respcheck_payconiq_pay_status]);
    //----
    const [respmake_payconiq_payment] = useSelector((state) => [state.make_payconiq_payment])
    useEffect(() => {
        if (respmake_payconiq_payment && respmake_payconiq_payment.status == STATUSES.IDLE && respmake_payconiq_payment.is_success) {

            if (respmake_payconiq_payment) {
                if (respmake_payconiq_payment.error) {
                    clearInterval(checkStatus_Interval)
                    clearInterval(countdown_Interval);
                    setUPI_error_msg(respmake_payconiq_payment.error);
                    // this.setState({
                    //     UPI_error_msg: nextprops.payconiq_payment.error,
                    //     payconiq_payment_cancel_url: ''
                    // })
                }
                else if (respmake_payconiq_payment.data && respmake_payconiq_payment.data.content) {
                    // success case
                    var payconiq_response = respmake_payconiq_payment.data.content
                    if (payconiq_response && payconiq_response.paymentId && payconiq_response._links) {
                        // set barcode url from UPIPayment API response  
                        var payconiq_response_links = payconiq_response._links
                        var barcode_url = payconiq_response_links.qrcode && payconiq_response_links.qrcode.href
                        var cancel_payconiq_url = payconiq_response_links.cancel && payconiq_response_links.cancel.href

                        setbarcodeURl(barcode_url);
                        setpayconiq_payment_cancel_url(cancel_payconiq_url);
                        setUPI_error_msg('');
                        setpayconiq_current_status('PENDING');
                        // this.setState((prevState) => ({
                        //     barcodeURl: barcode_url ? barcode_url : prevState.barcodeURl,
                        //     payconiq_payment_cancel_url: cancel_payconiq_url ? cancel_payconiq_url : prevState.payconiq_payment_cancel_url,
                        //     UPI_error_msg: '',
                        //     payconiq_current_status: 'PENDING'
                        //     // pageSatus : true
                        // }));
                        payconiq_expires_time_diff(payconiq_response.expiresAt, payconiq_response.createdAt)
                        dispatch(make_payconiq_payment(null))
                        // set the current trnasaction status, Used for APP Command "TransactionStatus"               
                        localStorage.setItem("CurrentTransactionStatus", JSON.stringify({ "paymentType": props.code, "status": "processing" }))

                    }
                }
            }
        }
    }, [respmake_payconiq_payment]);

    //--
    const [respcancel_payconiq_payment] = useSelector((state) => [state.cancel_payconiq_payment])
    useEffect(() => {
        if (respcancel_payconiq_payment && respcancel_payconiq_payment.status == STATUSES.IDLE && respcancel_payconiq_payment.is_success) {
            if (respcancel_payconiq_payment) {
                if (respcancel_payconiq_payment.data) {
                    clearInterval(checkStatus_Interval)
                    clearInterval(countdown_Interval);

                    setUPI_error_msg('');
                    setpayconiq_payment_cancel_url('');
                    setactiveDisplayStatus(false);
                    setbarcodeURl('');
                    setpayconiq_current_status('PENDING');

                    // this.setState({
                    //     UPI_error_msg: '',
                    //     payconiq_payment_cancel_url: '',
                    //     activeDisplayStatus: false,
                    //     barcodeURl: '',
                    //     payconiq_current_status: 'PENDING'
                    // })
                    // set the current trnasaction status, Used for APP Command "TransactionStatus"               
                    localStorage.setItem("CurrentTransactionStatus", JSON.stringify({ "paymentType": props.code, "status": "cancelled" }))

                    // window.location = '/checkout';
                    dispatch(cancel_payconiq_payment(null))
                } else if (respcancel_payconiq_payment.error) {
                    setUPI_error_msg(respcancel_payconiq_payment.error);
                    // this.setState({
                    //     UPI_error_msg: nextprops.cancel_payconiq_payment.error,
                    //     // payconiq_payment_cancel_url : ''
                    // })
                }
            }
        }
    }, [respcancel_payconiq_payment]);

    useEffect(() => {

        if (payconiqRefundError && payconiqRefundError !== '') {
            setUPI_error_msg(payconiqRefundError);
            setpayconiq_payment_cancel_url('');
            // this.setState({
            //     UPI_error_msg: nextprops.payconiqRefundError,
            //     payconiq_payment_cancel_url: ''
            // })
        }
        if (props.cancleTransaction == true) {
            var cancleTrancationCount = cancleTrancationCount;
            cancleTrancationCount += 1;
            if (cancleTrancationCount == 1) {
                cancel_UPI_payment();
            }
            setcancleTrancationCount(cancleTrancationCount);
            // this.state.cancleTrancationCount = cancleTrancationCount;
        }
    })

    //var checkStatusInterval;
    //var countdownInterval;
    // fucntion to make payconiq payment request to get barcode, cancel payment response 
    const make_payconiq_payment_request = async () => {
        console.log("Props", props)
        var payconiqPrice = 0
        // get price for mobile
        var checkList = localStorage.getItem("CHECKLIST") && JSON.parse(localStorage.getItem("CHECKLIST"));
        var paid_amount = 0;
        var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : [];
        if (getPayments !== null) {
            getPayments.forEach(paid_payments => {
                paid_amount += parseFloat(paid_payments.payment_amount);
            });
        }
        if (checkList && checkList.totalPrice && parseFloat(checkList.totalPrice) >= paid_amount) {
            payconiqPrice = (parseFloat(checkList.totalPrice) - parseFloat(paid_amount));
        }
        if (props.partialAmount && props.partialAmount != 0) {
            payconiqPrice = props.partialAmount;
        }
        // var payconiq_pay_amount = ActiveUser.key.isSelfcheckout == true ? payconiqPrice : 0;
        var payconiq_pay_amount = payconiqPrice;
        console.log("chargeAmount", parseFloat(payconiq_pay_amount))
        // this.setState({ chargeAmount: parseFloat(payconiq_pay_amount) })
        if (uniqueID) {
            var _requestData = {
                "registerId": localStorage.getItem('register') ? localStorage.getItem('register') : 1,
                "amount": parseFloat(payconiq_pay_amount),
                "paycode": props.code,
                "command": "Sale",
                "SessionId": uniqueID
            }
            dispatch(make_payconiq_payment(_requestData))
            check_payconiq_payment_status()
            const _checkStatusInterval = setInterval(() => {
                check_payconiq_payment_status()
            }, 5000);
            setCheckStatus_Interval(_checkStatusInterval);
        }
    }

    // check payConiq barcode scan status
    const check_payconiq_payment_status = async () => {
        dispatch(check_payconiq_pay_status(uniqueID))
    }
    // regenerate barcoe in case of payment status 'EXPIRED
    const regenerate_payconiq_barcode = () => {
        setUPI_error_msg('');
        setpayconiq_payment_cancel_url('');
        setuniqueID(uuidv4());
        // this.setState({
        //     UPI_error_msg: '',
        //     payconiq_payment_cancel_url: '',
        //     uniqueID: uuidv4()
        // })
        setTimeout(() => {
            make_payconiq_payment_request()
            dispatch(cancel_payconiq_payment(null))

        }, 200);
    }

    // cancel UPI payments
    const cancel_UPI_payment = async () => {
        // const { payconiq_payment_cancel_url } = this.state
        if (payconiq_payment_cancel_url && payconiq_payment_cancel_url !== '') {
            var _requestData = {
                "Url": payconiq_payment_cancel_url
            }
            dispatch(cancel_payconiq_payment(_requestData))
        } else {
            clearInterval(checkStatus_Interval)
            clearInterval(countdown_Interval);
            dispatch(make_payconiq_payment(null))

            setactiveDisplayStatus(false);
            setUPI_error_msg('');
            setpayconiq_payment_cancel_url('');
            setpayconiq_current_status('');

            // this.setState({
            //     activeDisplayStatus: false,
            //     UPI_error_msg: '',
            //     payconiq_payment_cancel_url: '',
            //     payconiq_current_status: '',
            // })
        }
    }

    //get time  dierence between createAT and expiresAt session for payconiq barcode
    const payconiq_expires_time_diff = (dt2, dt1) => {
        var counter = 0
        var endDate = new Date(dt2); // 2017-05-29T00:00:00Z
        var startDate = new Date(dt1);
        setsessionMsg(LocalizedLanguage.sessionwillbeexpired);
        //this.setState({ sessionMsg: LocalizedLanguage.sessionwillbeexpired })
        if (((endDate - startDate) - counter) < 0) {
            setsessionMsg('');
            //this.setState({ sessionMsg: '' })
            clearInterval(countdown_Interval);
        }
        const _countdownInterval = setInterval(() => {
            counter = counter + 1000;
            var diff = (endDate - startDate) - counter
            var minutes = Math.floor(diff / 60000);
            var seconds = ((diff % 60000) / 1000).toFixed(0);
            if (seconds < 0) {
                setTmerValue('');
                // $('#counterId').text('')
                // $('#counterParentId').text('')
            } else {
                setTmerValue('' + minutes + ' : ' + seconds + ' minutes');
                //$('#counterId').text('' + minutes + ' : ' + seconds + ' minutes')
            }
        }, 1000);
        setCountdown_Interval(_countdownInterval);
    }
    const cancleTransaction = () => {
        var jsonMsg = {
            "command": "TransactionStatus",
            "method": "put",
            "version": "2.0",
            "data": {
                "transaction_status": "cancel"
            }
        }
        window.parent.postMessage(JSON.stringify(jsonMsg), '*');
    }
    //const { activeDisplayStatus, UPI_error_msg } = this.state;
    const { color, Name, code, pay_amount, styles } = props;
    return (

        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? "subwindow adjust-credit current" : "subwindow adjust-credit"}    >

                <div className="subwindow-header">
                    <p>{Name}</p>
                    <button className="close-subwindow" onClick={() => toggleUPIPayment_byCancel()}>
                        <img src={IconDarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="doCenter">
                        <div className="">
                            {barcodeURl !== "" ?
                                <div>
                                    <img src={barcodeURl} style={{ width: '250px' }}></img>
                                    {/* alt="Girl in a jacket" width="500" height="600" */}
                                </div>
                                :
                                <div>
                                    <h3 className="">
                                        {LocalizedLanguage.pleaseWait}
                                    </h3>
                                    <div className="">
                                        <a href="#">
                                            <svg
                                                version="1.1" id="ologo"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                x="0px"
                                                y="0px"
                                                viewBox="0 0 400 400"
                                                style={{ "enableBackground": 'new 0 0 400 400' }}
                                                xmlSpace="preserve" width="120px" height="120px"
                                            >

                                                <rect id="lime" x="249.28" y="156.01"
                                                    className="st0 ologo-1" width="103.9" height="103.9">
                                                </rect>
                                                <path id="teal" className="st1 ologo-2"
                                                    d="M249.28,363.81V259.91h103.9C353.17,317.29,306.66,363.81,249.28,363.81z">
                                                </path>
                                                <rect id="cyan" x="145.38" y="259.91"
                                                    className="st2 ologo-3" width="103.9" height="103.89">
                                                </rect>
                                                <path id="blue" className="st3 ologo-4"
                                                    d="M41.49,259.91L41.49,259.91h103.9v103.89C88,363.81,41.49,317.29,41.49,259.91z">
                                                </path>
                                                <rect id="purple" x="41.49" y="156.01"
                                                    className="st4 ologo-5" width="103.9" height="103.9">
                                                </rect>
                                                <path id="red" className="st5 ologo-6"
                                                    d="M41.49,156.01L41.49,156.01c0-57.38,46.52-103.9,103.9-103.9v103.9H41.49z">
                                                </path>
                                                <rect id="orange" x="145.38" y="52.12"
                                                    className="st6 ologo-7" width="103.9" height="103.9">
                                                </rect>
                                                <path id="yellow" className="st7 ologo-8"
                                                    d="M281.3,123.99V20.09c57.38,0,103.9,46.52,103.9,103.9H281.3z">
                                                </path>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            }
                        </div>
                        <button
                            className=""
                            onClick={cancel_UPI_payment}
                            style={{ minWidth: '220px' }}
                        >
                            {LocalizedLanguage.cancel}
                        </button>
                        <br></br><br></br>
                        {/* show regenrate QR code in case of payment status 'EXPIRED' */}
                        {payconiq_current_status == 'EXPIRED' || payconiq_current_status == 'CANCELLED' ?
                            <button
                                className="btn btn-50 btn-border-primary btn-text-primary btn-radius-4 btn-padding-30"
                                onClick={regenerate_payconiq_barcode}
                                style={{ minWidth: '220px' }}
                            >
                                {LocalizedLanguage.reGenerateQRCode}
                            </button> : <p id='counterParentId' style={{ color: 'black' }}>{sessionMsg}<span id='counterId' >{timerValue}</span></p>}
                        {/* <!-- <h3 className="user_login_head__title">Loading Demo</h3> --> */}
                        <p style={{ color: msgColor, paddingTop: "20px" }}>{UPI_error_msg}</p>

                        {/* test UPI cancle Trnaction 
                                                                    <button 
                                                                            onClick={this.cancleTransaction}
                                                                            
                                                                        > Cancle Transation</button>*/}
                    </div>
                </div>
            </div></div>
    )
}

export default UPIPayments;