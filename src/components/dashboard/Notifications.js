import React, { useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';

import NotificationsSounds from '../../images/svg/NotificationsSounds.svg';
import Approval_Icon from '../../images/svg/Approval-Icon.svg';
import VolumeIcon from '../../images/svg/VolumeIcon.svg';
import Changelog_Icon from '../../images/svg/Changelog-Icon.svg';
import Info_Icon from '../../images/svg/Info-Icon.svg';
import Error_Icon from '../../images/svg/Error-Icon.svg';
const Notifications = (props) => {
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "notifications-wrapper") {
            props.toggleNotifications();
        }
        else {
            e.stopPropagation();
        }
        console.log(e.target.className)
    }
    return (
        <div id="notificationsWrapper" className={props.isShow===true? "notifications-wrapper":"notifications-wrapper hidden"} onClick={(e)=>outerClick(e)}>
        <div id="notificationsContent" className="notifications">
            <div id="soundNotificationsWrapper" className="sound-notifications-wrapper hidden">
                <div className="sound-notifications">
                    <div className="header">
                        <img src={VolumeIcon} alt="" />
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
                    <img src={NotificationsSounds} alt="" />
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
                        <img src={Approval_Icon} alt="" />
                        <p>Order# 123890083 Created</p>
                    </div>
                </div>
                <div className="notification approval">
                    <div className="side-color"></div>
                    <div className="main-row">
                        <img src={Approval_Icon} alt="" />
                        <p>Order# 123890082 Created</p>
                    </div>
                </div>
                <div className="notification approval">
                    <div className="side-color"></div>
                    <div className="main-row">
                        <img src={Approval_Icon} alt="" />
                        <p>Order# 123890081 Created</p>
                    </div>
                </div>
                <div className="notification error">
                    <div className="side-color"></div>
                    <div className="main-row">
                        <img src={Error_Icon} alt="" />
                        <p>Order# 123890081 not synced</p>
                    </div>
                    <a href="#">Retry</a>
                </div>
                <p>15/02/2022</p>
                <div className="notification info">
                    <div className="side-color"></div>
                    <div className="main-row">
                        <img src={Info_Icon} alt="" />
                        <p>Website Order #4654896</p>
                    </div>
                </div>
                <div className="notification changelog">
                    <div className="side-color"></div>
                    <div className="main-row">
                        <img src={Changelog_Icon} alt="" />
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