import React, { useEffect, useLayoutEffect } from "react";
import RefreshGrey from '../../../assets/images/svg/RefreshGrey.svg';
import LinkLauncher_Icon from '../../../assets/images/svg/LinkLauncher-Icon.svg';
import OliverKnowledge_Icon from '../../../assets/images/Temp/OliverKnowledge-Icon.png';
import FB_Icon from '../../../assets/images/Temp/FB-Icon.png';
import Etsy_Icon from '../../../assets/images/Temp/Etsy-Icon.png';
import IconDarkBlue from '../../../assets/images/svg/X-Icon-DarkBlue.svg';
import knowledgeBase_Icon from '../../../assets/images/svg/knowledgeBase-Icon.svg';
const LinkLauncherPage = (props) => {
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleLinkLauncherPage();
        }
    }
    const refreshPage=()=>
    {
        document.getElementById('linkLauncherIframe') && document.getElementById('linkLauncherIframe').contentDocument && document.getElementById('linkLauncherIframe').contentDocument.location.reload(true);
    }
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)} >
            <div className={props.isShow === true ? "subwindow link-launcher-subwindow current" : "subwindow link-launcher-subwindow"}>
                <div className="subwindow-header">
                    <img src={props.data && props.data.Img && props.data.Img === "knowledgebase" ? knowledgeBase_Icon : LinkLauncher_Icon} alt="" />
                    <p>{props.data && props.data.Name ? props.data.Name : "Link Launcher"}</p>
                    <button className="close-subwindow" onClick={() => props.toggleLinkLauncherPage()}>
                        <img src={IconDarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="link-header">
                        <div className="link-wrapper">
                            <img id="linkLauncherImage" src={props.data && props.data.Img && props.data.Img === "knowledgebase" ?knowledgeBase_Icon:FB_Icon} alt="" />
                            <div className="text-col">
                                <p id="linkLauncherName" className="style1">
                                    {props.data && props.data.Title!=null ? props.data.Title : "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt laudantium nulla vero quod quae, maiores, istenesciunt officiis vitae voluptatibus omnis, eius ratione unde qui quasi dolore excepturi distinctio eligendi."}
                                </p>
                                <p id="linkLauncherURL" className="style2">
                                {props.data && props.data.Subtitle!=null ? props.data.Subtitle : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem odit doloribus aut sequi, nemo nisi? Nisi, voluptas, ipsam optio maiores eaque sit dolor et magni quaerat, iure voluptatem aliquam non!"}
                                </p>
                            </div>
                        </div>
                        <button id="refreshLinkLauncherIframe" onClick={()=>refreshPage()}>
                            <img src={RefreshGrey} alt="" />
                            Refresh Page
                        </button>
                    </div>
                    <iframe id="linkLauncherIframe" src={props.data && props.data.link ? props.data.link : "./Placeholder_Iframe.html"} frameborder="0"></iframe>
                </div>
            </div>
        </div>)
}
export default LinkLauncherPage 