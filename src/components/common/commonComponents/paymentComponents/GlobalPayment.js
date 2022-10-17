import React, { useState, useEffect } from 'react';
import LocalizedLanguage from '../../../../settings/LocalizedLanguage';
import CommonTerminalPopup from "./CommonTerminalPopup";
import IconDarkBlue from '../../../../assets/images/svg/X-Icon-DarkBlue.svg';
const GlobalPayment = (props) => {

    const [paymentButtonDisplay, setpaymentButtonDisplay] = useState(true);
    const [buttonClicked, setbuttonClicked] = useState(false);
    const [cancleTrancationCount, setcancleTrancationCount] = useState(0);

    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleGlobalPayment();
        }
    }
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         paymentButtonDisplay: true,
    //         buttonClicked: false,
    //         cancleTrancationCount: 0
    //     }
    // }

    const cancel_payment = () => {
        // set the current trnasaction status, Used for APP Command "TransactionStatus"
        localStorage.setItem("CurrentTransactionStatus", JSON.stringify({ "paymentType": props.code, "status": "cancelled" }))
        if (props.type == 'refund') {
            // $('.accordion_close').click();
            handlePayDisplay2(!paymentButtonDisplay);
        } else {
            //location.reload();
        }
        props.toggleGlobalPayment();
        //setpaymentButtonDisplay(true);
        // this.setState({ paymentButtonDisplay: true })
    }

    const handlePayDisplay = (code) => {
        if (buttonClicked == false) { //check for bouble button clicked 
            setbuttonClicked(true);
            const { closingTab, pay_amount, paymentDetails } = props;
            // closingTab(true);
            if (paymentDetails && paymentDetails.HasTerminal == true && paymentDetails.TerminalCount == 0 && paymentDetails.Support == "Terminal") {
                props.terminalPopup(LocalizedLanguage.terminalnotconnected)
            }
            else {
                setpaymentButtonDisplay(false);
                // this.setState({ paymentButtonDisplay: false })
                setTimeout(function () {
                    if (code !== true) {
                        pay_amount(code);
                        // set the current trnasaction status, Used for APP Command "TransactionStatus"
                        localStorage.setItem("CurrentTransactionStatus", { "paymentType": code, "status": "completed" })
                    }
                }, 500)
            }
            setTimeout(() => { //enabled after 2 second
                setbuttonClicked(false);
                // this.state.buttonClicked = false;
            }, 2000);
        }
    }

    const handlePayDisplay2 = (st) => {
        setpaymentButtonDisplay(true);
        // this.setState({ paymentButtonDisplay: true })
        props.activeDisplay(false)
    }
    useEffect(() => {
        if (props.cancleTransaction == true) {
            var cancleTrancationCount = cancleTrancationCount;
            cancleTrancationCount += 1;
            if (cancleTrancationCount == 1) {
                cancel_payment();
            }
            setcancleTrancationCount(cancleTrancationCount);
            // this.state.cancleTrancationCount = cancleTrancationCount;
        }

    },[])
    // componentWillReceiveProps(){   
    //     if(this.props.cancleTransaction==true){
    //         var  cancleTrancationCount =this.state.cancleTrancationCount;
    //         cancleTrancationCount +=1;
    //         if(cancleTrancationCount==1){
    //             this.cancel_payment();
    //         }      
    //         this.state.cancleTrancationCount=cancleTrancationCount;
    //     }
    // }

    //For Teting App 20. TransactionStatus
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

    const { isOrderPaymentGlobal, color, Name, code, pay_amount, msg, styles } = props;
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? "subwindow adjust-credit current" : "subwindow adjust-credit"}    >
                <div className="subwindow-header">
                    <p>{Name}</p>
                    <button className="close-subwindow" onClick={()=>props.toggleGlobalPayment()}>
                        <img src={IconDarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    {/* <CommonTerminalPopup
                    errorMsgColor={'red'}
                    error_msg={msg}
                    handleCancelButton={() => cancel_payment()}
                    button1Title={LocalizedLanguage.resendAmount}
                    handleButton1Click={() => pay_amount(code)}
                    button2Title={LocalizedLanguage.manualAccept}
                    handleButton2Click={() => pay_amount("manual_global_payment")}
                    showTerinalwaitingMsg={msg && msg !== '' ? false : true}
                    cancleTransaction={cancleTransaction}
                /> */}
                    <div className="doCenter">
                        <div className="user_login_head user_login_join">
                            <div>
                                {(msg && msg !== '' ? false : true) == true ? <h3 className="user_login_head_title">
                                    {LocalizedLanguage.waitingOnPaymentTerminal}
                                </h3> : ''}
                                <div className="user_login_head_logo">
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
                        </div>
                        <button
                            className="btn btn-50 btn-border-primary btn-text-primary btn-radius-4 btn-padding-30 ml-2 mt-2"
                            onClick={()=>pay_amount(code)}
                            style={{ minWidth: '220px' }}
                        >
                            {LocalizedLanguage.resendAmount}
                        </button>

                        <button
                            className="btn btn-50 btn-border-primary btn-text-primary btn-radius-4 btn-padding-30 ml-2 mt-2"
                            onClick={()=>pay_amount("manual_global_payment")}
                            style={{ minWidth: '220px' }}
                        >
                            {LocalizedLanguage.manualAccept}
                        </button>

                        <button
                            className="btn btn-50 btn-border-primary btn-text-primary btn-radius-4 btn-padding-30 ml-2 mt-2"
                            onClick={()=>cancel_payment()}
                            style={{ minWidth: '220px' }}
                        >
                            {LocalizedLanguage.cancel}
                        </button>
                        {/* <button
                className="btn btn-50 btn-border-primary btn-text-primary btn-radius-4 btn-padding-30"
                onClick={handleCloseButton}
                style={{ minWidth: '220px' }}
            >
                {closeButtonTitle}
            </button> */}
                        {/* show regenrate QR code in case of payment status 'EXPIRED' */}
                        <p style={{ color: 'red', paddingTop: "20px" }}>{msg}</p>
                        {/* <button onClick={cancleTransaction}> Cancle Transation</button> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GlobalPayment;