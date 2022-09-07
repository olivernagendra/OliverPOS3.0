import React, {useState, useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../../images/svg/X-Icon-DarkBlue.svg';
const ProductNote = (props) => {
const [note,setNote]=useState('');

    const handleNote = () => {
        if(note!="" && props && props.addNote)
        {
            props.addNote(note);
            setNote('');
        }
    }
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleProductNote();
        }
    }
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? "subwindow add-order-note current" : "subwindow add-order-note"}>
                <div className="subwindow-header">
                    <p>Add Product Note</p>
                    <button className="close-subwindow" onClick={() => props.toggleProductNote()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="auto-margin-top"></div>
                    <label for="productNote">Enter a note for this product:</label>
                    <textarea id="productNote" placeholder="Add note to product." value={note} onChange={(e)=>setNote(e.target.value)}></textarea>
                    <button onClick={()=>handleNote()}>Add Note</button>
                    <div className="auto-margin-bottom"></div>
                </div>
            </div>
        </div>)
}

export default ProductNote 