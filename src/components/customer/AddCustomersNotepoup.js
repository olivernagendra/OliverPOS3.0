import React, { useEffect, useState ,useRef  } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {  updateCustomerNote } from './CustomerSlice'
import IconDarkBlue from '../../assets/images/svg/X-Icon-DarkBlue.svg'
const AddCustomersNotepoup = (props) => {
    const textInput = useRef(null);
   // console.log("props",props)
    const dispatch = useDispatch();
    const [Notes, setNotes] = useState('')

    const handleChange = (e) => {
        const value = e.target.value;
        setNotes(value);
    }
    const handleSubmit = (customer_Id, udid) => {
        if (Notes !== "") {
            var userLocal = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : '';
            dispatch(updateCustomerNote({ "wpid": customer_Id, "notes": Notes,"MetaData":userLocal }));         
            props.toggleNoteModel()
            props.updateSomething(customer_Id)
            setNotes('');
        }
    }
    useEffect(() => {
       // console.log("textInput",textInput)
        textInput.current.focus();
    }, [props.isShow]);


    
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
       <div className={props.isShow === true ? "subwindow add-customer-note current" : "subwindow add-customer-note"}>
            <div className="subwindow-header" >
                <p>Add Customer Note</p>
                <button onClick={props.toggleNoteModel} className="close-subwindow">
                    <img src={IconDarkBlue} alt="" />
                </button>
            </div>
            <div className="subwindow-body">
                <div className="auto-margin-top" />
                <label for="custNote">Enter a note for this customer:</label>
                <textarea ref={textInput}
                    name="custNote"
                    id="custNote"
                    placeholder="Add note here"
                    defaultValue={""}
                    onChange={(e) => handleChange(e)}
                    value={Notes}
                />
                <button onClick={() => handleSubmit(props.customerId, props.UID)}>Add Note</button>
                <div className="auto-margin-bottom" />
            </div>
        </div>

        </div>
    )
}

export default AddCustomersNotepoup