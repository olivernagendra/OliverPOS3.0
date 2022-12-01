import React from 'react';
import GreyAlert from '../../../assets/images/svg/GreyAlert.svg';
const RegisterTakeOver = (props) => {
    // const outerClick = (e) => {
    //     if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
    //         props.toggleRegTakeOver && props.toggleRegTakeOver();
    //     }
    // }
    return (
        // <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
        //     <div className={props.isShow === true ? "subwindow register-taken current" : "subwindow register-taken"}>
            <div className="subwindow-wrapper hidden" id="register-taken-parent">
            <div className="subwindow register-taken" id="register-taken">
                <div className="subwindow-header">
                    <p>Register Take Over</p>
                </div>
                <div className="subwindow-body">
                    <div className="auto-margin-top"></div>
                    <img src={GreyAlert} alt="" />
                    <p>
                        This register has been <br />
                        taken over by another user. <br /><br />
                        You will be logged out.
                    </p>
                    <div className="auto-margin-bottom"></div>
                </div></div>
        </div>);
}
export default RegisterTakeOver;