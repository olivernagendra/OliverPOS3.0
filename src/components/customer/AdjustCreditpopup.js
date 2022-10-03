import React from 'react'
import IconDarkBlue from '../../assets/images/svg/X-Icon-DarkBlue.svg'
const AdjustCreditpopup = (props) => {

       // Close Button popup
       const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleCreateCustomer && props.toggleCreateCustomer();
        }
        else {
            e.stopPropagation();
        }
    }
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
        <div className={props.isShow === true ? "subwindow adjust-credit current" : "subwindow adjust-credit"}> 
       
            <div className="subwindow-header">
                <p>Adjust Credit</p>
                <button className="close-subwindow" onClick={props.toggleCreateCustomer}>
                    <img src={IconDarkBlue} alt="" />
                </button>
            </div>
            <div className="subwindow-body">
                <div className="text-row">
                    <p className="style1">Current credit balance:</p>
                    <p className="style2">$24.75</p>
                </div>
            </div>
        </div>
        </div>

    )
}

export default AdjustCreditpopup