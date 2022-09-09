import React, { useEffect, useLayoutEffect } from "react";
import avatar from '../../../images/svg/avatar.svg';
import knowledgeBase_Icon from '../../../images/svg/knowledgeBase-Icon.svg';
import SwitchUser_Icon from '../../../images/svg/SwitchUser-Icon.svg';
import star from '../../../images/svg/star.svg';
import LogOut_Icon from '../../../images/svg/LogOut-Icon.svg';

import ClockIn_Icon from '../../../images/Temp/ClockIn_Icon.png';
import { get_regName, get_userName } from "../../common/localSettings";
const UserInfo = (props) => {
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "user-info-wrapper") {
            props.toggleUserProfile();
        }
    }
    return (
        <div id="userInfoWrapper" className={props.isShow===true? "user-info-wrapper":"user-info-wrapper hidden"} onClick={(e)=>outerClick(e)}>
        <div className="user-info">
            <div className="header">
                <div className="avatar">
                    <img src={avatar} alt="" />
                </div>
                <div className="col">
                    <p className="style1">{get_userName()}</p>
                    <p className="style2">{get_regName()}</p>
                </div>
            </div>
            <div className="body">
                <button id="knowledgeBaseButton">
                    <div className="img-container">
                        <img src={knowledgeBase_Icon} alt="" />
                    </div>
                    Knowledge Base
                </button>
                {localStorage.getItem('user_List') && JSON.parse(localStorage.getItem('user_List')).length>0?
                <button id="switchUserButton" onClick={()=>props.toggleSwitchUser()}>
                    <div className="img-container">
                        <img src={SwitchUser_Icon} alt="" />
                    </div>
                    Switch Users
                </button>:null}
                <button id="endSessionButton" onClick={()=>props.toggleShowEndSession()}>
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