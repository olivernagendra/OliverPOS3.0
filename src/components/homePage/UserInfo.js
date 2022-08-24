import React, { useEffect, useLayoutEffect } from "react";
import avatar from '../../images/svg/avatar.svg';
import knowledgeBase_Icon from '../../images/svg/knowledgeBase-Icon.svg';
import SwitchUser_Icon from '../../images/svg/SwitchUser-Icon.svg';
import star from '../../images/svg/star.svg';
import LogOut_Icon from '../../images/svg/LogOut-Icon.svg';

import ClockIn_Icon from '../../images/Temp/ClockIn_Icon.png';
const UserInfo = () => {
    return (
        <div id="userInfoWrapper" className="user-info-wrapper hidden">
        <div className="user-info">
            <div className="header">
                <div className="avatar">
                    <img src={avatar} alt="" />
                </div>
                <div className="col">
                    <p className="style1">Freddy Mercury</p>
                    <p className="style2">Register 2</p>
                </div>
            </div>
            <div className="body">
                <button id="knowledgeBaseButton">
                    <div className="img-container">
                        <img src={knowledgeBase_Icon} alt="" />
                    </div>
                    Knowledge Base
                </button>
                <button id="switchUserButton">
                    <div className="img-container">
                        <img src={SwitchUser_Icon} alt="" />
                    </div>
                    Switch Users
                </button>
                <button id="endSessionButton">
                    <div className="img-container">
                        <img src={LogOut_Icon} alt="" />
                    </div>
                    End Session
                </button>
            </div>
            <div className="footer">
                <div className="row">
                    <img src={star} alt="" />
                    <p>My Apps</p>
                </div>
                <div className="button-row">
                    <button>
                        <img src={ClockIn_Icon} alt="" />
                    </button>
                    <button>
                        <img src={ClockIn_Icon} alt="" />
                    </button>
                    <button>
                        <img src={ClockIn_Icon} alt="" />
                    </button>
                    <button>
                        <img src={ClockIn_Icon} alt="" />
                    </button>
                </div>
            </div>
        </div>
    </div>)
}

export default UserInfo 