import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import X_Icon_DarkBlue from '../../assets/images/svg/X-Icon-DarkBlue.svg';
import down_angled_bracket from '../../assets/images/svg/down-angled-bracket.svg';

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
    const [toggleDrowpdown, settoggleDrowpdown] = useState(false)
    const [togglesecondDropdown, settogglesecondDropdown] = useState(false)
    const [togglethirdDropdown, settogglethirdDropdown] = useState(false)
    const [toggleFourDropdown, settoggleFourDropdown] = useState(false)
    const [errors, setErrors] = useState({});
    const [allCustomerList, setAllCustomerList] = useState([])
    const [phone, setPhone] = useState();
    const [viewStateList, setviewStateList] = useState('')
    const [country_name, setcountry_name] = useState('')
    const [state_name, setstate_name] = useState('')
    const [stateName, setstateName] = useState('')
    const [selectedCountryName, setselectedCountryName] = useState('')
    const [getCountryList, setgetCountryList] = useState(localStorage.getItem('countrylist') !== null ? typeof (localStorage.getItem('countrylist')) !== undefined ? localStorage.getItem('countrylist') !== 'undefined' ?
        Array.isArray(JSON.parse(localStorage.getItem('countrylist'))) === true ? JSON.parse(localStorage.getItem('countrylist')) : '' : '' : '' : '')
    const [getStateList, setgetStateList] = useState(localStorage.getItem('statelist') && localStorage.getItem('statelist') !== null ? typeof (localStorage.getItem('statelist')) !== undefined ? localStorage.getItem('statelist') !== 'undefined' ?
        Array.isArray(JSON.parse(localStorage.getItem('statelist'))) === true ? JSON.parse(localStorage.getItem('statelist')) : '' : '' : '' : '')



    const hundledropdown = () => {
        settoggleDrowpdown(!toggleDrowpdown)
    }

    const hundleseconddropdown = () => {
        settogglesecondDropdown(!togglesecondDropdown)
    }

    const hundleThirdDropdown =()=>{
        settogglethirdDropdown(!togglethirdDropdown)
    }
    const hundleFourDropdown=()=>{
        settoggleFourDropdown(!toggleFourDropdown)
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


    const onChangeList = (e) => {
        console.log("e.target.value", e.target.value)
        var finalStatelist = [];
        getStateList && getStateList.find(function (element) {
            if (element.Country == e.target.value) {
                finalStatelist.push(element)
            }
        })
        console.log("finalStatelist", finalStatelist)
        setviewStateList(finalStatelist)
        setcountry_name(e.target.value)
        setstate_name('')
        setstateName('')
        EditCountryToStateList()
        getCountryAndStateName()
    }

    const onChangeStateList = (e) => {
        console.log("e.target.value", e.target.value)
        setstate_name(e.target.value)
    }


    const getCountryAndStateName = (stateCode, countryCode) => {
        var stat_name = ''
        var count_name = ''
        var count_code = ''
        var finalStatelist = []
        getCountryList && getCountryList.find(function (element) {
            if (element.Code == countryCode || element.Name.replace(/[^a-zA-Z]/g, ' ') == countryCode) {
                count_name = element
                count_code = element.Code
            }
        })
        setselectedCountryName(count_name ? count_name.Name : countryCode)
        setcountry_name(count_code)

        getStateList && getStateList.find(function (element) {
            if (element.Code === stateCode && count_code === element.Country) {
                stat_name = element
            } else if (element.Code === stateCode && countryCode === element.Country) {
                stat_name = element
            } else if (element.Name === stateCode && countryCode === element.Country) {
                stat_name = element
            } else if (element.Name === stateCode && count_code === element.Country) {
                stat_name = element
            }
        })

        setstate_name(stateCode)
    }

    const setCountryToStateList = (country_name, state_name) => {
        const { getStateList, getCountryList } = this.state;
        var count_code = '';
        var finalStatelist = [];
        getCountryList && getCountryList.find(function (element) {
            if (element.Code == country_name || element.Name.replace(/[^a-zA-Z]/g, ' ') == country_name) {
                count_code = element.Code
            }
        })
        getStateList && getStateList.find(function (element) {
            if (element.Country == count_code) {
                finalStatelist.push(element)
            } else if (element.Country == country_name) {
                finalStatelist.push(element)
            }
        })
        if (finalStatelist.length > 0) {
            setviewStateList(finalStatelist)

        }
    }

    const EditCountryToStateList = (country_name, state_name) => {
        var count_code = '';
        var finalStatelist = [];
        getCountryList && getCountryList.find(function (element) {
            if (element.Code == country_name || element.Name.replace(/[^a-zA-Z]/g, ' ') == country_name) {
                count_code = element.Code
            }
        })
        getStateList && getStateList.find(function (element) {
            if (element.Country == count_code) {
                finalStatelist.push(element)
            } else if (element.Country == country_name) {
                finalStatelist.push(element)
            }
        })
        if (finalStatelist && finalStatelist !== null && finalStatelist.length > 0) {

            setviewStateList(finalStatelist)
        }
    }




    
  const addCustomerToSale = () => {

    // e.preventDefault();
    // const { fName, lName, tel, website, billingAddress1, billingAddress2, billingZipPostal, billingCity, billingCountry, shippingAddress1, shippingAddress2, shippingCity, shippingCountry, email } = values
    // if (validate(values)) {
    //     var userExist = false;
    //     userExist = getExistingCustomerEmail(values.email);
    //     if (userExist == true) {
    //         alert("Given email already exist! Please try another")
    //     } else {
    //         const save = {
    //             WPId: "",
    //             FirstName: fName,
    //             LastName: lName,
    //             Contact: phone,
    //             startAmount: 0,
    //             Email: email,
    //             udid: UID,
    //             notes: "notes is here",
    //             StreetAddress: billingAddress1,
    //             Pincode: billingZipPostal,
    //             City: billingCity,
    //             Country: billingCountry,
    //             State: "state_name",
    //             StreetAddress2: billingAddress2,
    //             shippingAddress1: shippingAddress1,
    //             shippingAddress2: shippingAddress2,
    //             shippingCity: shippingCity,
    //             shippingCountry: shippingCountry,
    //             website: website

    //         }
    //         console.log("save", save)
    //     }





    // var data = cutomer_data;
    // localStorage.setItem('AdCusDetail', JSON.stringify(data))
    // var list = localStorage.getItem('CHECKLIST') !== null ? (typeof localStorage.getItem('CHECKLIST') !== 'undefined') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null : null;
    // if (list != null) {
    //   const CheckoutList = {
    //     ListItem: list.ListItem,
    //     customerDetail: data ? data : [],
    //     totalPrice: list.totalPrice,
    //     discountCalculated: list.discountCalculated,
    //     tax: list.tax,
    //     subTotal: list.subTotal,
    //     TaxId: list.TaxId,
    //     TaxRate: list.TaxRate,
    //     oliver_pos_receipt_id: list.oliver_pos_receipt_id,
    //     order_date: list.order_date,
    //     order_id: list.order_id,
    //     status: list.status,
    //     showTaxStaus: list.showTaxStaus,
    //     _wc_points_redeemed: list._wc_points_redeemed,
    //     _wc_amount_redeemed: list._wc_amount_redeemed,
    //     _wc_points_logged_redemption: list._wc_points_logged_redemption
    //   }
    //   localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList))
    // }
    navigate('/home')
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
                    {/* <form id="myform" autoComplete="off"> */}
                    {/* <section id="contactInfoSection"> */}
                    <div id="custInfoSection">
                        <p>Contact Information</p>
                        <div className="input-row">
                            <div className="input-col">
                                <label htmlFor="newCustEmail">Email*</label>
                                <input type="email" id="newCustEmail" className="error required" placeholder="Enter Email" name='email' value={props.searchSringCreate} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                {/* <p>{errors.email}</p> */}
                                <div class="error-wrapper"></div>
                            </div>

                            <div className="input-col">
                                <label htmlFor="newCustPhone">Phone Number</label>
                                <input id="newCustPhone" className="error invalid-input" type="text" pattern='[0-9]{0,5}' autoComplete='off' maxLength={13} placeholder="Enter Phone Number" name='tel' value={phone} onChange={handleChangePhone} />
                                <div class="error-wrapper"></div>
                            </div>
                        </div>
                        <div className="input-row">
                            <div className="input-col">
                                <label htmlFor="newCustFirstName">First Name</label>
                                <input type="text" id="newCustFirstName" value={values.fName} placeholder="Enter First Name" name='fName' onChange={(e) => handleChange(e.target.name, e.target.value)} className="error" />
                                <div class="error-wrapper"></div>
                                {/* <p>{errors.fName}</p> */}
                            </div>

                            <div className="input-col">
                                <label htmlFor="newCustLastName">Last Name</label>
                                <input type="text" id="newCustLastName" placeholder="Enter Last Name" name='lName' onChange={(e) => handleChange(e.target.name, e.target.value)} value={values.lName} />
                                <div class="error-wrapper"></div>
                                {/* <p>{errors.lName}</p> */}
                            </div>
                        </div>
                        <div className="input-row">
                            <div className="input-col">
                                <label htmlFor="newCustWebsite">Website</label>
                                <input type="url" id="newCustWebsite" placeholder="Enter URL" name='website' value={values.website} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                <div class="error-wrapper"></div>
                            </div>
                            <div class="input-col"></div>
                        </div>
                        {/* </section> */}
                    </div>
                    <div id="billingAddressSection">
                        <p>Billing Address</p>
                        <div className="input-row">
                            <div className="input-col">
                                <label htmlFor="newCustAddress1Billing">Address 1</label>
                                <input type="text" id="newCustAddress1Billing" placeholder="Enter Address 1" name="billingAddress1" value={values.address1} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                <div class="error-wrapper"></div>
                            </div>
                            <div className="input-col">
                                <label htmlFor="newCustAddress2Billing">Address 2</label>
                                <input type="text" id="newCustAddress2Billing" placeholder="Enter Address 2" name="billingAddress2" value={values.address2} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                <div class="error-wrapper"></div>
                            </div>
                        </div>
                        <div className="input-row">
                            <div className="input-col">
                                <label htmlFor="newCustZipPCBilling">Zip/Postal Code</label>
                                <input type="text" id="newCustZipPCBilling" placeholder="Enter Zip/Postal Code" name="billingZipPostal" value={values.billingZipPostal} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                <div class="error-wrapper"></div>
                            </div>
                            <div className="input-col">
                                <label htmlFor="newCustCityBilling">City</label>
                                <input type="text" id="newCustCityBilling" name="billingCity" placeholder="Enter City" value={values.billingCity} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                <div class="error-wrapper"></div>
                            </div>

                        </div>
                        <div className="input-row">
                            <div class="input-col">
                                <label for="newCustStateProvBilling">State/Province</label>
                                <div onClick={hundledropdown} className={toggleDrowpdown === true ? "dropdown-wrapper open " : "dropdown-wrapper"} >
                                    <input type="text" id="newCustStateProvBilling" placeholder="Select State/Province" />
                                    <div class="error-wrapper" onChange={onChangeList}></div>
                                    <img src={down_angled_bracket} alt="" />
                                    <div class="option-container"  >
                                        {getCountryList && getCountryList.map((item, index) => {
                                            return (
                                                <div class="option">
                                                    <p key={index} value={item.Code}  >{item.Name.replace(/[^a-zA-Z]/g, ' ')}</p>
                                                </div>)
                                        })}

                                    </div>
                                </div>
                            </div>
                            <div className="input-col">
                                <label htmlFor="newCustCountryBilling">Country</label>
                                <div onClick={hundleseconddropdown} className={togglesecondDropdown === true ? "dropdown-wrapper open " : "dropdown-wrapper"}>
                                    <input type="text" id="newCustCountryBilling" onChange={onChangeStateList} placeholder="Select Country" readonly />
                                    <div class="error-wrapper"></div>
                                    <img src={down_angled_bracket} alt="" />
                                    <div class="option-container" >
                                        {getStateList && getStateList.map((item, index) => {
                                            return (
                                                <div class="option">
                                                    <p key={index} value={item.Code} > {props.country_name !== '' ? item.Name.replace(/[^a-zA-Z]/g, ' ') : ''}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="shippingAddressSection">
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
                        </div>
                        <div className="input-row">
                            <div className="input-col">
                                <label for="newCustStateProvShipping">State/Province</label>
                                <div onClick={hundleThirdDropdown} className={togglethirdDropdown === true ? "dropdown-wrapper open " : "dropdown-wrapper"}>
                                    <input type="text" id="newCustStateProvShipping" placeholder="Select State/Province" readonly />
                                    <div className="error-wrapper"></div>
                                    <img src={down_angled_bracket} alt="" />
                                    <div className="option-container">
                                        {getCountryList && getCountryList.map((item, index) => {
                                            return (
                                                <div className="option">
                                                    <p key={index} value={item.Code}  >{item.Name.replace(/[^a-zA-Z]/g, ' ')}</p>
                                                </div>)
                                        })}


                                    </div>
                                </div>
                            </div>
                            <div className="input-col">
                                <label htmlFor="newCustCountryShipping">Country</label>
                                {/* <input type="text" id="newCustCountryBilling" placeholder="Select Country" name="shippingCountry" value={values.shippingCountry} onChange={(e) => handleChange(e.target.name, e.target.value)} /> */}
                                <div onClick={hundleFourDropdown} className={toggleFourDropdown === true ? "dropdown-wrapper open " : "dropdown-wrapper"}>
                                    <input type="text" id="newCustCountryShipping" placeholder="Select Country" readonly />
                                    <div className="error-wrapper"></div>
                                    <img src={down_angled_bracket} alt="" />
                                    <div className="option-container">
                                        {getStateList && getStateList.map((item, index) => {
                                            return (
                                                <div className="option">
                                                    <p key={index} value={item.Code} > {props.country_name !== '' ? item.Name.replace(/[^a-zA-Z]/g, ' ') : ''}</p>
                                                </div>
                                            )
                                        })}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* </form> */}
                    {/* <button onClick={handleSubmit}>Create Customer</button> */}
                    <div className="button-row">
                        <button onClick={handleSubmit}>Create Customer</button>
                        <button onClick={() => addCustomerToSale()}>Create & Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>)
}

export default Customercreate 