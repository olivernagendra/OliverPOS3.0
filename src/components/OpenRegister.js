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
    return <React.Fragment><div class="open-register-wrapper">
        <button id="cancel">
            <img src={AngledBracket_Left_White} alt="" />
            Cancel
        </button>
        <button id="logout" onClick={() => navigate('/')}>
            <img src={LogOut_Icon_White} alt="" />
            Log Out
        </button>
        <header>
            <div class="auto-margin-top"></div>
            <img src={Closed_Sign_White} alt="" />
            <div class="col">
                <p class="style1">{get_userName()}</p>
                <div class="divider"></div>
                <p class="style2">{get_regName()}</p>
                <p class="style3">{get_locName()}</p>
            </div>
            <div class="auto-margin-bottom"></div>
        </header>

        <main>
            <div class="auto-margin-top"></div>
            <div class="step1">
                <p>Ready to Open?</p>
                <button id="openRegisterButton">Open Register</button>
            </div>
            <div class="step2 hidden">
                <p>Start Your Cash Float</p>
                <label for="floatAmount">Opening float amount ($):</label>
                <input type="number" id="floatAmount" value="200.00" />
                <button id="openCashDrawer">Open Cash Drawer</button>
                <label for="openNote">Optional - add a note:</label>
                <textarea name="openNote" id="openNote" placeholder="Add your note here"></textarea>
                <button id="openFloatButton">Open Float</button>
            </div>
            <div class="step3 hidden">
                {<PinPad></PinPad>}
            </div>
            <div class="auto-margin-bottom"></div>
        </main>


    </div>
        <div class="logout-confirmation-wrapper hidden">
            <div class="auto-margin-top"></div>
            <p class="style1">Account Logout Confirmation</p>
            <p class="style2">
                Are you sure you want to logout <br />
                of the Oliver POS app? <br />
                <br />
                You will need the account username and <br />
                password to log back in.
            </p>
            <button id="logoutConfirm">Logout</button>
            <button id="logoutCancel">Cancel</button>
            <div class="auto-margin-bottom"></div>
        </div>
    </React.Fragment>


}

export default OpenRegister