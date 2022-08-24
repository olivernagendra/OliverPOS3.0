import React, { useState, useEffect } from "react"
import AngledBracket_Left_White from '../images/svg/AngledBracket-Left-White.svg'
import LogOut_Icon_White from '../images/svg/LogOut-Icon-White.svg'
import Closed_Sign_White from '../images/svg/Closed-Sign-White.svg'
import PinPad from "./PinPad"
import { get_locName, get_regName, get_userName } from "./common/localSettings"
import { openRegisterFn } from "./common/EventFunctions"
import { useNavigate } from 'react-router-dom';

const OpenRegister = () => {
    const navigate = useNavigate();
    useEffect(() => {
        openRegisterFn();
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
                <label for="floatAmount">Opening float amount ($):</label>
                <input type="number" id="floatAmount" value="200.00" />
                <button id="openCashDrawer">Open Cash Drawer</button>
                <label for="openNote">Optional - add a note:</label>
                <textarea name="openNote" id="openNote" placeholder="Add your note here"></textarea>
                <button id="openFloatButton">Open Float</button>
            </div>
            <div className="step3 hidden">
                {<PinPad></PinPad>}
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