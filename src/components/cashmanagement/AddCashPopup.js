
import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { addRemoveCash } from './CashmanagementSlice'
import moment from 'moment';
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';
function AddCashPopup(props) {

    const dispatch = useDispatch();
    const [Amount, setAmount] = useState(0.00)
    const [Notes, setNotes] = useState('')

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
            }
        }
    }

    const handleSubmit = () => {
        // if(this.props.drawerBalance < this.state.removeCashAmount  ){
        //     this.props.msg(LocalizedLanguage.cashAmountExceed)
        //     this.state.removeCashAmount=""
        //      showModal('common_msg_popup');

        //      // $('.form-control').val('');
        //      return;
        // }
     
        if (Amount) {
            // this.setState({ isloading: true });
            var cashManagementID = localStorage.getItem('Cash_Management_ID');
            var d = new Date();
            var dateStringWithTime = moment(d).format('YYYY-MM-DD HH:mm:ss Z');
            var localTimeZoneType = moment.tz.guess(true);
            var user = JSON.parse(localStorage.getItem("user"));
            var addRemoveParm = {
                "CashManagementId": cashManagementID,
                "AmountIn": Amount,
                // "AmountOut": this.state.removeCashAmount,
                "LocalDateTime": dateStringWithTime,
                "LocalTimeZoneType": localTimeZoneType,
                "SalePersonId": user && user.user_id ? user.user_id : '',
                "SalePersonName": user && user.display_name ? user.display_name : '',
                "SalePersonEmail": user && user.user_email ? user.user_email : '',
                "OliverPOSReciptId": '0',
                "Notes": Notes
            }
            console.log("addRemoveParm", addRemoveParm)
            dispatch(addRemoveCash(addRemoveParm));
            setAmount(0.00)
            setNotes('')
            props.HundlePOpupClose()
        }
    }

    return (
        <div className='subwindow-wrapper'>
            <div className="subwindow add-order-note current">
                <div className="subwindow-header">
                    <p>Add Cash</p>
                    <button onClick={props.HundlePOpupClose} className="close-subwindow">
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="custom-fee unhide">
                        <input type="number" id="customFeeAmount" value={Amount} placeholder="0.00" onChange={(e) => validateAddNumber(e, 'add')} />
                    </div>
                    <div className="auto-margin-top" />
                    <label htmlFor="orderNote">Enter a note for this cash:</label>
                    <textarea
                        name="order-note"
                        id="orderNote"
                        placeholder="Add note to order"
                        onChange={(e) => addNote(e)}
                    />
                    <button onClick={() => handleSubmit()}>Add Cash</button>
                    <div className="auto-margin-bottom" />
                </div>
            </div>
        </div>
    )
}

export default AddCashPopup