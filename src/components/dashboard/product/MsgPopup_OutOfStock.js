import React from "react";
import OutOfStock from '../../../assets/images/svg/OutOfStock.svg';
import LocalizedLanguage from "../../../settings/LocalizedLanguage";
const MsgPopup_OutOfStock = (props) => {
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleOutOfStock();
        }
    }
    const AdjustInventory=()=>
    {
        if(props.toggleAdjustInventory)
        {
            props.toggleOutOfStock();
            props.toggleAdjustInventory();
        }
        
    }
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? "subwindow out-of-stock current" : "subwindow out-of-stock"}>
                <div className="subwindow-body">
                    <div className="auto-margin-top"></div>
                    <p className="style1">Product Out of Stock</p>
                    <img src={OutOfStock} alt="" />
                    <p className="style2">
                        This product is out of stock, <br />
                        try <button id="outOfStockToAdjustInventory" onClick={()=>AdjustInventory()}>adjusting the inventory.</button>
                    </p>
                    <button id="closeOutOfStock" onClick={() => props.toggleOutOfStock()}>{LocalizedLanguage.goBack}</button>
                    <div className="auto-margin-bottom"></div>
                </div>
            </div></div>)
}

export default MsgPopup_OutOfStock 