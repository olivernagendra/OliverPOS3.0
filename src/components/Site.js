import React,{useState} from "react";
import { useSelector } from 'react-redux'
const Site=()=>{

   // const siteData=useSelector(state=>state.)
    return <div className="choose-wrapper">
    <div className="choose-header">
        <button id="backButton">
            <img src="../Assets/Images/SVG/AngledBracket-Left-Blue.svg" alt="" />
            Logout
        </button>
    </div>
    <div className="choose-body-default">
        <p>Choose Site</p>
        <div className="divider"></div>
        <div className="button-container">
            <button className="option">
                <div className="img-container background-violet">
                    <img src="../Assets/Images/SVG/Oliver-Icon-White.svg" alt="" className="oliver-icon" />
                </div>
                <div className="col">
                    <p className="style1">Demo Store</p>
                </div>
                <img src="../Assets/Images/SVG/AngledBracket-Right-Grey.svg" alt="" />
                <div className="fake-button background-violet">Load Demo</div>
            </button>
            <button className="option">
                <div className="img-container background-blue">
                    <img src="../Assets/Images/SVG/WWW-Icon.svg" alt="" className="www-icon" />
                </div>
                <div className="col">
                    <p className="style1">Sushi Sun</p>
                    <p className="style2">sushisun.com</p>
                </div>
                <img src="../Assets/Images/SVG/AngledBracket-Right-Grey.svg" alt="" />
                <div className="fake-button background-blue">Select</div>
            </button>
            <button className="option">
                <div className="img-container background-blue">
                    <img src="../Assets/Images/SVG/WWW-Icon.svg" alt="" className="www-icon" />
                </div>
                <div className="col">
                    <p className="style1">Pizza Planet</p>
                    <p className="style2">pizzaplanet.com</p>
                </div>
                <img src="../Assets/Images/SVG/AngledBracket-Right-Grey.svg" alt="" />
                <div className="fake-button background-blue">Select</div>
            </button>
            <button id="addNew">
                <img src="../Assets/Images/SVG/CircledPlus-Icon-Blue.svg" alt="" />
                Add Site
            </button>
        </div>
    </div>
</div>
}

export default Site