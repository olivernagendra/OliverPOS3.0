import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import IconDarkBlue from '../../assets/images/svg/X-Icon-DarkBlue.svg'
import { updateCreditScore } from './CustomerSlice'
const AdjustCreditpopup = (props) => {
    const dispatch = useDispatch();
   const [AddCreAmount, setAddCreAmount] = useState(0.00)
   const [DeductCredAMount, setDeductCredAMount] = useState(0.00)
   const [addCreditAmt, setaddCreditAmt] = useState(0.00)
   const [deductCreditAmt, setdeductCreditAmt] = useState(0.00)
   const [Notes, setNotes] = useState('')





    const validateAddNumber = (e,type) => {
        const { value } = e.target;       
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')        
        if (value === '' || re.test(value)) {  
            if(type=='add'){ 
                var addCreAmount =  value ? value:0.00
                setAddCreAmount(addCreAmount)

            }
            else{
                var deductCredAMount =  value ? value:0.00
                setDeductCredAMount(deductCredAMount)
            }
        } 
        var notes = value?value:''
        setNotes(notes)


    }


    const handleSubmit = (customer_Id, UID) => {
        if (props.details.store_credit < DeductCredAMount) {
            alert('cashAmountExceed')
            return;
        }
        if (AddCreAmount || DeductCredAMount) {

            var addRemoveParm = {
                "CustomerWpid": customer_Id,
                "AddPoint": AddCreAmount,
                "DeductPoint": DeductCredAMount,
                "Notes": Notes,
                "Udid": UID,
            }
            dispatch(updateCreditScore(addRemoveParm));
            setAddCreAmount(0.00)
            setDeductCredAMount(0.00)
            setTimeout(() => {
                props.toggleCreditModel()
                props.updateSomething()
            }, 300);
        }

    }





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
            <div className={props.isShow === true ? "subwindow add-cash current" : "subwindow add-cash"}>

                <div className="subwindow-header">
                    <p>Adjust Credit</p>
                    <button className="close-subwindow" onClick={props.toggleCreditModel}>
                        <img src={IconDarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="auto-margin-top" />
                    <div className="text-row">
                        <p className="style1">Current Credit:</p>
                        <p className="style2">{props.details.store_credit ? props.details.store_credit : 0.00}</p>
                    </div>
                    <div className="input-row">
                        <label htmlFor="addCashAmount">Add Credit:</label>
                        <input type="number" id="addCashAmount" placeholder="Enter Amount"  onChange={(e) => validateAddNumber(e, "add")} />
                    </div>
                    <div className="input-row">
                        <label htmlFor="addCashAmount">Deduct Credit:</label>
                        <input type="number" id="removeCashAmount" placeholder="Enter Amount"  onChange={(e) => validateAddNumber(e, "deduct")} />
                    </div>
                    <label htmlFor="addCashNote">Add a note:</label>
                    <textarea
                        id="addCashNote"
                        placeholder="Please add a note here."
                        defaultValue={""}
                        onChange={(e) => validateAddNumber(e)}
                    />
                    <button onClick={() => handleSubmit(props.details.WPId, props.UID)}>Adjust Credit</button>
                    <div className="auto-margin-bottom" />
                </div>

            </div>
        </div>

    )
}

export default AdjustCreditpopup