import React, { useEffect, useLayoutEffect } from "react";
import AngledBracket_Left_BaseBlue from '../../images/svg/AngledBracket-Left-BaseBlue.svg';
import NoLink_Image from '../../images/svg/NoLink-Image.svg';
import OliverKnowledge_Icon from '../../images/Temp/OliverKnowledge-Icon.png';
import FB_Icon from '../../images/Temp/FB-Icon.png';
import Etsy_Icon from '../../images/Temp/Etsy-Icon.png';
const LinkLauncher = () => {
    return (
        <div id="linkLauncherWrapper" className="link-launcher-wrapper hidden">
                <div className="link-launcher">
                    <div className="header">
                        <button id="linkLauncherExit">
                            <img src={AngledBracket_Left_BaseBlue} alt="" />
                        </button>
                        <p>Link Launcher</p>
                    </div>
                    <div className="body">
                        <img src={NoLink_Image} alt="" />
                        <button>
                            <div className="img-container">
                                <img src={OliverKnowledge_Icon} alt="" />
                            </div>
                            <div className="col">
                                <p className="style1">Oliver Knowledge Base</p>
                                <p className="style2">https://help.oliverpos.com/</p>
                            </div>
                        </button>
                        <button>
                            <div className="img-container">
                                <img src={FB_Icon} alt="" />
                            </div>
                            <div className="col">
                                <p className="style1">Facebook Site</p>
                                <p className="style2">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita animi ipsam quia hic tempora obcaecati enim quibusdam ratione assumenda, laboriosam quo fugiat perspiciatis itaque culpa provident, aliquid vitae, id quidem?</p>
                            </div>
                        </button>
                        <button>
                            <div className="img-container">
                                <img src={Etsy_Icon} alt="" />
                            </div>
                            <div className="col">
                                <p className="style1">Etsy Site</p>
                                <p className="style2">www.etsy.com</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>)
}

export default LinkLauncher 