import React from "react";
import X_Icon_DarkBlue from '../../assets/images/svg/X-Icon-DarkBlue.svg'
import NoImageAvailable from '../../assets/images/svg/NoImageAvailable.svg';


const IframeWindow = (props) => {
    console.log("props.exApp", props, X_Icon_DarkBlue)
    return (<div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={() => props.toggleiFrameWindow()}><div id="iframeSubwindow" className={props.isShow === true ? "subwindow iframe-popup current" : "subwindow iframe-popup"}>
        <div className="subwindow-header">
            <div className="img-container">
                {props && props.exApp && props.exApp.logo != null ? <img src={props.exApp.logo} alt="" onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = NoImageAvailable;
                }} /> : <img src={NoImageAvailable} alt="" />}

            </div>
            <div className="col">
                <p className="style1">{props && props.exApp && props.exApp.Name}</p>
                <p className="style2">Placeholder</p>
            </div>
            <button className="close-subwindow">
                <img src={X_Icon_DarkBlue} alt="" />
            </button>
        </div>
        <div className="subwindow-body">
            <iframe
                src={props.product && props.product.ParamLink ? props.product.PageUrl : props.exApp ? props.exApp.PageUrl : ''}
                frameBorder="0"
                sandbox="allow-scripts allow-same-origin allow-forms"
                id="commoniframe"
            // ref={(f) => this.ifr = f}
            ></iframe>
        </div>
    </div></div>)
}

export default IframeWindow 