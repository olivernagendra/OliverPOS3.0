import React, { useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';
import { useNavigate } from 'react-router-dom';
const MsgPopup_EndSession = () => {
    const navigate = useNavigate();
    return (
        <div className="subwindow end-session">
        <div className="subwindow-header">
            <p>End Session</p>
            <button className="close-subwindow">
                <img src={X_Icon_DarkBlue} alt="" />
            </button>
        </div>
        <div className="subwindow-body">
            <button className="close-subwindow mobile-close-subwindow">
                <img src="../Assets/Images/SVG/AngledBracket-Left-Blue.svg" alt="" />
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
            <button id="logoutButton" onClick={()=>navigate('/pin')}>End Session</button>
            <div className="auto-margin-bottom"></div>
        </div>
    </div>)
}

export default MsgPopup_EndSession 