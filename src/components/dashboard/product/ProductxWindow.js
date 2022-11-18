import React, { useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../../assets/images/svg/X-Icon-DarkBlue.svg';
import AppIconPlaceholder from '../../../assets/images/svg/AppIconPlaceholder.svg';
import { callProductXWindow } from "../../../settings/CommonFunctionProductX";
const ProductxWindow = (props) => {
    var discountList = localStorage.getItem('discountlst') ? localStorage.getItem('discountlst') : ''
    return (<div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={() =>props.ToggleProductxWindow && props.ToggleProductxWindow()}>

        <div className={props.isShow === true ? "subwindow app-launcher-subwindow current" : "subwindow app-launcher-subwindow"}>
            <div className="subwindow-header">

                <div className="app-wrapper">
                    {
                        props && props.product && props.product.ProductImage!=null?
                        <img id="appIconSRC" src={props.product.ProductImage} alt="" />
                        :
                        <img id="appIconSRC" src={AppIconPlaceholder} alt="" />
                    }
                    
                    <div className="text-col">
                        <p id="appName" className="style1">{props && props.product && props.product.Title}</p>
                        {/* <p id="appAuthorName" className="style2">Author Name</p> */}

                    </div>
                </div>
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
                    src={props.product && props.product.ParamLink ? props.product.ParamLink : ''}
                    //src='http://localhost:3000/externalApp/30cartDiscount.html'
                    frameBorder="0"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                // ref={(f) => this.ifr = f}
                ></iframe>
            </div>
        </div></div>)
}

export default ProductxWindow 