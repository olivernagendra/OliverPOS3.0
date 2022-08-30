import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getDetails, closeRegister } from './CashmanagementSlice'
import AngledBracket_left from '../../images/svg/AngledBracket-Left-BaseBlue.svg'
import OpenSign from '../../images/svg/OpenSign.svg'
import PinPad from '../PinPad'
import moment from 'moment';
import Closeregistertwo from "./Closeregistertwo";
const Closeregister = () => {
    const dispatch = useDispatch();

    const [enteredCashAmount, setCashAmount] = useState('')
    const [enteredCardAmount, setCardAmount] = useState('')
    const [enteredOthersAmount, setOtherPayment] = useState('')
    const [isSaveCount, setisSaveCount] = useState(false)
    var otherPaymentID = ''
    var cardPaymentID = ''

    useEffect(() => {
        console.log("useEffect",)
        var registerId = localStorage.getItem('register');
        var user = JSON.parse(localStorage.getItem("user"));
        var LoggenInUserId = user && user.user_id ? user.user_id : '';
        var cashManagementID = localStorage.getItem('Cash_Management_ID');
        console.log("cashManagementID", cashManagementID)
        if (cashManagementID) {
            dispatch(getDetails(cashManagementID));
        }
    }, [])

    // -----received data fro Api  
    const { statusgetdetail, getdetail, errorgetdetail, is_successgetdetail } = useSelector((state) => state.cashmanagementgetdetail)

    var CashDrawerPaymentDetail = getdetail && getdetail.content
    CashDrawerPaymentDetail && CashDrawerPaymentDetail.PaymentSummery.map(item => {

        return item.Slug == 'other' ?
            otherPaymentID = item.Id

            :
            item.Slug == 'card' ?
                cardPaymentID = item.Id
                : ''


    })




    const validateEnteredCashAmount = (e) => {
        const { value } = e.target;
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$');
        if (value == '' || re.test(value)) {
            setCashAmount(value)
        }
    }
    const validateEnteredCardAmount = (e) => {
        const { value } = e.target;
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$');
        if (value == '' || re.test(value)) {
            setCardAmount(value)
        }
    }
    const validateEnteredOthersAmount = (e) => {
        const { value } = e.target;
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$');
        if (value == '' || re.test(value)) {
            setOtherPayment(value)
        }
    }

    const saveCount = () => {
        if (enteredCashAmount || enteredCardAmount || enteredOthersAmount) {
            setisSaveCount(false)
            var last_login_register_id = (localStorage.getItem("register"));
            var d = new Date();
            var dateStringWithTime = moment(d).format('YYYY-MM-DD HH:mm:ss Z');
            var localTimeZoneType = moment.tz.guess(true);
            var user = JSON.parse(localStorage.getItem("user"));
            var cashManagementID = localStorage.getItem('Cash_Management_ID');
            var otherPaymentTypes = '[';
            var otherPaymentAmount = enteredOthersAmount && enteredOthersAmount !== "" ? enteredOthersAmount : 0
            var cardPaymentAmount = enteredCardAmount && enteredCardAmount !== "" ? enteredCardAmount : 0
            if (otherPaymentID && otherPaymentID !== "") {
                otherPaymentTypes += '{"Id": "' + otherPaymentID + '","Slug": "other","ActualCloingBalance": "' + otherPaymentAmount + '"}';
            }
            if (cardPaymentID && cardPaymentID !== '') {
                otherPaymentTypes += (otherPaymentTypes == '[' ? '' : ',') + '{"Id": "' + cardPaymentID + '","Slug": "card","ActualCloingBalance": "' + cardPaymentAmount + '"}'
            }

            //'[{"Id": "' + this.state.otherPaymentID + '","Slug": "other","ActualCloingBalance": "' + this.state.enteredOthersAmount + '"},{"Id": "' + this.state.cardPaymentID + '","Slug": "card","ActualCloingBalance": "' + this.state.enteredCardAmount + '"}';
            if (CashDrawerPaymentDetail) {
                var _cashDetails = CashDrawerPaymentDetail && CashDrawerPaymentDetail
                _cashDetails && _cashDetails.PaymentSummery && _cashDetails.PaymentSummery.map((item, index) => {
                    if (item.Slug.toLowerCase() !== 'card' && item.Slug.toLowerCase() !== 'other') {
                        var ele = document.getElementById("_txtpayment" + item.Id);
                        if (ele) {
                            var _val = ele.value;
                            if (!_val || _val == '') {
                                _val = 0;
                            }
                            var _otherPayType = '{ "Id": "' + item.Id + '","Slug": "' + item.Slug + '","ActualCloingBalance":"' + _val + '"}';
                            otherPaymentTypes = (otherPaymentTypes !== '' && otherPaymentTypes !== '[' ? otherPaymentTypes + ',' : otherPaymentTypes) + _otherPayType;
                        }
                    }
                })
            }
            otherPaymentTypes = otherPaymentTypes + ']';
            var saveCountParm = {
                "Id": cashManagementID,
                "RegisterId": last_login_register_id,
                "LocalDateTime": dateStringWithTime,
                "LocalTimeZoneType": localTimeZoneType,
                "SalePersonId": user && user.user_id ? user.user_id : '',
                "ActualClosingBalance": enteredCashAmount,
                "ClosingNote": 'enterNote',
                "PaymentSummeryClosing": JSON.parse(otherPaymentTypes)
            }
            dispatch(closeRegister(saveCountParm));
            //  $('.form-control').val('');          
        }
        else {
            setisSaveCount(true)
        }
    }

    
    // -----received data fro Api  
    var diffrenttoggleShow = false
    const { statuscloseRegister, closeRegisterdetail, errorcloseRegister, is_successcloseRegister } = useSelector((state) => state.cashmanagementCloseRegister)
    if(is_successcloseRegister === true){
        diffrenttoggleShow = true
    }
    var closeregisterPaymentDetail = closeRegisterdetail && closeRegisterdetail.content



    const [toggle, settoggle] = useState(false)
    const [secondtoggle, setsecondtoggle] = useState(false)

    const doAction = () => {
        settoggle(true)
    }




    return (
        <>
            <div className="close-register-wrapper">
                <button id="cancelButton">
                    <img src={AngledBracket_left} alt="" />
                    Cancel
                </button>
                <header>
                    <img src={OpenSign} alt="" />
                    <div className="col">
                        <p className="style1">Sushi Sun</p>
                        <div className="divider" />
                        <p className="style2">Register 1</p>
                        <p className="style3">Water St. Location</p>
                    </div>
                </header>
                <main>
                    {toggle !== true ? <div className="step1 ">
                        <div className="auto-margin-top" />
                        <p className="style1">Close Register</p>
                        <div className="divider" />
                        {/* <p className="style2">Enter You User ID</p> */}
                        <PinPad doAction={doAction} />

                        <div className="auto-margin-bottom" />
                    </div> : null}


                    {toggle == true  && diffrenttoggleShow !== true ?  <div className="step2">
                        <p className="style1">Close Register</p>
                        <div className="divider" />
                        <p className="style2">
                            <b>Logged-in user:</b> Freddy Mercury
                        </p>
                        <button id="openCashDrawer">Open Cash Drawer</button>
                        <div className="input-column">
                            <div className="input-row">
                                <label htmlFor="cashInTill">Cash in Till:</label>
                                <input type="number" id="cashInTill" placeholder="Enter Amount" onChange={(e) => validateEnteredCashAmount(e)} />
                            </div>
                            {isSaveCount === true ? <>
                                <small style={{ "color": "red" }}>Amount should not be blank or empty!
                                </small>
                            </> : null}

                            {CashDrawerPaymentDetail && CashDrawerPaymentDetail.PaymentSummery && CashDrawerPaymentDetail.PaymentSummery.map((item, index) => {
                                return (item.Slug.toLowerCase() == 'card' ? <>
                                    <div className="input-row" key={index}>
                                        <label htmlFor="debitCredit">{item.Name}:</label>
                                        <input type="number" id="debitCredit" placeholder="Enter Amount" onChange={(e) => validateEnteredCardAmount(e)} />
                                    </div>
                                </> : item.Slug.toLowerCase() == 'other' ? <>
                                    <div className="input-row" key={index}>
                                        <label htmlFor="debitCredit">{item.Name}:</label>
                                        <input type="number" id="debitCredit" placeholder="Enter Amount" onChange={(e) => validateEnteredOthersAmount(e)} />
                                    </div>
                                </> : <div className="input-row" key={index}>
                                    <label htmlFor="debitCredit">{item.Name}:</label>
                                    <input type="number" id="debitCredit" placeholder="Enter Amount" />
                                </div>)
                            })
                            }
                        </div>
                        <button id="saveCount" onClick={saveCount}  >Save Count</button>
                    </div>:null}

                 {diffrenttoggleShow !== false ? <div className="step3  ">
                        <Closeregistertwo closeregisterPaymentDetail={closeregisterPaymentDetail} />
                    </div>:null }  



                </main>
            </div>

        </>
    )
}

export default Closeregister