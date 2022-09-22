import React, {useState, useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../../images/svg/X-Icon-DarkBlue.svg';
import Pencil_Blue from '../../../images/svg/Pencil-Blue.svg';
const AdjustInventory = (props) => {
    const [isEditInventory, setisEditInventory] = useState(false);
    const toggleEditInventory = () => {
        setisEditInventory(!isEditInventory)
    }
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleAdjustInventory();
        }
    }
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? "subwindow adjust-inventory current" : "subwindow adjust-inventory"}>
                <div className="subwindow-header">
                    <p>Adjust Inventory</p>
                    <button className="close-subwindow" onClick={()=>props.toggleAdjustInventory()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="auto-margin-top"></div>
                    <p>Current Warehouse</p>
                    <label htmlFor="productStock">Currently in Stock:</label>
                    <input type="number" id="productStock" value="23" disabled={isEditInventory==true?false:true} />
                    <button id="editStockButton" onClick={()=>toggleEditInventory()}>
                        <img src={Pencil_Blue} alt="" />
                        Click to edit
                    </button>
                    <button id="updateStockButton">Update Inventory</button>
                    <p>Other Warehouses</p>
                    <div className="text-row">
                        <p><b>Warehouse B</b></p>
                        <p><b>25</b> in stock</p>
                    </div>
                    <div className="text-row">
                        <p><b>Warehouse C</b></p>
                        <p><b>125</b> in stock</p>
                    </div>
                    <div className="auto-margin-bottom"></div>
                </div>
            </div></div>)
}

export default AdjustInventory 