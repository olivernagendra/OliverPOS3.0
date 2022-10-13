import React, { useState, useEffect } from 'react';

import LocalizedLanguage from '../../../../settings/LocalizedLanguage';
import ActiveUser from '../../../../settings/ActiveUser';
import Config from '../../../../Config';
import IconDarkBlue from '../../../../assets/images/svg/X-Icon-DarkBlue.svg'
const StripePayment = (props) => {
    const [activeDisplayStatus, setactiveDisplayStatus] = useState(false);
    const [card_number, setcard_number] = useState('');
    const [cvv_number, setcvv_number] = useState('');
    const [displaybuttonStyle, setdisplaybuttonStyle] = useState('');
    const [popupClass, setpopupClass] = useState('');
    const [displayPopupStyle, setdisplayPopupStyle] = useState('');
    const [loading, setloading] = useState(false);
    const [msgColor, setmsgColor] = useState('red');
    const [status, setstatus] = useState('requires_initializing');
    const [backendURL, setbackendURL] = useState(Config.key.RECIEPT_IMAGE_DOMAIN);
    const [discoveredReaders, setdiscoveredReaders] = useState([]);
    const [connectionStatus, setconnectionStatus] = useState('not_connected');
    const [reader, setreader] = useState(null);
    const [readerLabel, setreaderLabel] = useState('');
    const [registrationCode, setregistrationCode] = useState('');
    const [cancelablePayment, setcancelablePayment] = useState(false);
    const [chargeAmount, setchargeAmount] = useState(0);
    const [itemDescription, setitemDescription] = useState("");
    const [taxAmount, settaxAmount] = useState(0);
    const [currency, setcurrency] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).currency && (JSON.parse(localStorage.getItem('user')).currency).toLowerCase() : 'usd');
    const [workFlowInProgress, setworkFlowInProgresst] = useState(null);
    const [disoveryWasCancelled, setdisoveryWasCancelled] = useState(false);
    const [refundedChargeID, setrefundedChargeID] = useState(null);
    const [refundedAmount, setrefundedAmount] = useState(null);
    const [cancelableRefund, setcancelableRefund] = useState(false);
    const [usingSimulator, setusingSimulator] = useState(false);

    const [testCardNumber, settestCardNumber] = useState("4242424242424242");
    const [testPaymentMethod, settestPaymentMethod] = useState("visa");
    const [discoveryInProgress, setdiscoveryInProgress] = useState(false);
    const [requestInProgress, setrequestInProgress] = useState(false);

    const [connectReedersErr, setconnectReedersErr] = useState('');
    const [processingStart, setprocessingStart] = useState(false);
    const [paymentCancelClicked, setpaymentCancelClicked] = useState(false);
    const [cancelManually, setcancelManually] = useState(false);
    const [cancleTrancationCount, setcancleTrancationCount] = useState(0);
    const [discoveryWasCancelled, setdiscoveryWasCancelled] = useState(false);
    var pendingPaymentIntentSecret = null;
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleStripeTerminalPayment && props.toggleStripeTerminalPayment();
        }
    }
    useEffect(() => {
        hideTab(true);
    }, [])
    useEffect(() => {
        if (props.cancleTransaction == true) {
            var cancleTrancationCount = cancleTrancationCount;
            cancleTrancationCount += 1;
            if (cancleTrancationCount == 1) {
                cancelPendingPayment();
            }
            setcancleTrancationCount(cancleTrancationCount);
            // state.cancleTrancationCount=cancleTrancationCount;
        }
    }, [props.cancleTransaction])
    const hideTab = (st) => {
        // refs.btn.setAttribute("disabled", "disabled");
        console.log("Call hideTab")
        // const { backendURL } = state
        const { paymentDetails } = props;
        if (process.env.ENVIRONMENT !== 'dev1' //For development need to connect with simulator
            && paymentDetails && paymentDetails.HasTerminal == true && paymentDetails.TerminalCount == 0 && paymentDetails.Support == "Terminal") {
            props.terminalPopup(LocalizedLanguage.terminalnotconnected)
            setconnectReedersErr(LocalizedLanguage.terminalnotconnected);
        }
        else {
            setpopupClass('in');
            setdisplayPopupStyle('block');
            setpaymentCancelClicked(false);
            setcancelManually(false);
            // setState({ popupClass: 'in', displayPopupStyle: 'block', paymentCancelClicked: false,
            //  cancelManually: false })
            setTimeout(() => {
                // boxHeight();
                if (props.type == 'refund') {
                    // props.hideCashTab(false)
                    // setState({ connectReedersErr: ``, popupClass: '', displayPopupStyle: 'none', activeDisplayStatus: false, loading: false, msgColor: 'green', processingStart: false })
                    props.pay_amount(props.code)
                } else {
                    console.log("call Initialize")
                    initializeBackendClientAndTerminal(backendURL)
                    if (process.env.ENVIRONMENT == 'dev1') {// just used simulator to collect payment
                        connectToSimulator()
                    } else {
                        discoverReaders()
                    }

                }

            }, 2000);
            if (st == true) {
                // props.activeDisplay(`${props.code}_true`)
            } else {
                // props.activeDisplay(false)
            }
            setactiveDisplayStatus(st);
            // setState({
            //     activeDisplayStatus: st,
            // })
            if (props.type == 'refund') {
                // props.hideCashTab(false)
            }
        }
    }
    const closePopup = () => {
        setpopupClass('');
        setdisplayPopupStyle('none');
        setactiveDisplayStatus(false);
        // setState({ popupClass: '', displayPopupStyle: 'none', activeDisplayStatus: false })
    }
    // componentWillReceiveProps = (nextprops)=>{
    //     if(nextprops.stripRefundError !==''){
    //         setState({ connectReedersErr: nextprops.stripRefundError, loading: false, msgColor: 'red',})
    //     }
    //     if(props.cancleTransaction==true){
    //         var  cancleTrancationCount =state.cancleTrancationCount;
    //         cancleTrancationCount +=1;
    //         if(cancleTrancationCount==1){
    //             cancelPendingPayment();
    //         }      
    //         state.cancleTrancationCount=cancleTrancationCount;
    //     }    

    // }

    const hideTab2 = (st) => {
        // setState({ activeDisplayStatus: st })
        // props.activeDisplay(false)
        // if (props.type == 'refund') {
        //     props.hideCashTab(false)
        // }
    }

    // stripe methods



    // 1. Stripe Terminal Initialization
    var client;
    var terminal;
    const initializeBackendClientAndTerminal = (url) => {
        // 1a. Initialize Client class, which communicates with the example terminal backend
        client = new Client(url);
        // 1b. Initialize the StripeTerminal object
        try {
            terminal = window.StripeTerminal.create({
                // 1c. Create a callback that retrieves a new ConnectionToken from the example backend
                onFetchConnectionToken: async () => {
                    let connectionTokenResult = await client.createConnectionToken();
                    if (connectionTokenResult && connectionTokenResult.is_success == false) {
                        setconnectReedersErr(connectionTokenResult.message);
                        setloading(false);
                        setmsgColor('red');
                        setcancelManually(true);
                        // setState({ connectReedersErr: connectionTokenResult.message,
                        //      loading: false, msgColor: 'red', cancelManually: true })
                    } else {
                        return connectionTokenResult.content.secret;
                    }

                },
                // 1c. (Optional) Create a callback that will be called if the reader unexpectedly disconnects.
                // You can use this callback to alert your user that the reader is no longer connected and will need to be reconnected.

                onUnexpectedReaderDisconnect: client.unexpectedReaderDisconnect(
                    () => {
                        alert("Unexpected disconnect from the reader");
                        setconnectionStatus("not_connected");
                        setreader(null);
                        // setState({
                        //     connectionStatus: "not_connected",
                        //     reader: null
                        // });
                    }
                ),
            });
        } catch (error) {
            setconnectReedersErr(error);
            setloading(false);
            setmsgColor('red');
            setcancelManually(true);
            // setState({ connectReedersErr: error, loading: false, msgColor: 'red', 
            // cancelManually: true })
        }

    }

    // 2. Discover and connect to a reader.
    const discoverReaders = async () => {
        //const { discoveredReaders } = state
        setdiscoveryWasCancelled(false);
        setloading(true);
        // setState({
        //     discoveryWasCancelled: false,
        //     loading: true
        // });
        // 2a. Discover registered readers to connect to.
        const discoverResult = await terminal.discoverReaders();
        if (discoverResult.error) {
            console.log("Failed to discover: ", discoverResult.error);
            setconnectReedersErr(discoverResult.error);
            setloading(false);
            setmsgColor('red');
            setcancelManually(true);
            // setState({ connectReedersErr: discoverResult.error, loading: false,
            //      msgColor: 'red', cancelManually: true })
            return discoverResult.error;
        } else {
            if (discoveryWasCancelled) return;
            setdiscoveredReaders(discoverResult.discoveredReaders);
            setcancelManually(false);
            // setState({
            //     discoveredReaders: discoverResult.discoveredReaders,
            //     cancelManually: false
            // });
            var stripeTerminal = []
            var paymentTypes = localStorage.getItem('PAYMENT_TYPE_NAME') ? JSON.parse(localStorage.getItem('PAYMENT_TYPE_NAME')) : []
            paymentTypes && paymentTypes.length > 0 && paymentTypes.map((payType, i) => {
                if (payType.Code == props.code) {
                    stripeTerminal = payType.TerminalSerialNo

                }
            })
            var isTerminalFound = false;
            discoverResult.discoveredReaders && discoverResult.discoveredReaders.length > 0 && discoverResult.discoveredReaders.map((reeder, i) => {

                stripeTerminal.length > 0 && stripeTerminal.map((st) => {
                    if (st == reeder.serial_number) {
                        onConnectToReader(reeder)
                        isTerminalFound = true;
                    }
                })
            })
            if (isTerminalFound == false) {
                setconnectReedersErr("No terminal found!");
                setcancelManually(true);
                // setState({connectReedersErr:"No terminal found!"})
                // setState({cancelManually:true})
            }
            return discoverResult.discoveredReaders;
        }
    };

    const onChangeTestPaymentMethod = (e) => {
        settestPaymentMethod(e.target.value);
        // setState({ testPaymentMethod: e.target.value });
    };

    const onChangeTestCardNumber = (e) => {
        settestCardNumber(e.target.value);
        // setState({ testCardNumber: e.target.value });
    };

    const connectToSimulator = async () => {
        const simulatedResult = await terminal.discoverReaders({
            simulated: true,
        });
        await connectToReader(simulatedResult.discoveredReaders[0]);
    };

    // on click on any reeder in list 
    const onConnectToReader = async (reader) => {
        setrequestInProgress(true);
        setloading(true);
        // setState({ requestInProgress: true, loading: true });
        try {
            await connectToReader(reader);
        } finally {
            setrequestInProgress(false);
            // setState({ requestInProgress: false });
        }
    };

    const connectToReader = async (selectedReader) => {
        // 2b. Connect to a discovered reader.
        const connectResult = await terminal.connectReader(selectedReader);
        if (connectResult.error) {
            console.log(connectResult.error);
            setconnectReedersErr(connectResult.error.message);
            setloading(false);
            setmsgColor('red');
            setcancelManually(true)
            // setState({ connectReedersErr: connectResult.error.message, loading: false, msgColor: 'red', cancelManually: true })
            if (paymentCancelClicked == true) {
                cancelPendingPayment()
            }
        } else {
            setusingSimulator(selectedReader.id === "SIMULATOR");
            setstatus("workflows");
            setdiscoveredReaders([]);
            setreader(connectResult.reader);
            setcancelManually(false);
            // setState({
            //     usingSimulator: selectedReader.id === "SIMULATOR",
            //     status: "workflows",
            //     discoveredReaders: [],
            //     reader: connectResult.reader,
            //     cancelManually: false
            // });
            collectCardPayment() // collect payment after connect to reeder
            return connectResult;
        }
    };

    // register new reeder
    const registerAndConnectNewReader = async () => {
        try {
            var label = 'oliverPOS'
            var registrationCode = 'bear-keen-outset'
            let reader = await client.registerDevice({
                label,
                registrationCode
            });
            if (reader && reader.IsSuccess == false) {
                setconnectReedersErr(reader.Message);
                setloading(false);
                setmsgColor('red');
                setcancelManually(true)

                // setState({ connectReedersErr: reader.Message, loading: false, msgColor: 'red', cancelManually: true })
            } else {
                // After registering a new reader, we can connect immediately using the reader object returned from the server.
                await connectToReader(reader.Content);
                console.log("Registered and Connected Successfully!");
                setconnectReedersErr('Registered and Connected Successfully!');
                setmsgColor('blue');
                // setState({ connectReedersErr: 'Registered and Connected Successfully!', msgColor: 'blue' })
            }
        } catch (e) {
            // Suppress backend errors since they will be shown in logs
            console.log("error!", e);
            setconnectReedersErr(e);
            setmsgColor('red');
            setloading(false);
            setcancelManually(true);
            // setState({ connectReedersErr: e, loading: false, msgColor: 'red', cancelManually: true })
        }
    };

    // collect payment

    // 3b. Collect a card present payment
    const collectCardPayment = async () => {
        // We want to reuse the same PaymentIntent object in the case of declined charges, so we
        // store the pending PaymentIntent's secret until the payment is complete.
        if (!pendingPaymentIntentSecret) {
            try {
                let paymentMethodTypes = ["card_present"];//card_present
                // if ((state.currency.toLowerCase()) == "cad") {
                //     //paymentMethodTypes = ["interac_present"];
                //     paymentMethodTypes.push("interac_present");
                // }
                console.log("props.paidAmount", props.paidAmount)
                let createIntentResponse = await client.createPaymentIntent({
                    amount: parseFloat(props.paidAmount),
                    currency: currency,
                    description: "TestCharge",
                    paymentMethodTypes: paymentMethodTypes,
                    CaptureMethod: "manual",
                });
                if (createIntentResponse.content && createIntentResponse.content.RefranseCode) {
                    pendingPaymentIntentSecret = createIntentResponse.content.RefranseCode;
                } else if (createIntentResponse && createIntentResponse.is_success && createIntentResponse.is_success == false) {
                    setloading(false);
                    setmsgColor('red');
                    setcancelManually(createIntentResponse.message ? true : false);
                    setconnectReedersErr(`${createIntentResponse.message ? createIntentResponse.message : ''}`)
                    // setState({  loading: false, msgColor: 'red', cancelManually: createIntentResponse.message ? true : false,connectReedersErr: `${createIntentResponse.message ? createIntentResponse.message : ''}`, })
                } else {
                    setloading(false);
                    setmsgColor('red');
                    setcancelManually(createIntentResponse.message ? true : false);
                    setconnectReedersErr(`${createIntentResponse.message ? createIntentResponse.message : ''}`)
                    // setState({  loading: false, msgColor: 'red', cancelManually: createIntentResponse.message ? true : false,connectReedersErr: `${createIntentResponse.message ? createIntentResponse.message : ''}`, })
                }
                // pendingPaymentIntentSecret = createIntentResponse.Content.client_secret;
            } catch (e) {
                setloading(false);
                setmsgColor('red');
                setcancelManually(true);
                setconnectReedersErr(e)
                // setState({ connectReedersErr: e, loading: false, msgColor: 'red', cancelManually: true })
                // Suppress backend errors since they will be shown in logs
                return;
            }
        }
        // Read a card from the customer
        terminal.setSimulatorConfiguration({
            testPaymentMethod: testPaymentMethod,
            testCardNumber: testCardNumber,
        });
        const paymentMethodPromise = terminal.collectPaymentMethod(
            pendingPaymentIntentSecret
        );
        setcancelablePayment(true);
        setloading(true);
        // setState({ cancelablePayment: true, loading: true });
        if (paymentCancelClicked == true) {
            cancelPendingPayment()
        }
        const result = await paymentMethodPromise;
        if (result.error) {
            setconnectReedersErr(`Collect payment method failed: ${result.error.message}`);
            setloading(false);
            setmsgColor('red');
            setcancelManually(true);
            // setState({ connectReedersErr: `Collect payment method failed: ${result.error.message}`,
            //  loading: false, msgColor: 'red', cancelManually: true })
        } else {
            setconnectReedersErr(`Payment processing!!`);
            setmsgColor('blue');
            // setState({ connectReedersErr: `Payment processing!!`, msgColor: 'blue' })
            const confirmResult = await terminal.processPayment(
                result.paymentIntent
            );
            // At this stage, the payment can no longer be canceled because we've sent the request to the network.
            // setState({ cancelablePayment: false, processingStart: true });
            setcancelablePayment(false);
            setprocessingStart(true);
            if (confirmResult.error) {
                setconnectReedersErr(`Process payment - ${confirmResult.error.message}`);
                setmsgColor('red');
                setloading(false);
                // setState({ connectReedersErr: `Process payment - ${confirmResult.error.message}`,
                //  loading: false, msgColor: 'red' })
                // alert(`Confirm failed: ${confirmResult.error.message}`);
                console.log("Error in Payment processing!");
            } else if (confirmResult.paymentIntent) {
                if (confirmResult.paymentIntent.status !== "succeeded") {
                    try {
                        // Capture the PaymentIntent from your backend client and mark the payment as complete
                        let captureResult = await client.capturePaymentIntent({
                            paymentIntentId: confirmResult.paymentIntent.id
                        });
                        pendingPaymentIntentSecret = null;

                        if (captureResult && captureResult.is_success == false) {
                            setconnectReedersErr(`capture payment response - ${captureResult.message}`);
                            setmsgColor('red');
                            setloading(false);
                            // setState({ connectReedersErr: `capture payment response - ${captureResult.message}`, loading: false, msgColor: 'red' })
                        } else {
                            console.log("With capture!");
                            console.log("Payment Successful!");
                            localStorage.setItem('STRIPE_PAYMENT_RESPONSE', JSON.stringify(captureResult))
                            localStorage.setItem('PAYMENT_RESPONSE', JSON.stringify(captureResult));
                            setconnectReedersErr(`Payment Successful!`);
                            setpopupClass('');
                            setdisplayPopupStyle('none');
                            setactiveDisplayStatus(false);
                            setloading(false);
                            setmsgColor('green');
                            setprocessingStart(false);
                            // setState({ connectReedersErr: `Payment Successful!`, popupClass: '',
                            //  displayPopupStyle: 'none', activeDisplayStatus: false, loading: false,
                            //   msgColor: 'green', processingStart: false })
                            props.pay_amount(props.code)
                        }
                        return captureResult;
                    } catch (e) {
                        setconnectReedersErr(e);
                        setloading(false);
                        setmsgColor('red');
                        // setState({ connectReedersErr: e, loading: false, msgColor: 'red' })
                        // Suppress backend errors since they will be shown in logs
                        console.log("Error in Payment!");
                        return;
                    }
                } else {
                    pendingPaymentIntentSecret = null;
                    console.log("Without capture");
                    console.log("Single-message payment successful!");
                    setconnectReedersErr(`Payment successful!!`);
                    setloading(false);
                    setmsgColor('green');
                    //setState({ connectReedersErr: `Payment successful!!`, loading: false, msgColor: 'green' })
                    props.pay_amount(props.code)
                    return confirmResult;
                }
            }
        }
    };

    // 3c. Cancel a pending payment.
    // Note this can only be done before calling `processPayment`.
    const cancelPendingPayment = async () => {
        //const { cancelManually } = state
        if (props.type == 'refund') {
            setprocessingStart(false);
            setpaymentCancelClicked(false);
            setcancelablePayment(false);
            setloading(false);
            setconnectReedersErr('');
            msgColor('red');
            activeDisplayStatus(false);
            // setState({ processingStart: false, paymentCancelClicked: false, 
            //     cancelablePayment: false, loading: false, 
            //     connectReedersErr: '', msgColor: 'red', activeDisplayStatus: false });
            return;
        }
        setpaymentCancelClicked(true);
        // setState({ paymentCancelClicked: true })
        if (cancelablePayment == true) {
            await terminal.cancelCollectPaymentMethod();
            pendingPaymentIntentSecret = null;
            setTimeout(() => {
                setprocessingStart(false);
                setpaymentCancelClicked(false);
                setcancelablePayment(false);
                setloading(false);
                setconnectReedersErr('');
                setmsgColor('red');
                setactiveDisplayStatus(false);
                // setState({ processingStart: false, paymentCancelClicked: false,
                //      cancelablePayment: false, loading: false, connectReedersErr: '',
                //      msgColor: 'red', activeDisplayStatus: false });
            }, 1000);
        } else if (processingStart == true) {
            setprocessingStart(false);
            setloading(false);
            setconnectReedersErr('Payment can not be canceled ! processing Started ');
            setmsgColor('red');

            // setState({ paymentCancelClicked: false, loading: false, 
            //     connectReedersErr: 'Payment can not be canceled ! processing Started ', 
            //     msgColor: 'red' });
        } else {
            setloading(false);
            setconnectReedersErr(cancelManually ? '' : 'Canceling your payment...');
            setmsgColor('blue');
            props.toggleStripeTerminalPayment();
            //setactiveDisplayStatus(cancelManually == true ? false : true);
            // setState({ loading: false, connectReedersErr: cancelManually ? '' :
            //  'Canceling your payment...', msgColor: 'blue', 
            //  activeDisplayStatus: cancelManually == true ? false : true });
        }

    };


    //const { activeDisplayStatus, discoveredReaders, connectReedersErr, usingSimulator } = state;
    const { color, Name, code, pay_amount, styles } = props;
    //const { displaybuttonStyle, displayPopupStyle, popupClass } = state;

    return (

        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? "subwindow adjust-credit current" : "subwindow adjust-credit"}    >

                <div className="subwindow-header">
                    <p>{ }</p>
                    <button className="close-subwindow" onClick={props.toggleStripeTerminalPayment}>
                        <img src={IconDarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="doCenter">
                        <div className="">
                            <h3 className="">
                                {LocalizedLanguage.waitingOnPaymentTerminal}
                            </h3>
                            {/* <!-- <h3 className="user_login_head__title">
                                                        Please Do not close your window <br>, Back we cache your shop
                                                    </h3> --> */}
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
                        <button
                            className="" onClick={cancelPendingPayment}>{LocalizedLanguage.cancel}</button>
                        {/* <!-- <h3 className="user_login_head__title">Loading Demo</h3> --> */}
                        <p style={{ color: msgColor, paddingTop: "20px" }}>{connectReedersErr}</p>
                    </div>
                </div></div></div>


    )

}


