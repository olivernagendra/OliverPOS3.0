import React, { useEffect, useLayoutEffect, useState } from "react";
import X_Icon_DarkBlue from '../../../images/svg/X-Icon-DarkBlue.svg';
import Pencil_Blue from '../../../images/svg/Pencil-Blue.svg';
import { useDispatch, useSelector } from "react-redux";
import { updateInventory } from '../slices/productQuantityInWarehouseSlice'

const AdjustInventory = (props) => {
    const [inventory, setInventory] = useState(props.productStockQuantity)
    const [isAllowUpdate, setIsAllowUpdate] = useState(false);
    const [prodcutInWarehouse] = useSelector((state) => [state.productQuantityInWarehouse])
    const dispatch = useDispatch()
    console.log("prodcutInWarehouse", prodcutInWarehouse)
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleAdjustInventory();
        }
    }
    var warehouseDetail = prodcutInWarehouse && prodcutInWarehouse.data && prodcutInWarehouse.data.content
    var CurrentWarehouseId = localStorage.getItem("WarehouseId");
    var currentWareHouseDetail = "";
    if (warehouseDetail && warehouseDetail.length > 0) {
        currentWareHouseDetail = warehouseDetail.find(item => item.warehouseId == CurrentWarehouseId)
    }

    const handleUpdateInventory = () => {

        //var inventoryAmount = $('#txtInv').val();

        var data = {
            quantity: inventory == '' ? 0 : inventory,
            wpid: (props.product) ? props.product.WPID : props.product ? props.product.WPID : '',
            WarehouseId: CurrentWarehouseId
        }
        //var inventoryDetails = (props.product ) ? props.product : inventoryCheck && inventoryCheck.WPID ? [inventoryCheck] : []

        dispatch(updateInventory(data));



    }
    const handleInventoryChange = (e) => {
        setInventory(e.target.value)
    }
    const allowUpdate = () => {
        setIsAllowUpdate(true);
    }
    console.log("isAllowUpdate", isAllowUpdate)
    var isOutOfStock = currentWareHouseDetail.Quantity > 0 ? false : true;
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? "subwindow adjust-inventory current" : "subwindow adjust-inventory"}>
                <div className="subwindow-header">
                    <p>Adjust Inventory</p>
                    <button className="close-subwindow" onClick={() => props.toggleAdjustInventory()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="auto-margin-top"></div>
                    <p>Current Warehouse</p>
                    <label htmlFor="productStock">Currently {isOutOfStock == true ? "out of" : "in"} Stock:</label>
                    <input type="number" id="productStock" value={inventory} disabled={isAllowUpdate == true ? false : true} onChange={(e) => handleInventoryChange(e)} />
                    <button id="editStockButton" onClick={() => allowUpdate()}>
                        <img src={Pencil_Blue} alt="" />
                        Click to edit
                    </button>
                    <button id="updateStockButton" onClick={() => handleUpdateInventory()}>Update Inventory</button>
                    <p>Other Warehouses</p>
                    {warehouseDetail && warehouseDetail.length > 0 &&
                        warehouseDetail.map(item => {
                            if (item.warehouseId !== parseInt(CurrentWarehouseId)) {
                                return <div className="text-row">
                                    <p><b>{item.warehouseName}</b></p>
                                    <p><b>{item.Quantity}</b> in stock</p>
                                </div>
                            }
                        })
                    }
                    <div className="auto-margin-bottom"></div>
                </div>
            </div></div >)
}

export default AdjustInventory 