import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import IconDarkBlue from '../../assets/images/svg/X-Icon-DarkBlue.svg'
import { updateCreditScore } from './CustomerSlice'
const AdjustCreditpopup = (props) => {
    const dispatch = useDispatch();
    const [AddCreAmount, setAddCreAmount] = useState('')
    const [DeductCredAMount, setDeductCredAMount] = useState('')
    const [StatusFiled, setStatusFiled] = useState('Add')
    const [Notes, setNotes] = useState('')





    const validateAddNumber = (e, type) => {
        const { value } = e.target;
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
        if (value === '' || re.test(value)) {
            if (type == 'add') {
                var addCreAmount = value ? value : ""
                setAddCreAmount(addCreAmount)

            }
            if (type == 'deduct') {
                var deductCredAMount = value ? value : ""
                setDeductCredAMount(deductCredAMount)
            }
        }
        if (type == 'notes') {
            var notes = value ? value : ''
            setNotes(notes)
        }



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
            props.toggleCreditModel()
            setAddCreAmount("")
            setDeductCredAMount("")
            setNotes('')
            setTimeout(() => {
             props.updateSomething(customer_Id)
            }, 3000);
        }

    }

    const modelClose = () => {
        setAddCreAmount(0.00)
        setDeductCredAMount(0.00)
        setNotes('')
        props.toggleCreditModel()
    }

    const HundleCreditFiled =(statusFiled)=>{
        setStatusFiled(statusFiled)
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
            <div  className={props.isShow === true ? "subwindow adjust-credit current" : "subwindow adjust-credit"}    >
                <div className="subwindow-header">
                    <p>Adjust Credit</p>
                    <button className="close-subwindow" onClick={props.toggleCreditModel}>
                        <img src={IconDarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="auto-margin-top" />
                    <p>Select an option:</p>
                    <div className="toggle-wrapper" id="adjustCreditToggle">
                        <label>
                            <input
                                type="radio"
                                id="addCreditToggle"
                                name="add_remove_credit_toggle"
                                defaultChecked=""
                            />
                            <div className="custom-radio" onClick={() => HundleCreditFiled('Add')}>Add Credit</div>
                        </label>
                        <label>
                            <input
                                type="radio"
                                id="removeCreditToggle"
                                name="add_remove_credit_toggle"
                            />
                            <div className="custom-radio" onClick={() => HundleCreditFiled('Remove')}>Remove Credit</div>
                        </label>
                    </div>
                    <div className="text-row">
                        <p className="style1">Current credit:</p>
                        <p className="style2">{props.details.store_credit ? props.details.store_credit : 0.00}</p>
                    </div>
                    <div className={StatusFiled === "Add" ? "change-credit-row " : "change-credit-row hidden"} >
                        <p>Add Credit:</p>
                        <input type="number" id="addCreditInput" placeholder="Enter Amount" value={AddCreAmount}  onChange={(e) => validateAddNumber(e, "add")} />
                    </div> 
                     <div className={StatusFiled === "Remove" ? "change-credit-row " : "change-credit-row hidden"}>
                        <p>Remove Credit:</p>
                        <input type="number" id="removeCreditInput" placeholder="Enter Amount" onChange={(e) => validateAddNumber(e, "deduct")}  value={DeductCredAMount} />
                    </div>
                   
                    
                    <label htmlFor="adjustCreditAddNote">Add a note:</label>
                    <textarea
                        id="adjustCreditAddNote"
                        placeholder="Please add a note here."
                        defaultValue={""}
                        onChange={(e) => validateAddNumber(e, "notes")}
                        value={Notes}
                    />
                    <button onClick={() => handleSubmit(props.details.WPId, props.UID)}>Update Credit</button>
                    <div className="auto-margin-bottom" />
                </div>
            </div>

        </div>
    )
}

export default AdjustCreditpopup