// export default StripePayment;

// Client for the example terminal backend: https://github.com/stripe/example-terminal-backend
class Client {

    constructor(url) {
        this.url = url;
    }

    createConnectionToken() {
        const formData = new URLSearchParams();
        return this.doPost(this.url + "/connection_token", formData);
    }

    registerDevice({ label, registrationCode }) {
        // const formData = new URLSearchParams();
        // formData.append("label", label);
        // formData.append("registration_code", registrationCode);

        var resgisterData = {
            label: label,
            registration_code: registrationCode
        }
        return this.doPost(this.url + "/register_reader", JSON.stringify(resgisterData));
    }

    createPaymentIntent({ amount, currency, description, paymentMethodTypes, CaptureMethod }) {
        // const formData = new URLSearchParams();
        // formData.append("amount", amount);
        // formData.append("currency", currency);
        // formData.append("description", description);
        // paymentMethodTypes.forEach((type) => formData.append(`payment_method_types[]`, type));
        var data = {
            amount: amount,
            currency: currency,
            description: description,//
            payment_method_types: paymentMethodTypes,//
            CaptureMethod: CaptureMethod//
        }
        return this.doPost(this.url + "/create_payment_intent", JSON.stringify(data));
    }
    // now return only async  fucntion as onUnexpectedReaderDisconnect need async fucntion
    unexpectedReaderDisconnect() {
        return async function (...args) {
        }
    }

    capturePaymentIntent({ paymentIntentId }) {
        // const formData = new URLSearchParams();
        // formData.append("payment_intent_id", paymentIntentId);
        var captureData = {
            id: paymentIntentId
        }
        return this.doPost(this.url + "/capture_payment_intent", JSON.stringify(captureData));
    }

    savePaymentMethodToCustomer({ paymentMethodId }) {
        const formData = new URLSearchParams();
        formData.append("payment_method_id", paymentMethodId);
        return this.doPost(
            this.url + "/attach_payment_method_to_customer",
            formData
        );
    }

    async doPost(url, body) {
        try {
            let response = await fetch(url, {
                method: "post",
                body: body,
                headers: {
                    "access-control-allow-origin": "*",
                    "access-control-allow-credentials": "true",
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(sessionStorage.getItem("AUTH_KEY")),
                }
            });

            if (response.ok) {
                return response.json();
            } else {
                let text = await response.text();
                throw new Error("Request Failed: " + text);
            }
        } catch (error) {
            console.log('----API error---', error);
        }

    }

}

export default StripePayment;
