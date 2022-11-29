import React from "react";
import { useNavigate } from "react-router-dom";
const LogoutConfirm = (props) => {
    const navigate = useNavigate();
    const logout = () => {
        var isDemoUser = localStorage.getItem('demoUser')
        var clientDetail = localStorage.getItem('clientDetail')
        if (isDemoUser == 'true' || !clientDetail) {
            //history.push('/login');
            const Android = window.Android;
            if ((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper") == true)) {
                Android.wrapperLogout();
            }
            else {
                navigate("/login");
            }
        } else {
            const Android = window.Android;
            if ((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper") == true)) {
                Android.wrapperLogout();
            }
            else
            {navigate("/login");}

        }
    }
   
    return <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"}>
        <div className={props.isShow === true ? "subwindow logout-confirm current" : "subwindow logout-confirm"}>
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
                <button id="registerLogout" onClick={() => logout()}>Logout</button>
                <button id="cancelRegisterLogout" onClick={() => props.toggleLogoutConfirm()}>Cancel</button>
                <div className="auto-margin-bottom"></div>
            </div>
        </div>
    </div>
}

export default LogoutConfirm 