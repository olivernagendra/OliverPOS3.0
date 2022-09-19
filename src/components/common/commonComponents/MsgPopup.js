import React from "react";
const MsgPopup = (props) => {
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleMsgPopup() && props.toggleMsgPopup();
        }
    }
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? "subwindow no-variation-selected current" : "subwindow no-variation-selected"}>
                <div className="subwindow-body">
                    <div className="auto-margin-top"></div>
                    <p className="style1">{props.msgTitle && props.msgTitle}</p>
                    <p className="style2">
                       {props.msgBody && props.msgBody}<br />
                    </p>
                    <button  onClick={() => props.toggleMsgPopup() && props.toggleMsgPopup()}>Go Back</button>
                    <div className="auto-margin-bottom"></div>
                </div>
            </div></div>)
}

export default MsgPopup 