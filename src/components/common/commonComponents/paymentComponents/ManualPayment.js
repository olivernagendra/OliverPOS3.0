import React, { useState, useEffect } from 'react';
import LocalizedLanguage from '../../../../settings/LocalizedLanguage';
import ActiveUser from '../../../../settings/ActiveUser';
import { LoadingModal } from '../LoadingModal';
import IconDarkBlue from '../../../../assets/images/svg/X-Icon-DarkBlue.svg'
// import { AndroidAndIOSLoader } from '../AndroidAndIOSLoader';
const ManualPayment = (props) => {
    const [paidAmount, setpaidAmount] = useState('');
    const [displaybuttonStyle, setdisplaybuttonStyle] = useState('');
    const [displayPopupStyle, setdisplayPopupStyle] = useState('none');
    const [CardNo, setCardNo] = useState('');
    const [CardName, setCardName] = useState('');
    const [ExpirMonth, setExpirMonth] = useState('');
    const [ExpirYear, setExpirYear] = useState('');
    const [CVVNo, setCVVNo] = useState('');
    const [City, setCity] = useState('');
    const [BillAddress, setBillAddress] = useState('');
    const [BillAddress2, setBillAddress2] = useState('');
    const [Country, setCountry] = useState('');
    const [State, setState] = useState('');
    const [ZipCode, setZipCode] = useState('');
    const [validationError, setvalidationError] = useState('');
    const [cardData, setcardData] = useState('');
    const [popupClass, setpopupClass] = useState('');
    const [CustInfor, setCustInfor] = useState('cardInfo');
    const [loading, setloading] = useState(false);
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleManualPayment && props.toggleManualPayment();
        }
    }
    const handleChange = (e) => {


        //var CardNo = CardNo;
        const { name, value } = e.target;
        var pin;
        switch (name) {
            case 'CardNo':
                var val = value.match(/^[0-9]*$/)
                if (val) {
                    setCardNo(value && value != "" ? value : '')
                    // setState({ CardNo: value && value != "" ? value : '' })
                } else {
                    // setState({ CardNo: CardNo })
                    setCardNo(CardNo)
                }
                break;
            case 'card_holder_name': {
                setCardName(value);
                // setState({ CardName: value })
                break;
            }
            case 'card_expiry_month':
                {
                    var rgex = value.match(/^[0-9]*$/)
                    if (rgex && value.length <= 2 && value <= 12) {
                        setExpirMonth(value);
                        // setState({ ExpirMonth: value })
                    }
                    break;
                }
            case 'card_expiry_year':
                {
                    var rgex = value.match(/^[0-9]*$/)
                    if (rgex && value.length <= 4) {
                        // setState({ ExpirYear: value })
                        setExpirYear(value);
                    }
                    break;
                }
            case 'card_CVC':
                {
                    var rgex = value.match(/^[0-9]*$/)
                    if (rgex && value.length <= 5) {
                        setCVVNo(value);
                        // setState({ CVVNo: value })
                    }
                    break;
                }
            case 'card_city':
                {
                    setCity(value)
                    // setState({ City: value })
                    break;
                }
            case 'billing_address':
                {
                    setBillAddress(value);
                    // setState({ BillAddress: value })
                    break;
                }
            case 'billing_address2':
                {
                    setBillAddress2(value);
                    // setState({ BillAddress2: value })
                    break;
                }
            case 'country':
                {
                    setCountry(value);
                    // setState({ Country: value })
                    break;
                }
            case 'city':
                {
                    setCity(value);
                    // setState({ City: value })
                    break;
                }
            case 'province':
                {
                    // if (value)
                    setState(value);
                    // setState({ State: value })
                    break;
                }
            case 'zip_code':
                {
                    // var rgex = value.match(/^[0-9]*$/)
                    if (value.length <= 10) {
                        setZipCode(value);
                        // setState({ ZipCode: value })
                    }
                    break;
                }
            default:
                break;
        }
        // setState({ [name]: value });
    }

    const handleChargeButton = () => {
        //const { CardNo, CardName, CVVNo, ExpirMonth, ExpirYear, UDID, BillAddress, City, State, ZipCode, Country } = state
        const { code, type } = props;

        if (CardNo !== '' && CardNo.length > 4 && CardName !== '' && CVVNo !== '' && CVVNo.length >= 3 && CVVNo.length <= 5 && ExpirMonth !== '' && ExpirYear !== '') {
            // if (ZipCode !== '' && ZipCode.length !== 6) {
            //     $('#CardNo').focus()
            //     setState({ validationError: 'Zip code should be 6 number' })
            //     return false
            // }
            var checklist = localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST'))
            var selectedRegister = localStorage.getItem('selectedRegister') && JSON.parse(localStorage.getItem('selectedRegister'))
            var expiryDate = ExpirYear + '-' + ExpirMonth
            var order_total = checklist && checklist.totalPrice ? checklist.totalPrice : 0
            var customerDetails = localStorage.getItem('AdCusDetail') && JSON.parse(localStorage.getItem('AdCusDetail'))

            var firstLastNameArr = CardName && CardName.split(' ')
            var firstNameByCard = firstLastNameArr && firstLastNameArr.length && firstLastNameArr[0] ? firstLastNameArr[0] : ''
            var lastNameByCard = firstLastNameArr && firstLastNameArr.length && firstLastNameArr[1] ? firstLastNameArr[1] : ''
            if (props.partialAmount && props.partialAmount != 0) {
                order_total = props.partialAmount;
            }
            var data = {
                "registerId": selectedRegister ? selectedRegister.id : '',
                "amount": order_total,
                "paycode": code,
                "command": type == 'refund' ? "Refund" : "Sale",
                "refId": '', //refId will be add on refundViewThird from orderpayments transation id
                "StripeToken": "",
                "currency": "",
                // "transaction_Date": "",
                "CardInfo": {
                    "cardNumber": CardNo,
                    "expirationDate": expiryDate,
                    "cardCode": CVVNo,
                    "ExpMonth": ExpirMonth,
                    "ExpYear": ExpirYear,
                },
                "CustomerInfo": {
                    "firstName": customerDetails && customerDetails.content ? customerDetails.content.FirstName ? customerDetails.content.FirstName : '' : firstNameByCard,
                    "lastName": customerDetails && customerDetails.content ? customerDetails.content.LastName ? customerDetails.content.LastName : '' : lastNameByCard,
                    "Email": customerDetails && customerDetails.content && customerDetails.content.Email ? customerDetails.content.Email : '',
                    "PhoneNo": customerDetails && customerDetails.content && customerDetails.content.Contact ? customerDetails.content.Contact : '',
                    "city": City ? City : customerDetails && customerDetails.content && customerDetails.content.City ? customerDetails.content.City : '',
                    "state": State ? State : customerDetails && customerDetails.content && customerDetails.content.State ? customerDetails.content.State : '',
                    "zip": ZipCode ? ZipCode : customerDetails && customerDetails.content && customerDetails.content.Pincode ? customerDetails.content.Pincode : '',
                    "country": Country ? Country : customerDetails && customerDetails.content && customerDetails.content.Country ? customerDetails.content.Country : '',
                },
                "OrderInfo": {
                    "orderNumber": "",
                    "invoiceNumber": ""
                }
            }

            setcardData(data);
            setvalidationError('');
            // setState({ cardData: data, validationError: '' })
            // setTimeout(() => {
            //     handleCardPopup(code)
            // }, 200);

            // props.dispatch(checkoutActions.makeOnlinePayments(data))
        } else {
            //$('#CardNo').focus()
            setvalidationError(LocalizedLanguage.validcarddetailalert);
            // setState({ validationError: LocalizedLanguage.validcarddetailalert })
            // setTimeout(() => {
            //     //  $(".btn-primary").click(function() {
            //     $('.popScroll').animate({ scrollTop: 0 }, 'slow');
            //     return false;
            //     //  }) 
            // }, 500);


        }
    }
    // componentWillReceiveProps = (nextProps) => {
    //     const {code} = props
    //     if (nextProps && nextProps.online_payment && nextProps.online_payment.content && nextProps.online_payment.is_success) {
    //         console.log('----sucess-manualPayments.js -', nextProps);
    //         if (nextProps.online_payment.content.RefranseCode && nextProps.online_payment.content.IsSuccess == true) {
    //             setState({ validationError: '', popupClass: '', displayPopupStyle: 'none' })
    //             $(`#onlinePaymentPopup${code}`).modal("hide");
    //             $(`onlinePaymentPopup${code}`).removeClass('show');
    //         } else {
    //             var data = nextProps.online_payment.content
    //             var err = data && data.RefranseMessage ? data.RefranseMessage : 'Something went wrong'
    //             $('#CardNo').focus()
    //             if (isMobileOnly == true) {
    //                 setState({ validationError: err, popupClass: 'in', displayPopupStyle: 'block' })
    //             } else {
    //                 setState({ validationError: err })
    //             }

    //         }
    //     } else if (nextProps && nextProps.error) {
    //         $('#CardNo').focus()
    //         nextProps.error && setState({ validationError: 'Payment failed : ' + nextProps.error })
    //        // $(".btn-primary").click(function() {
    //            setTimeout(() => {
    //             $('.popScroll').animate({scrollTop:0}, 'slow');
    //             //return false;
    //            }, 500);

    //        // }) 
    //     }
    // }
    useEffect(() => {
        if (cardData.hasOwnProperty("paycode")) {
            handleCardPopup(cardData.paycode);
        }
    }, [cardData]);

    const handleCardPopup = (status) => {
        const { closingTab, pay_amount, code, onlinePayCardDetails } = props;
        //const { cardData } = state
        // props.activeDisplay(true)
        if (cardData == '') {
            // if (isMobileOnly == true) {
            //     setState({ validationError: '' })
            //     showModal(`onlinePaymentPopup${code}`)
            // } else {

            setpopupClass('in');
            setdisplayPopupStyle('block');
            setvalidationError('');
            // setState({ popupClass: 'in', displayPopupStyle: 'block', validationError: '' })
            // }
        } else {
            closingTab(true); // commented for test
            onlinePayCardDetails && onlinePayCardDetails(cardData)
            //pay_amount(code,0,'','',0,cardData);
            if (props.type == 'refund') {
                // props.hideCashTab(false)
            }
        }
    }
    const closePopup = () => {
        setpopupClass('');
        setdisplayPopupStyle('none');
        setcardData('');
        setvalidationError('');
        // setState({ popupClass: '', displayPopupStyle: 'none', cardData: '', validationError: '' })

        //props.dispatch(makeOnlinePayments(null))

    }
    const onCancel = (itm) => {
        const { code } = props
        if (itm == "Cancel") {
            //closepopup here
            // $(`#onlinePaymentPopup${code}`).modal("hide");
            // $(`onlinePaymentPopup${code}`).removeClass('show');
            setCustInfor('cardInfo');
            setcardData('');
            // setState({ CustInfor: 'cardInfo', cardData: '' })
            //dispatch(makeOnlinePayments(null))
            // set the current trnasaction status, Used for APP Command "TransactionStatus"
            localStorage.setItem("CurrentTransactionStatus", JSON.stringify({ "paymentType": code, "status": "cancelled" }))
        } else {
            setCustInfor(itm);
            setcardData('');
            // setState({ CustInfor: itm, cardData: '' })
        }

    }
    const nextEventHandler = (itm) => {
        setCustInfor(itm);
        // setState({ CustInfor: itm })
    }


    const { isOrderPaymentOnline, color, Name, code, styles } = props;
    //const { displaybuttonStyle, displayPopupStyle, popupClass, CustInfor } = state;
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? "subwindow adjust-credit current" : "subwindow adjust-credit"}    >

                <div className="subwindow-header">
                    <p>{LocalizedLanguage.manualCardEntry}</p>
                    <button className="close-subwindow" onClick={props.toggleManualPayment}>
                        <img src={IconDarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="manual-payment">
                        {/* overflowscroll */}
                            <h3 className="manual-title">{LocalizedLanguage.cardInformation}</h3>
                            <p style={{ color: 'red' }}>{validationError}</p>
                            {/* <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-addon">{LocalizedLanguage.cardNumber}</div>
                                        <input type="tel" className="form-control" id="CardNo" placeholder={LocalizedLanguage.cardNumber} name="CardNo" value={CardNo} onChange={handleChange} />
                                    </div>
                                </div> */}
                            <div className='input-row '>
                                <div class="input-col">
                                    <label for="email">{LocalizedLanguage.cardNumber}</label>
                                    <input type="tel" className="form-control" id="CardNo" placeholder={LocalizedLanguage.cardNumber} name="CardNo" value={CardNo} onChange={handleChange} />
                                </div>
                            </div>
                            <div className='input-row '>
                                <div class="input-col">
                                    <label for="email">{LocalizedLanguage.cardholderName}</label>
                                    <input type="text" className="form-control" id="cardHoldername" name="card_holder_name" placeholder={LocalizedLanguage.cardholderName} value={CardName} onChange={handleChange} />
                                </div>
                            </div>
                            {/* <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.cardholderName}</div>
                                    <input type="text" className="form-control" id="cardHoldername" name="card_holder_name" placeholder={LocalizedLanguage.cardholderName} value={CardName} onChange={handleChange} />
                                </div>
                            </div> */}
                            <div className='input-row '>
                                <div class="input-col">
                                    <label for="email">{LocalizedLanguage.expiryMonth}</label>
                                    <input type="tel" className="form-control" maxLength={2} id="cardExpiryMonth" name='card_expiry_month' placeholder={LocalizedLanguage.expiryMonth}
                                        value={ExpirMonth} onChange={handleChange} />
                                </div>
                            </div>
                            {/* <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.expiryMonth}</div>
                                    <input type="tel" className="form-control" maxLength={2} id="cardExpiryMonth" name='card_expiry_month' placeholder={LocalizedLanguage.expiryMonth}
                                        value={ExpirMonth} onChange={handleChange} />
                                </div>
                            </div> */}

                            <div className='input-row '>
                                <div class="input-col">
                                    <label for="email">{LocalizedLanguage.expiryYear}</label>
                                    <input type="tel" className="form-control" maxLength={4} id="cardExpiryYear" name='card_expiry_year' placeholder={LocalizedLanguage.expiryYear}
                                        value={ExpirYear} onChange={handleChange} />
                                </div>
                            </div>
                            {/* <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.expiryYear}</div>
                                    <input type="tel" className="form-control" maxLength={4} id="cardExpiryYear" name='card_expiry_year' placeholder={LocalizedLanguage.expiryYear}
                                        value={ExpirYear} onChange={handleChange} />
                                </div>
                            </div> */}
                            <div className='input-row '>
                                <div class="input-col">
                                    <label for="email">{LocalizedLanguage.CVVAndCVC}</label>
                                    <input type="tel" className="form-control" maxLength={5} id="cardCVC" name='card_CVC' placeholder={LocalizedLanguage.CVVAndCVC}
                                        value={CVVNo} onChange={handleChange} />
                                </div>
                            </div>
                            {/* <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.CVVAndCVC}</div>
                                    <input type="tel" className="form-control" maxLength={5} id="cardCVC" name='card_CVC' placeholder={LocalizedLanguage.CVVAndCVC}
                                        value={CVVNo} onChange={handleChange} />
                                </div>
                            </div> */}
                            {/* <div className="form-group">
                                                            <div className="input-group">
                                                                <div className="input-group-addon">City</div>
                                                                <input type="text" className="form-control" id="cardCity" name='card_city' placeholder="City"
                                                                    value={City} onChange={handleChange} />
                                                            </div>
                                                        </div> */}
                            <h3 className="manual-title manual-title-space">{LocalizedLanguage.billingInformation}</h3>
                            <div className='input-row '>
                                <div class="input-col">
                                    <label for="email">{LocalizedLanguage.addressOne}</label>
                                    <input type="text" className="form-control" id="billingAddress" name='billing_address' placeholder={LocalizedLanguage.addressOne}
                                        value={BillAddress} onChange={handleChange} />
                                </div>
                            </div>
                            {/* <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.addressOne}</div>
                                    <input type="text" className="form-control" id="billingAddress" name='billing_address' placeholder={LocalizedLanguage.addressOne}
                                        value={BillAddress} onChange={handleChange} />
                                </div>
                            </div> */}
                             <div className='input-row '>
                                <div class="input-col">
                                    <label for="email">{LocalizedLanguage.addressTwo}</label>
                                    <input type="text" className="form-control" id="billingAddress2" name='billing_address2' placeholder={LocalizedLanguage.addressTwo}
                                        value={BillAddress2} onChange={handleChange} />
                                </div>
                            </div>
                            {/* <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.addressTwo}</div>
                                    <input type="text" className="form-control" id="billingAddress2" name='billing_address2' placeholder={LocalizedLanguage.addressTwo}
                                        value={BillAddress2} onChange={handleChange} />
                                </div>
                            </div> */}
                             <div className='input-row '>
                                <div class="input-col">
                                    <label for="email">{LocalizedLanguage.country}</label>
                                    <input type="text" className="form-control" id="country" name='country' placeholder={LocalizedLanguage.country}
                                        value={Country} onChange={handleChange} />
                                </div>
                            </div>

                            {/* <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.country}</div>
                                    <input type="text" className="form-control" id="country" name='country' placeholder={LocalizedLanguage.country}
                                        value={Country} onChange={handleChange} />
                                </div>
                            </div> */}
                            <div className='input-row '>
                                <div class="input-col">
                                    <label for="email">{LocalizedLanguage.city}</label>
                                    <input type="text" className="form-control" id="city" name='city' placeholder={LocalizedLanguage.city}
                                        value={City} onChange={handleChange} />
                                </div>
                            </div>
                            {/* <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.city}</div>
                                    <input type="text" className="form-control" id="city" name='city' placeholder={LocalizedLanguage.city}
                                        value={City} onChange={handleChange} />
                                </div>
                            </div> */}
                             <div className='input-row '>
                                <div class="input-col">
                                    <label for="email">{LocalizedLanguage.provinceState}</label>
                                    <input type="text" className="form-control" id="province" name='province' placeholder={LocalizedLanguage.provinceState}
                                        value={State} onChange={handleChange} />
                                </div>
                            </div>

                            {/* <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.provinceState}</div>
                                    <input type="text" className="form-control" id="province" name='province' placeholder={LocalizedLanguage.provinceState}
                                        value={State} onChange={handleChange} />
                                </div>
                            </div> */}
                            <div className='input-row '>
                                <div class="input-col">
                                    <label for="email">{LocalizedLanguage.zippostalcode}</label>
                                    <input type="tel" className="form-control" id="zip" name='zip_code' placeholder={LocalizedLanguage.zippostalcode}
                                        value={ZipCode} onChange={handleChange} />
                                </div>
                            </div>

                            {/* <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.zippostalcode}</div>
                                    <input type="tel" className="form-control" id="zip" name='zip_code' placeholder={LocalizedLanguage.zippostalcode}
                                        value={ZipCode} onChange={handleChange} />
                                </div>
                            </div> */}
                            {/* <p style={{ color: 'red' }}>{validationError}</p> */}
                    </div>
                        <button className="charge-card" onClick={handleChargeButton}>
                            {LocalizedLanguage.chargeCard}
                        </button>
                </div>

            </div></div>
    )

}

export default ManualPayment;