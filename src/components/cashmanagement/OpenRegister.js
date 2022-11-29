import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import AngledBracket_Left_White from '../../assets/images/svg/AngledBracket-Left-White.svg'
import LogOut_Icon_White from '../../assets/images/svg/LogOut-Icon-White.svg'
import Closed_Sign_White from '../../assets/images/svg/Closed-Sign-White.svg'

import PinPad from "../pinPage/PinPad"
import { get_locName, get_regName, get_userName, getShopName } from "../common/localSettings"

import { useNavigate } from 'react-router-dom';

import { openRegister } from './CashmanagementSlice'
import moment from 'moment';
import STATUSES from "../../constants/apiStatus";
import { initOpenRegisterFn } from "../common/commonFunctions/openRegisterFn"
import LogoutConfirm from "../common/commonComponents/LogoutConfirm";
import { openCashBox } from "../../settings/AndroidIOSConnect";
const OpenRegister = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [enteredAmount, setEnteredAmount] = useState(0.00)
    const [notes, setNotes] = useState("")
    const [toggle, settoggle] = useState(false)
    const [togglePin, settogglePin] = useState(false)
    const [isAmountEntered, setIsAmountEntered] = useState(false);

    const [isShowLogoutConfirm, setisShowLogoutConfirm] = useState(false)
    const toggleLogoutConfirm = () => {
        setisShowLogoutConfirm(!isShowLogoutConfirm)
    }

    const hundleToggle = () => {
        settoggle(true)
        // if (localStorage.getItem('user')) {

        // }
        // else {
        //     settogglePin(true)
        // }


    }


    const validateEnteredAmount = (e) => {
        const { value } = e.target;
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$');
        if (value === '' || re.test(value)) {
            setEnteredAmount(value)
        }
    }


    const enterNote = (e) => {
        const { value } = e.target;
        setNotes(value)
    }

    const doAction = () => {
        //toggle(true)
        settogglePin(true)
    }





    const openRegisterhundle = () => {
        if (enteredAmount && enteredAmount != '') {
            setIsAmountEntered(false)
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
                "ActualOpeningBalance": enteredAmount,
                "OpeningNote": notes,
                "LocalTimeZoneOffsetValue": getLocalTimeZoneOffsetValue
            }
            dispatch(openRegister(open_register_param));


        }
        else {
            setIsAmountEntered(true)
        }
    }

    //  Save cashManagementID when response
    const { statusopenRegister, dataopenRegister, erroropenRegister, is_successopenRegister } = useSelector((state) => state.openRegister)
    console.log("statusopenRegister", statusopenRegister, "dataopenRegister", dataopenRegister, "erroropenRegister", erroropenRegister, "is_successopenRegister", is_successopenRegister)



    if (statusopenRegister === STATUSES.IDLE && is_successopenRegister) {
        if (dataopenRegister && dataopenRegister.content && dataopenRegister.content !== undefined) {
            console.log(" dashboard first array id .Id", dataopenRegister.content.Id)
            localStorage.setItem("Cash_Management_ID", dataopenRegister.content.Id);
            localStorage.setItem("IsCashDrawerOpen", "true");
            navigate('/productloader')
        }
    }


    const handleGoBack = () => {
        settoggle(false)
        settogglePin(false)
    }

    useEffect(() => {
        //openRegisterFn();
        // initOpenRegisterFn();      
    }, []);

    var isUserExist = localStorage.getItem("user") ? true : false
    // console.log("toggle", toggle)
    // console.log("togglePin", togglePin)
    // console.log("isUserExist", isUserExist)
    return <React.Fragment><div className="open-register-wrapper state-1">

        {toggle == true && <button id="cancel" onClick={handleGoBack}>
            <img src={AngledBracket_Left_White} alt="" />
            Go Back
        </button>}

        {toggle == false && <button id="cancel" onClick={() => navigate('/register')}>
            <img src={AngledBracket_Left_White} alt="" />
            Cancel
        </button>}
        {toggle == false && <button id="logout-landscape" onClick={() => toggleLogoutConfirm()} className={toggle == true ? "hidden" : ""}>
            <img src={LogOut_Icon_White} alt="" />
            Log Out
        </button>}
        <header>
            <div className="auto-margin-top"></div>
            <img src={Closed_Sign_White} alt="" />
            <div className="col">
                <p className="style1">{getShopName()}</p>
                <div className="divider"></div>
                <p className="style2">{get_regName()}</p>
                <p className="style3">{get_locName()}</p>
            </div>
            <div className="auto-margin-bottom"></div>
        </header>

        <main>
            <div className="auto-margin-top"></div>

            <div className="step1">
                {toggle == false ? <>  <p>Ready to Open?</p>
                    <button id="" onClick={hundleToggle}>Open Register</button> </> : null}


            </div>{toggle == true && isUserExist == true ? <div className="step2 ">
                <p>Start Your Cash Float</p>
                {
                    (isAmountEntered === true) ?
                        <label style={{ "color": "red", "marginBottom": "10px" }} >Amount field can not be blank"</label>
                        : null
                }
                <label htmlFor="floatAmount">Opening float amount ($):</label>

                <input className="floatAmountfont" type="number" id="floatAmount" onChange={(e) => validateEnteredAmount(e)} placeholder='Enter Amount' />
                {/* placeholder='Enter Amount' */}

                <button id="openCashDrawer" onClick={()=>openCashBox()}>Open Cash Drawer</button>
                <label htmlFor="openNote">Optional - add a note:</label>
                <textarea name="openNote" id="openNote" placeholder="Add your note here" onChange={(e) => enterNote(e)}></textarea>
                <button id="openFloatButton" onClick={openRegisterhundle} >Open Float</button>
            </div> : null}
            {toggle == true && togglePin == false && isUserExist == false ? <div className="step3 ">
                {<PinPad enteredAmount={enteredAmount}
                    notes={notes}
                    doAction={doAction}
                ></PinPad>}
            </div> : null}

            <div className="auto-margin-bottom"></div>
        </main>
        <button id="logout-mobile" onClick={() => toggleLogoutConfirm()}>
            <img src={LogOut_Icon_White} alt="" />
            Log Out
        </button>

    </div>
        {/* // <div className="logout-confirmation-wrapper hidden">
        //     <div className="auto-margin-top"></div>
        //     <p className="style1">Account Logout Confirmation</p>
        //     <p className="style2">
        //         Are you sure you want to logout <br />
        //         of the Oliver POS app? <br />
        //         <br />
        //         You will need the account username and <br />
        //         password to log back in.
        //     </p>
        //     <button id="logoutConfirm">Logout</button>
        //     <button id="logoutCancel">Cancel</button>
        //     <div className="auto-margin-bottom"></div>
        // </div> */}
        {isShowLogoutConfirm === true ? <LogoutConfirm isShow={isShowLogoutConfirm} toggleLogoutConfirm={toggleLogoutConfirm}></LogoutConfirm> : null}
    </React.Fragment>


}

export default OpenRegister