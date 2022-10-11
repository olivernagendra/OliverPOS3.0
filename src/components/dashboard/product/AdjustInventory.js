import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import X_Icon_DarkBlue from '../../../assets/images/svg/X-Icon-DarkBlue.svg';
import Pencil_Blue from '../../../assets/images/svg/Pencil-Blue.svg';
import { useDispatch, useSelector } from "react-redux";
import { getInventory, updateInventory } from '../slices/inventorySlice'
import { useIndexedDB } from "react-indexed-db";

const AdjustInventory = (props) => {
    const inputInventory = useRef(null)
    const [inventory, setInventory] = useState(props.productStockQuantity)
    const [isAllowUpdate, setIsAllowUpdate] = useState(false);
    const [inventoryStatus] = useSelector((state) => [state.inventories])
    const { update, getByID } = useIndexedDB("products");
    //console.log("inventoryStatus", inventoryStatus)
    //console.log("inventoryUpdate", inventoryUpdate)
    const dispatch = useDispatch()
    //console.log("prodcutInWarehouse", inventoryGet)
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            console.log("AdjustInventory")

            props.toggleAdjustInventory(false);
        }
    }

    var warehouseDetail = inventoryStatus && inventoryStatus.inventoryGet && inventoryStatus.inventoryGet.data && inventoryStatus.inventoryGet.data.content
    var CurrentWarehouseId = localStorage.getItem("WarehouseId");
    var currentWareHouseDetail = "";
    if (warehouseDetail && warehouseDetail.length > 0) {
        currentWareHouseDetail = warehouseDetail.find(item => item.warehouseId == CurrentWarehouseId)

    }
    let useCancelled = false;
    useEffect(() => {
        if (useCancelled == false) {
            if (currentWareHouseDetail && currentWareHouseDetail.Quantity) {
                setInventory(currentWareHouseDetail.Quantity)
            }
            //dispatch(updateInventory(null));
            //update index DB........................
            if (inventoryStatus && inventoryStatus.inventoryUpdate && inventoryStatus.inventoryUpdate.is_success == true) {
                if (props.product && props.product.WPID) {
                    var prodcut = ""
                    getByID(props.product.WPID).then(prodcut => {
                        //prodcut = prd;
                        prodcut.StockQuantity = inventory;
                        update(prodcut).then(
                            () => {

                                console.log("stock Updated", prodcut)
                                setTimeout(() => {
                                    props.fatchUpdateInventory()
                                    props.toggleAdjustInventory(false); //close inventory popup
                                    dispatch(updateInventory(null));

                                }, 100);
                            },
                            error => {
                                console.log(error);
                            }
                        );
                    });


                }


            }
            return () => {
                useCancelled = true;
            }
        }
    }, [inventoryStatus])
    //function for call api request to upddate inventory into warehouse. 
    const handleUpdateInventory = () => {
        //var inventoryAmount = $('#txtInv').val();
        var data = {
            quantity: inventory == '' ? 0 : inventory,
            wpid: (props.product) ? props.product.WPID : props.product ? props.product.WPID : '',
            WarehouseId: CurrentWarehouseId
        }
        //var inventoryDetails = (props.product ) ? props.product : inventoryCheck && inventoryCheck.WPID ? [inventoryCheck] : []

        dispatch(updateInventory(data));

        setTimeout(() => {
            dispatch(getInventory(props.product.WPID))
        }, 70);
    }

    const handleInventoryChange = (e) => {
        setInventory(e.target.value)
    }
    const allowUpdate = () => {
        setIsAllowUpdate(true);
        setTimeout(() => { //delay for status update and sure that input is not disable.
            inputInventory.current.focus();
        }, 100);

    }

    //check the inventory updated successfully 

    // if (updateInventory) {
    //     console.log("updateInventory", updateInventory)
    // }
    //console.log("isAllowUpdate", isAllowUpdate)
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
                    <input type="number" id="productStock" ref={inputInventory} value={inventory} disabled={isAllowUpdate == true ? false : true} onChange={(e) => handleInventoryChange(e)} />
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