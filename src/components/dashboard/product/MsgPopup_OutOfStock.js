import React from "react";
import NoVariationsSelected from '../../images/svg/NoVariationsSelected.svg';
const MsgPopup_OutOfStock = (props) => {
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleOutOfStock();
        }
    }
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? "subwindow no-variation-selected current" : "subwindow no-variation-selected"}>
                <div class="subwindow-body">
                    <div class="auto-margin-top"></div>
                    <p class="style1">Product Out of Stock</p>
                    <img src="../Assets/Images/SVG/OutOfStock.svg" alt="" />
                    <p class="style2">
                        This product is out of stock, <br />
                        try <button id="outOfStockToAdjustInventory">adjusting the inventory.</button>
                    </p>
                    <button id="closeOutOfStock" onClick={() => props.toggleOutOfStock()}>Go Back</button>
                    <div class="auto-margin-bottom"></div>
                </div>
            </div></div>)
}

export default MsgPopup_OutOfStock 