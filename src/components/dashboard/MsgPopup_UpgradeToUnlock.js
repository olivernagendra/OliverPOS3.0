import React, { useEffect, useLayoutEffect } from "react";

const MsgPopup_UpgradeToUnlock = () => {
    return (
        <div className="subwindow upgrade-to-unlock">
                <div className="subwindow-body">
                    <div className="auto-margin-top"></div>
                    <img src="../Assets/Images/SVG/LockedIcon.svg" alt="" />
                    <p className="style1">Upgrade to unlock this feature!</p>
                    <p className="style2">
                        This feature is not included in your plan. <br />
                        Please upgrade your plan in Oliver HUB <br />
                        to access this feature.
                    </p>
                    <button id="upgradeToUnlockExit">Go Back</button>
                    <div className="auto-margin-bottom"></div>
                </div>
            </div>)
}

export default MsgPopup_UpgradeToUnlock 