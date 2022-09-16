import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { addRemoveCash,getDetails } from './CashmanagementSlice'
import moment from 'moment';
import STATUSES from "../../constants/apiStatus";
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';
import Cashmanagement from "./Cashmanagement";
function AddRemoveCashPopup(props) {
    const dispatch = useDispatch();
    const [Amount, setAmount] = useState(0.00)
    const [removeAmount, setremoveAmount] = useState(0.00)
    const [Notes, setNotes] = useState('')
    var CashmanagementId=''
    const addNote = (e) => {
        const { value } = e.target;
        setNotes(value)
    }
    const validateAddNumber = (e, type) => {
        const { value } = e.target;
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$');
        if (value == '' || re.test(value)) {
            if (type == 'add') {
                setAmount(value)
            } else if (type == 'remove') {
                setremoveAmount(value)
            }
        }
    }

    const handleSubmit = () => {
        if (props.drawerBalance < removeAmount) {
            alert('cashAmountExceed')
            return;
        }

        if (Amount || removeAmount) {
            // this.setState({ isloading: true });
            var cashManagementID = localStorage.getItem('Cash_Management_ID');
            var d = new Date();
            var dateStringWithTime = moment(d).format('YYYY-MM-DD HH:mm:ss Z');
            var localTimeZoneType = moment.tz.guess(true);
            var user = JSON.parse(localStorage.getItem("user"));
            var addRemoveParm = {
                "CashManagementId": cashManagementID,
                "AmountIn": Amount,
                "AmountOut": removeAmount,
                "LocalDateTime": dateStringWithTime,
                "LocalTimeZoneType": localTimeZoneType,
                "SalePersonId": user && user.user_id ? user.user_id : '',
                "SalePersonName": user && user.display_name ? user.display_name : '',
                "SalePersonEmail": user && user.user_email ? user.user_email : '',
                "OliverPOSReciptId": '0',
                "Notes": Notes
            }
            //  console.log("addRemoveParm", addRemoveParm)
            dispatch(addRemoveCash(addRemoveParm));
            callApi()
            setAmount(0.00)
            setremoveAmount(0.00)
            setNotes('')
            setTimeout(() => {
            props.HundlePOpupClose()
            }, 300);
           
        }
    }

  


const callApi=()=>{
    var Cash_Management_ID = localStorage.getItem('Cash_Management_ID');
    dispatch(getDetails(Cash_Management_ID));
}



    return (
        <div className='subwindow-wrapper'>
            <div className="subwindow add-order-note current">
                <div className="subwindow-header">
                    <p>{props.popupstatus.toLowerCase() == 'add' ? "Add" : "Remove"} Cash</p>
                    <button onClick={props.HundlePOpupClose} className="close-subwindow">
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <p>Cash Drawer Balance</p>
                    <div className="inner-group">
                        <p className="style4">{props.drawerBalance}</p>
                    </div>
                    {props.popupstatus.toLowerCase() == 'add' ? <div className="custom-fee unhide">
                        <label htmlFor="customFeeLabel">Add Cash</label>
                        <input type="number" id="customFeeAmount" value={Amount} placeholder="0.00" onChange={(e) => validateAddNumber(e, 'add')} />
                    </div> : ''}

                    {props.popupstatus.toLowerCase() == 'remove' ? <div className="custom-fee unhide">
                        <label htmlFor="customFeeLabel">Remove Cash</label>
                        <input type="number" id="customFeeAmount" value={removeAmount} placeholder="0.00" onChange={(e) => validateAddNumber(e, 'remove')} />
                    </div> : ""}

                    <div className="auto-margin-top" />
                    <label htmlFor="orderNote">Enter a note for this cash:</label>
                    <textarea
                        name="order-note"
                        id="orderNote"
                        placeholder="Add note to order"
                        onChange={(e) => addNote(e)}
                    />
                    <button onClick={() => handleSubmit()}>{props.popupstatus == 'add' ? "Add" : "Remove"} Cash</button>
                    <div className="auto-margin-bottom" />
                </div>
            </div>
        </div>
    )
}

export default AddRemoveCashPopup