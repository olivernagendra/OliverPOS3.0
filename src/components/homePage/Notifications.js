import React, { useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';
const Notifications = () => {
    return (
        <div id="notificationsWrapper" className="notifications-wrapper hidden">
        <div id="notificationsContent" className="notifications">
            <div id="soundNotificationsWrapper" className="sound-notifications-wrapper hidden">
                <div className="sound-notifications">
                    <div className="header">
                        <img src="../Assets/Images/SVG/VolumeIcon.svg" alt="" />
                        <p>Sound Notifications</p>
                    </div>
                    <div className="body">
                        <p>Sound Options</p>
                        <div className="row">
                            <p>POS Order</p>
                            <label className="toggle-wrapper">
                                <input type="checkbox" id="posOrder" />
                                <div className="custom-toggle">
                                    <div className="knob"></div>
                                </div>
                            </label>
                        </div>
                        <div className="row">
                            <p>Web Order</p>
                            <label className="toggle-wrapper">
                                <input type="checkbox" id="webOrder" />
                                <div className="custom-toggle">
                                    <div className="knob"></div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="header">
                <p>Notifications</p>
                <div className="dropdown-options"></div>
                <button id="notiSoundOptions">
                    <img src="../Assets/Images/SVG/NotificationsSounds.svg" alt="" />
                </button>
                <button id="mobileNotiExit">
                    <img src={X_Icon_DarkBlue} alt="" />
                </button>
            </div>
            <div className="body">
                <p>Today</p>
                <div className="notification approval">
                    <div className="side-color"></div>
                    <div className="main-row">
                        <img src="../Assets/Images/SVG/Approval-Icon.svg" alt="" />
                        <p>Order# 123890083 Created</p>
                    </div>
                </div>
                <div className="notification approval">
                    <div className="side-color"></div>
                    <div className="main-row">
                        <img src="../Assets/Images/SVG/Approval-Icon.svg" alt="" />
                        <p>Order# 123890082 Created</p>
                    </div>
                </div>
                <div className="notification approval">
                    <div className="side-color"></div>
                    <div className="main-row">
                        <img src="../Assets/Images/SVG/Approval-Icon.svg" alt="" />
                        <p>Order# 123890081 Created</p>
                    </div>
                </div>
                <div className="notification error">
                    <div className="side-color"></div>
                    <div className="main-row">
                        <img src="../Assets/Images/SVG/Error-Icon.svg" alt="" />
                        <p>Order# 123890081 not synced</p>
                    </div>
                    <a href="#">Retry</a>
                </div>
                <p>15/02/2022</p>
                <div className="notification info">
                    <div className="side-color"></div>
                    <div className="main-row">
                        <img src="../Assets/Images/SVG/Info-Icon.svg" alt="" />
                        <p>Website Order #4654896</p>
                    </div>
                </div>
                <div className="notification changelog">
                    <div className="side-color"></div>
                    <div className="main-row">
                        <img src="../Assets/Images/SVG/Changelog-Icon.svg" alt="" />
                        <p>Change Log</p>
                    </div>
                    <p>Bug Fixes:</p>
                    <ul>
                        <li>ashd</li>
                        <li>asjdoiasjd</li>
                        <li>sadjklas</li>
                    </ul>
                    <p>Feature Updates:</p>
                    <ul>
                        <li>ashd</li>
                        <li>asjdoiasjd</li>
                        <li>sadjklas</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>)
}

export default Notifications 