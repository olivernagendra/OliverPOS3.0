import React from "react";
import LocalizedLanguage from "../../../settings/LocalizedLanguage";
const MsgPopup = (props) => {
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleMsgPopup() && props.toggleMsgPopup();
        }
    }
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
        <div className={props.isShow === true ? "subwindow upgrade-to-unlock current" : "subwindow upgrade-to-unlock"}>
				<div className="subwindow-body" onClick={(e) => outerClick(e)}>
					<div className="auto-margin-top"></div>
					{/* <img src={null} alt="" /> */}
					<p className="style1">{props.msgTitle && props.msgTitle}</p>
					<p className="style2">
                    {props.msgBody && props.msgBody}
					</p>
					<button onClick={() => props.toggleMsgPopup() && props.toggleMsgPopup()}>{LocalizedLanguage.goBack}</button>
					<div className="auto-margin-bottom"></div>
				</div>
			</div>
            {/* <div className={props.isShow === true ? "subwindow upgrade-to-unlock current" : "subwindow upgrade-to-unlock"}>
                <div className="subwindow-body">
                    <div className="auto-margin-top"></div>
                    <p className="style1">{props.msgTitle && props.msgTitle}</p>
                    <p className="style2">
                       {props.msgBody && props.msgBody}<br />
                    </p>
                    <button  onClick={() => props.toggleMsgPopup() && props.toggleMsgPopup()}>Go Back</button>
                    <div className="auto-margin-bottom"></div>
                </div>
            </div> */}
            </div>)
}

export default MsgPopup 