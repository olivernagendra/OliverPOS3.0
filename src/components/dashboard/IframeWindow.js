import React, { useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../assets/images/svg/X-Icon-DarkBlue.svg';
import AppIconPlaceholder from '../../assets/images/svg/AppIconPlaceholder.svg';
const IframeWindow = (props) => {
    return (<div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={() => props.toggleiFrameWindow()}>

        <div className={props.isShow === true ? "subwindow app-launcher-subwindow current" : "subwindow app-launcher-subwindow"}>
            <div className="subwindow-header">

                <div className="app-wrapper">
                    <img id="appIconSRC" src={AppIconPlaceholder} alt="" />
                    <div className="text-col">
                        <p id="appName" className="style1">{props && props.exApp && props.exApp.Name}</p>
                        <p id="appAuthorName" className="style2">Author Name</p>

                    </div>
                </div>
                <label id="app_Name" style={{ display: "none" }}>{props && props.exApp && props.exApp.Name}</label>
                <label id="app_Id" style={{ display: "none" }}>{props && props.exApp && props.exApp.Id}</label>
                <button className="close-subwindow">
                    <img src={X_Icon_DarkBlue} alt="" />
                </button>

                {/* <div className="img-container">
                <img src="" alt="" />
            </div>
            <div className="col">
                <p className="style1">{props && props.exApp && props.exApp.Name}</p>
                <p className="style2">Placeholder</p>
            </div>
            <button className="close-subwindow">
                <img src={X_Icon_DarkBlue} alt="" />
            </button> */}
            </div>
            <div className="subwindow-body">
                <iframe
                    id="commoniframe"
                    // src={props.product && props.product.ParamLink ? props.product.PageUrl : props.exApp ? props.exApp.PageUrl : ''}
                    src='http://localhost:3000/externalApp/paymentApp.html'
                    frameBorder="0"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                // ref={(f) => this.ifr = f}
                ></iframe>
            </div>
        </div></div>)
}

export default IframeWindow 