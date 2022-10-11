import React, { useState,useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../assets/images/svg/X-Icon-DarkBlue.svg';
const ParkSale = (props) => {
    const [note,setNote]=useState('');
    const doParkSale = () => {
        if(note!="" && props && props.addNote)
        {
            props.addNote(note);
            setNote('');
            props.toggleParkSale();
        }
    }

    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleParkSale();
        }
    }
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? "subwindow park-sale current" : "subwindow park-sale"}>
                <div className="subwindow-header">
                    <p>Park Sale</p>
                    <button className="close-subwindow" onClick={() => props.toggleParkSale()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="auto-margin-top"></div>
                    <label htmlFor="parkSaleNote">Add a note for this parked sale:</label>
                    <textarea name="park-sale" id="parkSaleNote" placeholder="Add note or explanation here." value={note} onChange={(e)=>setNote(e.target.value)}></textarea>
                    <button onClick={()=>doParkSale()}>Save</button>
                    <div className="auto-margin-bottom"></div>
                </div>
            </div>
        </div>)
}

export default ParkSale 