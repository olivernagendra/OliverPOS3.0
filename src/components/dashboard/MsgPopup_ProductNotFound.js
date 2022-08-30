import React, { useEffect, useLayoutEffect } from "react";

const MsgPopup_ProductNotFound = () => {
    return (
        <div className="subwindow product-not-found">
                <div className="subwindow-body">
                    <div className="auto-margin-top"></div>
                    <p className="style1">Product cannot be found</p>
                    <img src="../Assets/Images/SVG/BarcodeError.svg" alt="" />
                    <p className="style2">
                        The scanned barcode/SKU was not found. <br /><br />
                        Please review your inventory <br />
                        or double check the SKU number.
                    </p>
                    <button id="prodNotFoundExit">Go Back</button>
                    <div className="auto-margin-bottom"></div>
                </div>
            </div>)
}

export default MsgPopup_ProductNotFound 