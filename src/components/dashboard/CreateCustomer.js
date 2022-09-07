import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';
import Checkmark from '../../images/svg/Checkmark.svg';
import { customergetDetail, customergetPage } from '../customer/CustomerSlice'
import { get_UDid } from "../common/localSettings";
import STATUSES from "../../constants/apiStatus";
import Config from '../../Config'
const CreateCustomer = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    var UID = get_UDid('UDID');

    // LoadMore()
    // function LoadMore(params) {
    //     dispatch(customergetPage({"uid":UID,"pageSize":Config.key.CUSTOMER_PAGE_SIZE,"pageNumber":"0"}));
    // }

    const initialValues = { fName: "", lName: "", tel: "", website: "", billingAddress1: "", billingAddress2: "", billingZipPostal: "", billingCity: "", billingCountry: "", shippingAddress1: "", shippingAddress2: "", shippingCity: "", shippingCountry: "", email: "", };

    const [formValues, setFormValues] = useState(initialValues);

    const [userRequest, setUserRequest] = useState({
        emailValid: '',
        nameValid: '',
        lastValid: '',
        phoneValid: '',
        pinValid: '',
        isContactValid: true
    });
    const { emailValid, nameValid, lastValid, phoneValid, pinValid, isContactValid } = userRequest;


    //  Customer GetPage Api response 
    const { customergetPagesdata, customergetPageserror, customergetPagesis_success, customergetPagesstatus } = useSelector((state) => state.customergetPage)
    console.log("customergetPagesdata", customergetPagesdata, "customergetPageserror", customergetPageserror, "customergetPagesstatus,customergetPagesstatus", "customergetPagesis_success", customergetPagesis_success)

    if (customergetPagesstatus === STATUSES.IDLE && customergetPagesis_success) {
        if (customergetPagesdata && customergetPagesdata.content && customergetPagesdata.content !== customergetPagesis_success) {
        //   var custList=[];
        //     customergetPagesdata.content && customergetPagesdata.content.Records.forEach(element => {
        //         var ItemExit = false;
        //         custList.map(item => {
        //             if (item.WPId == element.WPId) {
        //                 ItemExit = true;
        //             }
        //         })
        //         if (ItemExit == false)

        //             custList.push(element);
        //     });
        //     console.log("custList",custList)
            // this.state.customerList = custList;
            // this.setState({ customerList: custList, isCustomerListLoaded: false });





        }
    }





    let useCancelled = false;
    useEffect(() => {
        var CUSTOMER_ID = "123";
        if (useCancelled == false) {
            // dispatch(customergetDetail(CUSTOMER_ID));
            dispatch(customergetPage({ "uid": UID, "pageSize": Config.key.CUSTOMER_PAGE_SIZE, "pageNumber": "0" }));
        }
        return () => {
            useCancelled = true;
        }
    }, []);






    const handleChange = (e) => {

        var emailValid = emailValid
        var nameValid = nameValid;
        var lastValid = lastValid;
        var pinValid = pinValid
        var isContactValid = isContactValid
        var pin;
        const { name, value } = e.target;
        switch (name) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? true : false;
                emailValid === true && (value.length <= 60) ? setUserRequest({ emailValid: '' }) : setUserRequest({ emailValid: 'email is Invalid' });
                break;
            case 'billingZipPostal':
                pinValid = value[0];
                pin = value.match(/^([1-9]|10)$/)
                break;
            case 'tel':
                //value = value.match(/^[0-9]*$/) ? value : formValues.tel
                setUserRequest({ isContactValid: value && value != "" ? value.match(/^[0-9]*$/) ? true : false : true })
                break;
            case 'fName':
                if (value !== '') {
                    nameValid = value.match('^[a-zA-Z ]+$') ? true : false;
                    nameValid === true && (value.length <= 60) ? setUserRequest({ nameValid: '' }) : setUserRequest({ nameValid: 'Only alphabets allowed' });
                }
                break;
            case 'lName':
                if (value !== '') {
                    lastValid = value.match('^[a-zA-Z ]+$') ? true : false;
                    lastValid === true && (value.length <= 60) ? setUserRequest({ lastValid: '' }) : setUserRequest({ lastValid: 'Only alphabets allowed' });
                }
                break;
            default:
                break;
        }


        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        const { fName, lName, tel, website, billingAddress1, billingAddress2, billingZipPostal, billingCity, billingCountry,
            shippingAddress1, shippingAddress2, shippingCity, shippingCountry, email } = setFormValues

        if ((!email && email == "") || (emailValid !== '' && emailValid !== false)) {
            setUserRequest({
                emailValid: email == "" ? "This field is required" : " email is Invalid"
            })
        } else if (fName && (fName !== "" && (nameValid && nameValid !== '' && nameValid !== false))) {
            setUserRequest({
                nameValid: fName == "" ? "This field is required" : "Only alphabets allowed"
            })
        } else if (lName && (lName !== "" && (lastValid && lastValid !== '' && lastValid !== false))) {
            setUserRequest({
                lastValid: lName == "" ? "This field is required" : "Only alphabets allowed"
            })
        }




    }







    // Close Button popup
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleCreateCustomer &&  props.toggleCreateCustomer();
        }
        else {
            e.stopPropagation();
        }
        console.log(e.target.className)
    }


    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? "subwindow create-customer current" : "subwindow create-customer"}>
                <div className="subwindow-header">
                    <p>Create Customer</p>
                    <button className="close-subwindow" onClick={() => props.toggleCreateCustomer()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <section id="contactInfoSection">
                        <p>Contact Information</p>
                        <div className="input-row">
                            <div className="input-col">
                                <label htmlFor="email">Email*</label>
                                <input type="email" id="email" placeholder="Enter Email" name='email' value={formValues.email} onChange={(e) => handleChange(e)} />
                            </div>
                            <p>{emailValid}</p>
                            <div className="input-col">
                                <label htmlFor="tel">Phone Number</label>
                                <input id="tel" type="text" pattern='[0-9]{0,5}' autoComplete='off' maxLength={13} placeholder="Enter Phone Number" name='tel' value={formValues.tel} onChange={(e) => handleChange(e)} />
                            </div>
                        </div>
                        <div className="input-row">
                            <div className="input-col">
                                <label htmlFor="fName">First Name</label>
                                <input type="text" id="fName" value={formValues.fName} placeholder="Enter First Name" name='fName' onChange={(e) => handleChange(e)} />
                            </div>
                            <small>{nameValid}</small>
                            <div className="input-col">
                                <label htmlFor="lName">Last Name</label>
                                <input type="text" id="lName" placeholder="Enter Last Name" name='lName' onChange={(e) => handleChange(e)} value={formValues.lName} />
                            </div>
                            <small>{lastValid}</small>
                            <div className="input-col">
                                <label htmlFor="website">Website</label>
                                <input type="url" id="website" placeholder="Enter URL" name='website' value={formValues.website} onChange={(e) => handleChange(e)} />
                            </div>
                        </div>
                    </section>
                    <section id="billingAddress">
                        <p>Billing Address</p>
                        <div className="input-row">
                            <div className="input-col">
                                <label htmlFor="billingAddress1">Address 1</label>
                                <input type="text" id="billingAddress1" placeholder="Enter Address 1" name="billingAddress1" value={formValues.address1} onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="input-col">
                                <label htmlFor="billingAddress2">Address 2</label>
                                <input type="text" id="billingAddress2" placeholder="Enter Address 2" name="billingAddress2" value={formValues.address2} onChange={(e) => handleChange(e)} />
                            </div>
                        </div>
                        <div className="input-row">
                            <div className="input-col">
                                <label htmlFor="billingZipPostal">Zip/Postal Code</label>
                                <input type="text" id="billingZipPostal" placeholder="Enter Zip/Postal Code" name="billingZipPostal" value={formValues.billingZipPostal} onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="input-col">
                                <label htmlFor="billingCity">City</label>
                                <input type="text" id="billingCity" name="billingCity" placeholder="Enter City" value={formValues.billingCity} onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="input-col">
                                <label htmlFor="billingCountry">Country</label>
                                <input type="text" id="billingCountry" name="billingCountry" placeholder="Enter Country" value={formValues.billingCountry} onChange={(e) => handleChange(e)} />
                            </div>
                        </div>
                    </section>
                    <section id="shippingAddress">
                        <div className="title-row">
                            <p>Shipping Address</p>
                            <label className="custom-checkbox-wrapper">
                                <input type="checkbox" id="sameAsBillingCheckbox" name="sameAsBillingCheckbox" onChange={(e) => handleChange(e)} />
                                <div className="custom-checkbox">
                                    <img src={Checkmark} alt="" />
                                </div>
                                Same as billing
                            </label>
                        </div>
                        <div className="input-row">
                            <div className="input-col">
                                <label htmlFor="shippingAddress1">Address 1</label>
                                <input type="text" id="shippingAddress1" placeholder="Enter Address 1" value={formValues.shippingAddress1} name='shippingAddress1' onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="input-col">
                                <label htmlFor="shippingAddress2">Address 2</label>
                                <input type="text" id="shippingAddress2" name="shippingAddress2" value={formValues.shippingAddress2} placeholder="Enter Address 2" onChange={(e) => handleChange(e)} />
                            </div>
                        </div>
                        <div className="input-row">
                            <div className="input-col">
                                <label htmlFor="shippingZipPostal">Zip/Postal Code</label>
                                <input type="text" id="shippingZipPostal" name='shippingZipPostal' value={formValues.shippingZipPostal} placeholder="Enter Zip/Postal Code" onChange={(e) => handleChange(e)} />     <input type="text" id="shippingZipPostal" placeholder="Enter Zip/Postal Code" />
                            </div>
                            <div className="input-col">
                                <label htmlFor="shippingCity">City</label>
                                <input type="text" id="shippingCity" placeholder="Enter City" name="shippingCity" value={formValues.shippingCity} onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="input-col">
                                <label htmlFor="shippingCountry">Country</label>
                                <input type="text" id="shippingCountry" placeholder="Select Country" name="shippingCountry" value={formValues.shippingCountry} onChange={(e) => handleChange(e)} />
                            </div>
                        </div>
                    </section>
                    <button onClick={handleSubmit}>Create Customer</button>
                </div>
            </div>
        </div>)
}

export default CreateCustomer 