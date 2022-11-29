import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { addRemoveCash, getDetails } from './CashmanagementSlice'
import moment from 'moment';
import STATUSES from "../../constants/apiStatus";
import IconDarkBlue from '../../assets/images/svg/X-Icon-DarkBlue.svg'
import Cashmanagement from "./Cashmanagement";
import { NumericFormat } from "react-number-format";
import { openCashBox } from "../../settings/AndroidIOSConnect";
function AddRemoveCashPopup(props) {
    const dispatch = useDispatch();
    const [Amount, setAmount] = useState(0.00)
    const [removeAmount, setremoveAmount] = useState(0.00)
    const [Notes, setNotes] = useState('')
    var CashmanagementId = ''
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
            openCashBox(); //cash drawer opening while add/remove cash
            setTimeout(() => {
                callApi()
            }, 100);
            setAmount(0.00)
            setremoveAmount(0.00)
            setNotes('')
            setTimeout(() => {
                props.HundlePOpupClose()
            }, 300);

        }
    }




    const callApi = () => {
        var Cash_Management_ID = localStorage.getItem('Cash_Management_ID');
        dispatch(getDetails(Cash_Management_ID));
    }


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
            <div className={props.isShow === true ? "subwindow add-cash current" : "subwindow add-cash"}>
                <div className="subwindow-header">
                    <p>{props.popupstatus.toLowerCase() == 'add' ? "Add" : "Remove"} Cash</p>
                    <button className="close-subwindow" onClick={props.HundlePOpupClose}>
                        <img src={IconDarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="auto-margin-top" />
                    <div className="text-row">
                        <p className="style1">Current balance:</p>
                        <p className="style2">$<NumericFormat value={props.drawerBalance} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></p>
                    </div>
                    <div className="input-row">
                        <label htmlFor="addCashAmount">{props.popupstatus == 'add' ? "Add" : "Remove"}  Cash:</label>
                        <input type="number" id="addCashAmount" placeholder="Enter Amount" onChange={(e) => validateAddNumber(e, props.popupstatus)} />
                    </div>
                    <label htmlFor="addCashNote">Add a note:</label>
                    <textarea id="addCashNote" placeholder="Please add a note here." onChange={(e) => addNote(e)} defaultValue={""} />
                    <button onClick={() => handleSubmit()}>{props.popupstatus == 'add' ? "Add" : "Remove"} Cash</button>
                    <div className="auto-margin-bottom" />
                </div>
            </div>
        </div>

    )
}

export default AddRemoveCashPopup