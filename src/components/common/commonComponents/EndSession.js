import React, { useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../../assets/images/svg/X-Icon-DarkBlue.svg';
import AngledBracket_Left_Blue from '../../../assets/images/svg/AngledBracket-Left-Blue.svg';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { createPin, validatePin } from "../../pinPage/pinSlice"
const EndSession = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            localStorage.removeItem("user")
            props.toggleShowEndSession();
        }
        else {
            e.stopPropagation();
        }
        console.log(e.target.className)
    }
    const handleClose = () => {
        localStorage.removeItem("user");
        dispatch(validatePin());
        setTimeout(() => {
            navigate('/pin')
        }, 50);

    }
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)} style={{ zIndex: 9 }}>
            <div className={props.isShow === true ? "subwindow end-session current" : "subwindow end-session"}>
                <div className="subwindow-header">
                    <p>End Session</p>
                    <button className="close-subwindow" onClick={() => props.toggleShowEndSession()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <button className="close-subwindow mobile-close-subwindow" onClick={() => props.toggleShowEndSession()}>
                        <img src={AngledBracket_Left_Blue} alt="" />
                        Back
                    </button>
                    <div className="auto-margin-top"></div>
                    <p className="style1">End This Session</p>
                    <p className="style2">
                        Signs out the current user. <br />
                        By ending the session you will be <br />
                        brought back to the User ID log-in <br />
                        screen.
                    </p>
                    <button id="logoutButton" onClick={handleClose}>End Session</button>
                    <div className="auto-margin-bottom"></div>
                </div>
            </div></div >)
}

export default EndSession 