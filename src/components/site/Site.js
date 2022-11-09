import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import AngledBracket_Left_Blue from '../../assets/images/svg/AngledBracket-Left-Blue.svg'
//import Oliver_Icon_White from '../../assets/images/svg/Oliver-Icon-White.svg'
import AngledBracket_Right_Grey from '../../assets/images/svg/AngledBracket-Right-Grey.svg'
import WWW_Icon from '../../assets/images/svg/WWW-Icon.svg'
import CircledPlus_Icon_Blue from '../../assets/images/svg/CircledPlus-Icon-Blue.svg';
import Rounded_Square_Plus_Icon_NewGrey from '../../assets/images/svg/Rounded-Square-Plus-Icon-NewGrey.svg';

import { encode_UDid } from "../common/localSettings";
import { userLogin } from '../login/loginSlice';

const Site = () => {

    const dispatch = useDispatch()
    let useCancelled = false;
    useEffect(() => {
        if (useCancelled == false) {
            var lang = localStorage.getItem('LANG') ? localStorage.getItem('LANG').toString() : 'en';
            var currentLanguage = LocalizedLanguage.getLanguage();
            console.log("currentlanguage", currentLanguage, " local", lang)
            if (lang !== currentLanguage) {
                window.location.reload() // to set language need refresh page
            }
        }
        return () => {
            useCancelled = true;
        }
    }, []);

    const logout = () => {
        dispatch(userLogin(null))
        localStorage.clear()
        navigate('/')
    }

    const navigate = useNavigate();
    const handleSiteClick = (item) => {
        var udid = item.subscription_detail.udid;
        var user_full_name = item.user_full_name
        localStorage.setItem('user_full_name', user_full_name);

        encode_UDid(udid);
        navigate('/location')
    }
    var Sitelist = localStorage.getItem('sitelist') ? JSON.parse(localStorage.getItem('sitelist')) : null;
    const siteData = useSelector(state => state)
    console.log("siteData", siteData)
    return <div className="choose-wrapper">
        <div className="choose-header">
            <button id="backButton" onClick={() => logout()}>
                <img src={AngledBracket_Left_Blue} alt="" />
                {LocalizedLanguage.logout}
            </button>
        </div>
        <div className="choose-body-default">
            <p>{LocalizedLanguage.selectSite}</p>
            <div className="divider"></div>
            <div className="button-container">
                {/* <button className="option">
                    <div className="img-container background-violet">
                        <img src={Oliver_Icon_White} alt="" className="oliver-icon" />
                    </div>
                    <div className="col">
                        <p className="style1">Demo Store</p>
                    </div>
                    <img src={AngledBracket_Right_Grey} alt="" />
                    <div className="fake-button background-violet">Load Demo</div>
                </button> */}

                {Sitelist !== null && Sitelist !== undefined && Sitelist.subscriptions &&
                    Sitelist.subscriptions.map((link, index) => {
                        return (
                            <button key={index} className="option" onClick={() => handleSiteClick(link)}>
                                <div className="img-container background-blue">
                                    <img src={WWW_Icon} alt="" className="www-icon" />
                                </div>
                                <div className="col">
                                    <p className="style1">{link.subscription_detail.host_name}</p>
                                    {/* <p className="style2">{link.subscription_detail.url}</p> */}
                                </div>
                                <img src={AngledBracket_Right_Grey} alt="" />
                                <div className="fake-button background-blue">{LocalizedLanguage.select}  </div>
                            </button>
                        )
                    })
                }

                {/* <button className="option">
                <div className="img-container background-blue">
                    <img src={WWW_Icon} alt="" className="www-icon" />
                </div>
                <div className="col">
                    <p className="style1">Sushi Sun</p>
                    <p className="style2">sushisun.com</p>
                </div>
                <img src={AngledBracket_Right_Grey} alt="" />
                <div className="fake-button background-blue">Select</div>
            </button> */}
                {/* <button className="option">
                <div className="img-container background-blue">
                    <img src={WWW_Icon} alt="" className="www-icon" />
                </div>
                <div className="col">
                    <p className="style1">Pizza Planet</p>
                    <p className="style2">pizzaplanet.com</p>
                </div>
                <img src={AngledBracket_Right_Grey} alt="" />
                <div className="fake-button background-blue">Select</div>
            </button> */}
                <button id="addNew">
                    <img src={Rounded_Square_Plus_Icon_NewGrey} alt="" />
                    Add Site
                </button>
            </div>
        </div>
    </div>
}

export default Site