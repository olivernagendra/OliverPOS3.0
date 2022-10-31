import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import X_Icon_DarkBlue from '../../assets/images/svg/X-Icon-DarkBlue.svg';
import Checkmark from '../../assets/images/svg/Checkmark.svg';
import { customergetPage, customersave } from '../customer/CustomerSlice'
import { get_UDid } from "../common/localSettings";
import STATUSES from "../../constants/apiStatus";
import { useIndexedDB } from 'react-indexed-db';
import Config from '../../Config'
const Customercreate = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    var UID = get_UDid('UDID');


    const initialValues = { fName: "", lName: "", tel: "", website: "", billingAddress1: "", billingAddress2: "", billingZipPostal: "", billingCity: "", billingCountry: "", shippingAddress1: "", shippingAddress2: "", shippingCity: "", shippingCountry: "", email: "", };
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [allCustomerList, setAllCustomerList] = useState([])
    const [phone, setPhone] = useState();
   

    //  Customer GetPage Api response 
    const { customergetPagesdata, customergetPageserror, customergetPagesis_success, customergetPagesstatus } = useSelector((state) => state.customergetPage)
    // console.log("customergetPagesdata", customergetPagesdata, "customergetPageserror", customergetPageserror, "customergetPagesstatus,customergetPagesstatus", "customergetPagesis_success", customergetPagesis_success)

    if (customergetPagesstatus === STATUSES.IDLE && customergetPagesis_success) {
        if (customergetPagesdata && customergetPagesdata.content && customergetPagesdata.content !== customergetPagesis_success) {

        }
    }


    const GetCustomerFromIDB = () => {
        useIndexedDB("customers").getAll().then((rows) => {
            setAllCustomerList(rows);
        });
    }



    let useCancelled = false;
    useEffect(() => {
        //console.log("useeffect work")
        if (useCancelled == false) {
            GetCustomerFromIDB()
            dispatch(customergetPage({ "uid": UID, "pageSize": Config.key.CUSTOMER_PAGE_SIZE, "pageNumber": "0" }));
        }
        return () => {
            useCancelled = true;
        }
    }, []);



        // hundle change phoneNumber
    const handleChangePhone = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        setPhone(value);
    };

    const handleChange = (name, value) => {
        //props.childEmail(props.serachString)
        setValues({
            ...values,
            [name]: value
        });
        validate({ [name]: value });
    }


    const validate = (values) => {
        console.log("values validate", values)
        let temp = { ...errors }
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        const alphabets = /^[a-zA-Z ]+$/
        const re = /^[0-9\b]+$/;
        /// Email
        if (!values.email && typeof values.email !== 'undefined') {
            temp.email = " Email is required!";
        } else if (!regex.test(values.email) && typeof values.email !== 'undefined') {
            temp.email = "This is not a valid email format!";
        } else {
            temp.email = "";
        }
        // // FIRST NAME
        // if (!values.fName && typeof values.fName !== 'undefined') {
        //     temp.fName =   "First name is required!";
        // } else if (!alphabets.test(values.fName) && typeof values.fName !== 'undefined') {
        //     temp.fName =   "Only alphabets allowed!";
        // } else {
        //     temp.fName = "";
        // }
        // // LAST NAME
        // if (!values.lName && typeof values.lName !== 'undefined') {
        //     temp.lName = "Last name is required!";
        // } else if (!alphabets.test(values.lName)  &&typeof values.lName !== 'undefined' ) {
        //     temp.lName = "Only alphabets allowed!";
        // } else {
        //     temp.lName = "";
        // }
        setErrors({
            ...temp
        })
        if (values) {
            return Object.values(temp).every(x => x == "")
        }
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        const { fName, lName, tel, website, billingAddress1, billingAddress2, billingZipPostal, billingCity, billingCountry, shippingAddress1, shippingAddress2, shippingCity, shippingCountry, email } = values
        if (validate(values)) {
            var userExist = false;
            userExist = getExistingCustomerEmail(values.email);
            if (userExist == true) {
                alert("Given email already exist! Please try another")
            } else {
                const save = {
                    WPId: "",
                    FirstName: fName,
                    LastName: lName,
                    Contact: phone,
                    startAmount: 0,
                    Email: email,
                    udid: UID,
                    notes: "notes is here",
                    StreetAddress: billingAddress1,
                    Pincode: billingZipPostal,
                    City: billingCity,
                    Country: billingCountry,
                    State: "state_name",
                    StreetAddress2: billingAddress2,
                    shippingAddress1: shippingAddress1,
                    shippingAddress2: shippingAddress2,
                    shippingCity: shippingCity,
                    shippingCountry: shippingCountry,
                    website: website

                }
                console.log("save", save)
                dispatch(customersave(save, 'create',));
                clearInputFeild()
            }
        }
    };


    const clearInputFeild = () => {
        setTimeout(() => {
            setValues({
                WPId: "", fName: "", lName: "", tel: "", website: "", billingAddress1: "", billingAddress2: "", billingZipPostal: "", billingCity: "", billingCountry: "", shippingAddress1: "", shippingAddress2: "", shippingCity: "", shippingCountry: "", email: "", phone: ""
            })
        }, 500);
        props.toggleCreateCustomer()
    }




    /// Customer add in Index DB
    const { add, update, getByID, getAll, deleteRecord } = useIndexedDB("customers");
    const UpdateCustomerInIndexDB = (UID, customerAdd) => {
        add(customerAdd).then(
            (key) => {
                console.log("ID Generated: ", key);

            },
            (error) => {
                console.log(error);
            }
        )
    }


    // Customer create and Save API response
    const { status, data, error, is_success } = useSelector((state) => state.customersave)
    //console.log("status", status, "data", data, "error", error, "is_success", is_success)
    if (status == STATUSES.IDLE && is_success) {
        //  console.log("success")
        var customerAdd = data && data.content
        UpdateCustomerInIndexDB(UID, customerAdd)

    }

    // Check Email already exists !! 
    const getExistingCustomerEmail = (email) => {
        var Exist = false;
        allCustomerList && allCustomerList.map(cust => {
            if (cust.Email == email)
                Exist = true;
        })
        return Exist;
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
            <div className={props.isShow === true ? "subwindow create-customer current" : "subwindow create-customer"}>
                <div className="subwindow-header">
                    <p>Create Customer</p>
                    <button className="close-subwindow" onClick={() => props.toggleCreateCustomer()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <form id="myform" autoComplete="off">
                        <section id="contactInfoSection">
                            <p>Contact Information</p>
                            <div className="input-row">
                                <div className="input-col">
                                    <label htmlFor="email">Email*</label>
                                    <input type="email" id="email" placeholder="Enter Email" name='email' value={props.searchSringCreate} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                    <p>{errors.email}</p>
                                </div>

                                <div className="input-col">
                                    <label htmlFor="tel">Phone Number</label>
                                    <input id="tel" type="text" pattern='[0-9]{0,5}' autoComplete='off' maxLength={13} placeholder="Enter Phone Number" name='tel' value={phone} onChange={handleChangePhone} />
                                </div>
                            </div>
                            <div className="input-row">
                                <div className="input-col">
                                    <label htmlFor="fName">First Name</label>
                                    <input type="text" id="fName" value={values.fName} placeholder="Enter First Name" name='fName' onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                    {/* <p>{errors.fName}</p> */}
                                </div>

                                <div className="input-col">
                                    <label htmlFor="lName">Last Name</label>
                                    <input type="text" id="lName" placeholder="Enter Last Name" name='lName' onChange={(e) => handleChange(e.target.name, e.target.value)} value={values.lName} />
                                    {/* <p>{errors.lName}</p> */}
                                </div>

                                <div className="input-col">
                                    <label htmlFor="website">Website</label>
                                    <input type="url" id="website" placeholder="Enter URL" name='website' value={values.website} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                </div>
                            </div>
                        </section>
                        <section id="billingAddress">
                            <p>Billing Address</p>
                            <div className="input-row">
                                <div className="input-col">
                                    <label htmlFor="billingAddress1">Address 1</label>
                                    <input type="text" id="billingAddress1" placeholder="Enter Address 1" name="billingAddress1" value={values.address1} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                </div>
                                <div className="input-col">
                                    <label htmlFor="billingAddress2">Address 2</label>
                                    <input type="text" id="billingAddress2" placeholder="Enter Address 2" name="billingAddress2" value={values.address2} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                </div>
                            </div>
                            <div className="input-row">
                                <div className="input-col">
                                    <label htmlFor="billingZipPostal">Zip/Postal Code</label>
                                    <input type="text" id="billingZipPostal" placeholder="Enter Zip/Postal Code" name="billingZipPostal" value={values.billingZipPostal} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                </div>
                                <div className="input-col">
                                    <label htmlFor="billingCity">City</label>
                                    <input type="text" id="billingCity" name="billingCity" placeholder="Enter City" value={values.billingCity} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                </div>
                                <div className="input-col">
                                    <label htmlFor="billingCountry">Country</label>
                                    <input type="text" id="billingCountry" name="billingCountry" placeholder="Enter Country" value={values.billingCountry} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                </div>
                            </div>
                        </section>
                        <section id="shippingAddress">
                            <div className="title-row">
                                <p>Shipping Address</p>
                                <label className="custom-checkbox-wrapper">
                                    <input type="checkbox" id="sameAsBillingCheckbox" name="sameAsBillingCheckbox" onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                    <div className="custom-checkbox">
                                        <img src={Checkmark} alt="" />
                                    </div>
                                    Same as billing
                                </label>
                            </div>
                            <div className="input-row">
                                <div className="input-col">
                                    <label htmlFor="shippingAddress1">Address 1</label>
                                    <input type="text" id="shippingAddress1" placeholder="Enter Address 1" value={values.shippingAddress1} name='shippingAddress1' onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                </div>
                                <div className="input-col">
                                    <label htmlFor="shippingAddress2">Address 2</label>
                                    <input type="text" id="shippingAddress2" name="shippingAddress2" value={values.shippingAddress2} placeholder="Enter Address 2" onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                </div>
                            </div>
                            <div className="input-row">
                                <div className="input-col">
                                    <label htmlFor="shippingZipPostal">Zip/Postal Code</label>
                                    <input type="text" id="shippingZipPostal" name='shippingZipPostal' value={values.shippingZipPostal} placeholder="Enter Zip/Postal Code" onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                </div>
                                <div className="input-col">
                                    <label htmlFor="shippingCity">City</label>
                                    <input type="text" id="shippingCity" placeholder="Enter City" name="shippingCity" value={values.shippingCity} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                </div>
                                <div className="input-col">
                                    <label htmlFor="shippingCountry">Country</label>
                                    <input type="text" id="shippingCountry" placeholder="Select Country" name="shippingCountry" value={values.shippingCountry} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                </div>
                            </div>
                        </section>
                    </form>
                    {/* <button onClick={handleSubmit}>Create Customer</button> */}
                    <div class="button-row">
						<button onClick={handleSubmit}>Create Customer</button>
						<button>Create & Add to Cart</button>
					</div>
                </div>
            </div>
        </div>)
}

export default Customercreate 