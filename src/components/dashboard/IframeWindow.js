import React, { useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';

const IframeWindow = (props) => {
    return ( <div className={props.isShow===true? "subwindow-wrapper":"subwindow-wrapper hidden"} onClick={()=>props.toggleiFrameWindow()}><div id="iframeSubwindow" className={props.isShow===true?"subwindow iframe-popup current":"subwindow iframe-popup"}>
    <div className="subwindow-header">
        <div className="img-container">
            <img src="" alt="" />
        </div>
        <div className="col">
            <p className="style1">Placeholder</p>
            <p className="style2">Placeholder</p>
        </div>
        <button className="close-subwindow">
            <img src={X_Icon_DarkBlue} alt="" />
        </button>
    </div>
    <div className="subwindow-body">
        <iframe src="" frameBorder="0"></iframe>
    </div>
</div></div>)
}

export default IframeWindow 