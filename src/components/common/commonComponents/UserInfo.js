import React, { useState,useEffect, useLayoutEffect } from "react";
import avatar from '../../../assets/images/svg/avatar.svg';
import Avatar_Blue_Background from '../../../assets/images/svg/Avatar-Blue_Background.svg';
import avatar_2 from '../../../assets/images/svg/avatar-2.svg';
import knowledgeBase_Icon from '../../../assets/images/svg/knowledgeBase-Icon.svg';
import SwitchUser_Icon from '../../../assets/images/svg/SwitchUser-Icon.svg';
import star from '../../../assets/images/svg/star.svg';
import LogOut_Icon from '../../../assets/images/svg/LogOut-Icon.svg';
// import { changeLanguage } from "../../../settings/LocalizedLanguage";
import ClockIn_Icon from '../../../assets/images/Temp/ClockIn_Icon.png';
import DownArrowGrey from '../../../assets/images/svg/DownArrowGrey.svg';
import { get_regName, get_userName, get_userName_Initial } from "../../common/localSettings";
const UserInfo = (props) => {
    const [isSelectLangugage, setisSelectLangugage] = useState(false);
    const [selLangugage, setSelLangugage] = useState("English");
    const toggleSelectLangugage = () => {
        setisSelectLangugage(!isSelectLangugage)
    }
    const SetLangugage = (lang) => {
        // switch (lang) {
        //     case "French":
        //         changeLanguage("fr");
        //         break;
        //     case "English":
        //         changeLanguage("en");
        //         break;
        //     case "Spanish":
        //         changeLanguage("hi");
        //         break;
        
        //     default:
        //         break;
        // }
       

        setSelLangugage(lang)
        setisSelectLangugage(false);
    }
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "user-info-wrapper") {
            props.toggleUserProfile();
        }
    }
    return (
        <div id="userInfoWrapper" className={props.isShow === true ? "user-info-wrapper" : "user-info-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className="user-info">
                <div className="header">
                        {/* <img src={avatar} alt="" /> */}
                        {/* <img src={Avatar_Blue_Background} alt="" className="default" /> */}
						{/* <img src={avatar_2} alt="" /> */}
                        {get_userName_Initial()!=""?<div className="avatar">{get_userName_Initial()}</div>: <img src={avatar_2} alt="" />}
                    <div className="col">
                        <p className="style1">{get_userName()}</p>
                        <p className="style2">{get_regName()}</p>
                    </div>
                </div>
                <div className="body">
                    <div className="language-select">
                        <p>Language:</p>
                        <div id="languageDropdownWrapper" className={isSelectLangugage===true?"dropdown-input-wrapper open":"dropdown-input-wrapper"}>
                            <img src={DownArrowGrey} alt=""  onClick={()=>toggleSelectLangugage()} />
                            <input type="text" id="language" value={selLangugage}  onClick={()=>toggleSelectLangugage()}  readOnly/>
                            <div className="language-option" onClick={()=>SetLangugage("English")}> <p>English</p></div>
                            <div className="language-option" onClick={()=>SetLangugage("French")}><p>French</p></div>
                            <div className="language-option" onClick={()=>SetLangugage("Spanish")}><p>Spanish</p></div>
                        </div>
                    </div>
                    <button id="knowledgeBaseButton">
                        <div className="img-container">
                            <img src={knowledgeBase_Icon} alt="" />
                        </div>
                        Knowledge Base
                    </button>
                    {localStorage.getItem('user_List') && JSON.parse(localStorage.getItem('user_List')).length > 0 ?
                        <button id="switchUserButton" onClick={() => props.toggleSwitchUser()}>
                            <div className="img-container">
                                <img src={SwitchUser_Icon} alt="" />
                            </div>
                            Switch Users
                        </button> : null}
                    <button id="endSessionButton" onClick={() => props.toggleShowEndSession()}>
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