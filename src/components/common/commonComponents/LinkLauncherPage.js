import React, { useEffect, useLayoutEffect } from "react";
import RefreshGrey from '../../../assets/images/svg/RefreshGrey.svg';
import LinkLauncher_Icon from '../../../assets/images/svg/LinkLauncher-Icon.svg';
import OliverKnowledge_Icon from '../../../assets/images/Temp/OliverKnowledge-Icon.png';
import FB_Icon from '../../../assets/images/Temp/FB-Icon.png';
import Etsy_Icon from '../../../assets/images/Temp/Etsy-Icon.png';
import IconDarkBlue from '../../../assets/images/svg/X-Icon-DarkBlue.svg';
const LinkLauncherPage = (props) => {
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleLinkLauncherPage();
        }
    }
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)} >
            <div className={props.isShow === true ? "subwindow link-launcher-subwindow current" : "subwindow link-launcher-subwindow"}>
                <div className="subwindow-header">
                    <img src={LinkLauncher_Icon} alt="" />
                    <p>Link Launcher</p>
                    <button className="close-subwindow" onClick={() => props.toggleLinkLauncherPage()}>
                        <img src={IconDarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="link-header">
                        <div className="link-wrapper">
                            <img id="linkLauncherImage" src={FB_Icon} alt="" />
                            <div className="text-col">
                                <p id="linkLauncherName" className="style1">
                                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt laudantium nulla vero quod quae, maiores, iste
                                    nesciunt officiis vitae voluptatibus omnis, eius ratione unde qui quasi dolore excepturi distinctio eligendi.
                                </p>
                                <p id="linkLauncherURL" className="style2">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem odit doloribus aut sequi, nemo nisi? Nisi,
                                    voluptas, ipsam optio maiores eaque sit dolor et magni quaerat, iure voluptatem aliquam non!
                                </p>
                            </div>
                        </div>
                        <button id="refreshLinkLauncherIframe">
                            <img src={RefreshGrey} alt="" />
                            Refresh Page
                        </button>
                    </div>
                    <iframe id="linkLauncherIframe" src="./Placeholder_Iframe.html" frameborder="0"></iframe>
                </div>
            </div>
        </div>)
}
export default LinkLauncherPage 