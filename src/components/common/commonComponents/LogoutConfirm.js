import React from "react";
import { useNavigate } from "react-router-dom";
const LogoutConfirm = (props) => {
    const navigate = useNavigate();
   return <div class={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"}>
        <div class={props.isShow === true ? "subwindow logout-confirm current" : "subwindow logout-confirm"}>
            <div class="subwindow-body">
                <div class="auto-margin-top"></div>
                <p class="style1">Account Logout Confirmation</p>
                <p class="style2">
                    Are you sure you want to logout <br />
                    of the Oliver POS app?
                </p>
                <p class="style2">
                    You will need the account username and <br />
                    password to log back in.
                </p>
                <button id="registerLogout" onClick={() => navigate('/login')}>Logout</button>
                <button id="cancelRegisterLogout" onClick={() => props.toggleLogoutConfirm()}>Cancel</button>
                <div class="auto-margin-bottom"></div>
            </div>
        </div>
    </div>
}

export default LogoutConfirm 