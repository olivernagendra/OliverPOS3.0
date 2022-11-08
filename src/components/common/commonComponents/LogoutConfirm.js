import React from "react";
import { useNavigate } from "react-router-dom";
const LogoutConfirm = (props) => {
    const navigate = useNavigate();
   return <div class={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"}>
        <div class={props.isShow === true ? "subwindow logout-confirm current" : "subwindow logout-confirm"}>
            <div className="subwindow-body">
                <div className="auto-margin-top"></div>
                <p className="style1">Account Logout Confirmation</p>
                <p className="style2">
                    Are you sure you want to logout <br />
                    of the Oliver POS app?
                </p>
                <p className="style2">
                    You will need the account username and <br />
                    password to log back in.
                </p>
                <button id="registerLogout" onClick={() => navigate('/login')}>Logout</button>
                <button id="cancelRegisterLogout" onClick={() => props.toggleLogoutConfirm()}>Cancel</button>
                <div className="auto-margin-bottom"></div>
            </div>
        </div>
    </div>
}

export default LogoutConfirm 