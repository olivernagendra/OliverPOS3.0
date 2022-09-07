import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {  SaveClosingNote } from './CashmanagementSlice'
import { useNavigate } from "react-router-dom";

const Closeregistertwo = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [enterNotes, setenterNotes] = useState('')

  const  enterNote=(e)=> {
        const { value } = e.target;
        setenterNotes(value)
    }

    
  const  CloseRegister=()=> {
        var cashManagementID = localStorage.getItem('Cash_Management_ID');
        var saveCountParm = { "CashManagementId": cashManagementID, "Note": enterNotes }
        // console.log("saveCountParm", saveCountParm)
       dispatch(SaveClosingNote(saveCountParm))
       
        setTimeout(() => {
            localStorage.removeItem("CUSTOMER_TO_OrderId")
            localStorage.removeItem('CASH_ROUNDING');
            localStorage.setItem("IsCashDrawerOpen", "false");
            localStorage.removeItem('Cash_Management_ID');
            //Webview Android keyboard setting.................... 
            localStorage.setItem('logoutclick', "true");
           // setAndroidKeyboard('logout');
            //--------------------------------------------------------
            //this.props.dispatch(userActions.logout())
           // redirectToURL()
            // history.push('/loginpin');
            navigate('/register')
        }, 500);

    }


    var closeRegister = props.closeregisterPaymentDetail;
    var _closeRegister = null;
    if (closeRegister &&closeRegister)
        _closeRegister = closeRegister &&closeRegister;
    var _totalDiff = _closeRegister && _closeRegister.Actual - _closeRegister.Expected
    _closeRegister && _closeRegister.PaymentSummery && _closeRegister.PaymentSummery.map(item => {
        // _totalDiff = _totalDiff + (item.DiffrenceAmount);
        _totalDiff = _totalDiff + (item.Actual - item.Expected);
        // console.log("_totalDiff",_totalDiff)
    })
    var cashRegisterLog =  closeRegister ? closeRegister.CashRegisterlog : [];


    return (
        <>  <p className="style1">Close Register</p>
            <p className="style2">
                <b>Logged-in user:</b> Freddy Mercury
            </p>
            <label>Estimated Cash and Transaction Totals</label>
            <div className="closing-totals">
                <p className="style1">Estimated Totals</p>
                <div className="tablet-row">
                    <p>Payment</p>
                    <p>Expected</p>
                    <p>Actual</p>
                    <p>Difference</p>
                </div>
                <div className="col">
                    <p className="style2">Cash in Till</p>
                    <div className="divider" />
                    <div className="row">
                        <p className="style3">Expected:</p>
                        <p className="style3">{_closeRegister && _closeRegister.Expected}</p>
                    </div>
                    <div className="row">
                        <p className="style3">Actual:</p>
                        <p className="style3">{_closeRegister && _closeRegister.Actual}</p>
                    </div>
                    <div className="row">
                        <p className="style3">Difference:</p>
                        <p className="style3">{_closeRegister && (_closeRegister.Actual - _closeRegister.Expected)} </p>
                    </div>
                </div>
                {_closeRegister && _closeRegister.PaymentSummery && _closeRegister.PaymentSummery.map((item, index) => {
               return ( <div className="col">
                    <p className="style2">{item.Name}</p>
                    <div className="divider" />
                    <div className="row">
                        <p className="style3">Expected:</p>
                        <p className="style3">{item.Expected}</p>
                    </div>
                    <div className="row">
                        <p className="style3">Actual:</p>
                        <p className="style3">{item.Actual}</p>
                    </div>
                    <div className="row">
                        <p className="style3">Difference:</p>
                        <p className="style3">{item.Actual - item.Expected}</p>
                    </div>
                </div>);
                 })
                }

                <div className="tablet-divider" />
                <div className="col total">
                    <p className="style2">Total Difference</p>
                    <div className="divider" />
                    <div className="row">
                        <p className="style3">{_totalDiff}</p>
                    </div>
                </div>
            </div>
            <label htmlFor="closingNote">Add Note</label>
            <textarea
                name="closingNote"
                id="closingNote"
                placeholder="Please add a note here"
                defaultValue={""}
                onChange={(e) => enterNote(e)}
            />
            <button id="printReport">Print Report</button>
            <button id="closeRegister" onClick={() => CloseRegister()} >Close Register</button></>
    )
}

export default Closeregistertwo