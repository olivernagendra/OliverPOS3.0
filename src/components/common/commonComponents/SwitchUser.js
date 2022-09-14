import React, { useEffect, useLayoutEffect } from "react";
import AngledBracket_Left_Blue from '../../../images/svg/AngledBracket-Left-Blue.svg';
import X_Icon_DarkBlue from '../../../images/svg/X-Icon-DarkBlue.svg';
import SwitchUser_Icon from '../../../images/svg/SwitchUser-Icon.svg';
import Backspace_BaseBlue from '../../../images/svg/Backspace-BaseBlue.svg';
import PinPad from "../../PinPad";
const SwitchUser = (props) => {
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleSwitchUser();
        }
    }
    return <div className={props.isShow===true? "subwindow-wrapper":"subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
        <div className={props.isShow===true?"subwindow switch-user current":"subwindow switch-user"}>
        <div className="subwindow-header">
            <p>Switch User</p>
            <button className="close-subwindow" onClick={()=>props.toggleSwitchUser()}>
                <img src={X_Icon_DarkBlue} alt="" />
            </button>
        </div>
        <div className="subwindow-body">
            <button className="close-subwindow mobile-close-subwindow">
                <img src={AngledBracket_Left_Blue} alt="" />
                Back
            </button>
            <div className="auto-margin-top"></div>
            <div className="group">
                <img src={SwitchUser_Icon} alt="" />
                <p>Switch Users</p>
            </div>
            <p className="style1">
                Sign-in to this register using your User ID. <br />
                This automatically signs out <br />
                the user currently logged in.
            </p>
            <div className="divider"></div>
            <p className="style2">Enter Your User ID</p>
           { props.isShow===true? <PinPad switchUser={true}></PinPad>:null}
            {/* <div className="pinpad">
                <div className="pin-entries">
                    <div className="pin-entry"></div>
                    <div className="pin-entry"></div>
                    <div className="pin-entry"></div>
                    <div className="pin-entry"></div>
                    <div className="pin-entry"></div>
                    <div className="pin-entry"></div>
                </div>
                <div className="pin-button-row">
                    <button>1</button>
                    <button>2</button>
                    <button>3</button>
                </div>
                <div className="pin-button-row">
                    <button>4</button>
                    <button>5</button>
                    <button>6</button>
                </div>
                <div className="pin-button-row">
                    <button>7</button>
                    <button>8</button>
                    <button>9</button>
                </div>
                <div className="pin-button-row">
                    <button>0</button>
                    <button className="backspace">
                        <img src={Backspace_BaseBlue} alt="" />
                    </button>
                </div>
            </div> */}
            <div className="auto-margin-bottom"></div>
        </div>
    </div></div>
}

export default SwitchUser 