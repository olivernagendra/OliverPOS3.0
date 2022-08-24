import React from "react";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

import AngledBracket_Left_Blue from '../../images/svg/AngledBracket-Left-Blue.svg'
//import Oliver_Icon_White from '../../images/svg/Oliver-Icon-White.svg'
import AngledBracket_Right_Grey from '../../images/svg/AngledBracket-Right-Grey.svg'
import WWW_Icon from '../../images/svg/WWW-Icon.svg'
import CircledPlus_Icon_Blue from '../../images/svg/CircledPlus-Icon-Blue.svg'
import { encode_UDid } from "../common/localSettings";

const Site = () => {
    const navigate = useNavigate();
    const handleSiteClick=(item)=>
    {
        var udid=item.subscription_detail.udid;
        var user_full_name=item.user_full_name
        localStorage.setItem('user_full_name',user_full_name);

        encode_UDid(udid);
        navigate('/location')
    }
    var Sitelist = localStorage.getItem('sitelist') ? JSON.parse(localStorage.getItem('sitelist')) : null;
    const siteData = useSelector(state => state)
    console.log("siteData", siteData)
    return <div className="choose-wrapper">
        <div className="choose-header">
            <button id="backButton">
                <img src={AngledBracket_Left_Blue} alt="" />
                Logout
            </button>
        </div>
        <div className="choose-body-default">
            <p>Choose Site</p>
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
                            <button  key={index} className="option" onClick={()=>handleSiteClick(link)}>
                                <div className="img-container background-blue">
                                    <img src={WWW_Icon} alt="" className="www-icon" />
                                </div>
                                <div className="col">
                                    <p className="style1">{link.subscription_detail.host_name}</p>
                                    {/* <p className="style2">{link.subscription_detail.url}</p> */}
                                </div>
                                <img src={AngledBracket_Right_Grey} alt="" />
                                <div className="fake-button background-blue">Select</div>
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
                    <img src={CircledPlus_Icon_Blue} alt="" />
                    Add Site
                </button>
            </div>
        </div>
    </div>
}

export default Site