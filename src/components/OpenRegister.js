import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import AngledBracket_Left_White from '../images/svg/AngledBracket-Left-White.svg'
import LogOut_Icon_White from '../images/svg/LogOut-Icon-White.svg'
import Closed_Sign_White from '../images/svg/Closed-Sign-White.svg'
import PinPad from "./PinPad"
import { get_locName, get_regName, get_userName } from "./common/localSettings"

import { useNavigate } from 'react-router-dom';

import { openRegister } from '../components/cashmanagement/CashmanagementSlice'
import moment from 'moment';
import STATUSES from "../constants/apiStatus";
import { initOpenRegisterFn } from "./common/commonFunctions/openRegisterFn"

const OpenRegister = () => {
    const [amount, setAmount] = useState("")
    const [notes, setNotes] = useState("")
    const [userRequest, setUserRequest] = useState({
        setFieldErr: '',
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleAmount = (e) => {
        setAmount(e.target.value);
    }

    const handleNotes = (e) => {
        setNotes(e.target.value);
    }

    const hundleSubmit = () => {
        if (amount && amount != '') {
            setUserRequest({
                setFieldErr: ''
            });
        } else {
            setUserRequest({
                setFieldErr: 'Please enter amout'
            });
        }

        openRegisterhundle()
    }



    const openRegisterhundle = async () => {
        console.log("openRegisterhundle")
        if (amount && amount != '') {
            console.log("amount", amount)
            //setIsAmountEntered(false)
            //  this.setState({ enteredAmount: 0.00, enterNote: '' });
            var d = new Date();
            var dateStringWithTime = moment(d).format('YYYY-MM-DD HH:mm:ss Z');
            var getLocalTimeZoneOffsetValue = d.getTimezoneOffset();
            var localTimeZoneType = moment.tz.guess(true);
            var user = JSON.parse(localStorage.getItem("user"));
            var registerName = (localStorage.getItem("registerName"));
            var last_login_register_id = (localStorage.getItem("register"));
            var LocationName = (localStorage.getItem("LocationName"));
            var last_login_Location_id = (localStorage.getItem("Location"));
            var open_register_param = {
                "RegisterId": last_login_register_id,
                "RegisterName": registerName,
                "LocationId": last_login_Location_id,
                "LocationName": LocationName,
                "LocalDateTime": dateStringWithTime,
                "LocalTimeZoneType": localTimeZoneType,
                "SalePersonId": user && user.user_id ? user.user_id : '',
                "SalePersonName": user && user.display_name ? user.display_name : '',
                "SalePersonEmail": user && user.user_email ? user.user_email : '',
                "ActualOpeningBalance": amount,
                "OpeningNote": notes,
                "LocalTimeZoneOffsetValue": getLocalTimeZoneOffsetValue
            }
            dispatch(openRegister(open_register_param));

            //  $(".form-control").val('');
        }
        else {
            //  setIsAmountEntered(true)
        }
    }





    const { statusopenRegister, dataopenRegister, erroropenRegister, is_successopenRegister } = useSelector((state) => state.openRegister)
    console.log("statusopenRegister", statusopenRegister, "dataopenRegister", dataopenRegister, "erroropenRegister", erroropenRegister, "is_successopenRegister", is_successopenRegister)

    if (statusopenRegister === STATUSES.IDLE && is_successopenRegister) {
        if (dataopenRegister && dataopenRegister.content && dataopenRegister.content !== undefined) {
            localStorage.setItem("Cash_Management_ID", dataopenRegister.content.Id);
            localStorage.setItem("IsCashDrawerOpen", "true");
        }
    }




    useEffect(() => {
        openRegisterFn();
        initOpenRegisterFn();
    }, []);

    return <React.Fragment><div className="open-register-wrapper">
        <button id="cancel">
            <img src={AngledBracket_Left_White} alt="" />
            Cancel
        </button>
        <button id="logout" onClick={() => navigate('/')}>
            <img src={LogOut_Icon_White} alt="" />
            Log Out
        </button>
        <header>
            <div className="auto-margin-top"></div>
            <img src={Closed_Sign_White} alt="" />
            <div className="col">
                <p className="style1">{get_userName()}</p>
                <div className="divider"></div>
                <p className="style2">{get_regName()}</p>
                <p className="style3">{get_locName()}</p>
            </div>
            <div className="auto-margin-bottom"></div>
        </header>

        <main>
            <div className="auto-margin-top"></div>
            <div className="step1">
                <p>Ready to Open?</p>
                <button id="openRegisterButton">Open Register</button>
            </div>
            <div className="step2 hidden">
                <p>Start Your Cash Float</p>
                <label htmlFor="floatAmount">Opening float amount ($):</label>
                <input type="number" placeholder='Enter Amount' id="floatAmount" onChange={(e) => handleAmount(e)} />
                <button id="openCashDrawer" >Open Cash Drawer</button>
                <label htmlFor="openNote">Optional - add a note:</label>
                <textarea name="openNote" id="openNote" placeholder="Add your note here" onChange={(e) => handleNotes(e)}></textarea>
                <button id="openFloatButton" onClick={hundleSubmit} >Open Float</button>
            </div>
            <div className="step3 hidden">
                {<PinPad amount={amount}
                    notes={notes}
                ></PinPad>}
            </div>
            <div className="auto-margin-bottom"></div>
        </main>


    </div>
        <div className="logout-confirmation-wrapper hidden">
            <div className="auto-margin-top"></div>
            <p className="style1">Account Logout Confirmation</p>
            <p className="style2">
                Are you sure you want to logout <br />
                of the Oliver POS app? <br />
                <br />
                You will need the account username and <br />
                password to log back in.
            </p>
            <button id="logoutConfirm">Logout</button>
            <button id="logoutCancel">Cancel</button>
            <div className="auto-margin-bottom"></div>
        </div>
    </React.Fragment>


}

export default OpenRegister