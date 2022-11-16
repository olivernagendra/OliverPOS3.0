import React, { useState, useEffect,useRef } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import X_Icon_DarkBlue from '../../assets/images/svg/X-Icon-DarkBlue.svg';
import down_angled_bracket from '../../assets/images/svg/down-angled-bracket.svg';
import Checkmark from '../../assets/images/svg/Checkmark.svg';
import { customergetPage, customersave, customerupdate } from '../customer/CustomerSlice'
import { get_UDid } from "../common/localSettings";
import STATUSES from "../../constants/apiStatus";
import { useIndexedDB } from 'react-indexed-db';
import Config from '../../Config'
import { LoadingModal } from "../common/commonComponents/LoadingModal";
const Customercreate = (props) => {
    // console.log("editcustomerparam", props)
    const textInput = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    var UID = get_UDid('UDID');
    const initialValues = { fName: "", lName: "", tel: "", website: "", billingAddress1: "", billingAddress2: "", billingZipPostal: "", billingCity: "", billingCountry: "", shippingAddress1: "", shippingAddress2: "", shippingCity: "", email: "", shippingZipPostal: "" };
    const [values, setValues] = useState(initialValues);
    const [toggleDrowpdown, settoggleDrowpdown] = useState(false)
    const [togglesecondDropdown, settogglesecondDropdown] = useState(false)
    const [togglethirdDropdown, settogglethirdDropdown] = useState(false)
    const [toggleFourDropdown, settoggleFourDropdown] = useState(false)
    const [toggleSameBilling, settoggleSameBilling] = useState(false)
    const [errors, setErrors] = useState({});
    const [allCustomerList, setAllCustomerList] = useState([])
    const [phone, setPhone] = useState();
    const [viewStateList, setviewStateList] = useState('')
    const [ShippingViewStateList, setShippingViewStateList] = useState('')
    const [country_name, setcountry_name] = useState('')
    const [Shippingcountry_name, setShippingCountryName] = useState('')
    const [shipping_state_name, setshippingstate_name] = useState('')
    const [state_name, setstate_name] = useState('')
    const [Cust_ID, setCust_ID] = useState('')
    const [isCusToSaveCart, setisCusToSaveCart] = useState(false)
    const [getCountryList, setgetCountryList] = useState(localStorage.getItem('countrylist') !== null ? typeof (localStorage.getItem('countrylist')) !== undefined ? localStorage.getItem('countrylist') !== 'undefined' ?
        Array.isArray(JSON.parse(localStorage.getItem('countrylist'))) === true ? JSON.parse(localStorage.getItem('countrylist')) : '' : '' : '' : '')
    const [getStateList, setgetStateList] = useState(localStorage.getItem('statelist') && localStorage.getItem('statelist') !== null ? typeof (localStorage.getItem('statelist')) !== undefined ? localStorage.getItem('statelist') !== 'undefined' ?
        Array.isArray(JSON.parse(localStorage.getItem('statelist'))) === true ? JSON.parse(localStorage.getItem('statelist')) : '' : '' : '' : '')



    // Toggle dropDown country and state
    const hundledropdown = () => {
        settoggleDrowpdown(!toggleDrowpdown)
    }
    const hundleseconddropdown = () => {
        settogglesecondDropdown(!togglesecondDropdown)
    }
    const hundleThirdDropdown = () => {
        settogglethirdDropdown(!togglethirdDropdown)
    }
    const hundleFourDropdown = () => {
        settoggleFourDropdown(!toggleFourDropdown)
    }
    // Same As Billing
    const ClickSameBilling = () => {
        const { fName, lName, tel, website, billingAddress1, billingAddress2, billingZipPostal, billingCity, billingCountry, shippingAddress1, shippingAddress2, shippingCity, email, shippingZipPostal } = values
        settoggleSameBilling(!toggleSameBilling)
        setshippingstate_name(state_name)
        setShippingCountryName(country_name)
        setValues({
            WPId: "",
            fName: fName,
            lName: lName,
            tel: tel,
            website: website,
            billingAddress1: billingAddress1 ? billingAddress1 : '',
            billingAddress2: billingAddress2 ? billingAddress2 : "",
            billingZipPostal: billingZipPostal ? billingZipPostal : "",
            billingCity: billingCity ? billingCity : "",
            billingCountry: billingCountry ? billingCountry : '',
            email: email,
            phone: phone,
            shippingAddress1: billingAddress1,
            shippingAddress2: billingAddress2,
            shippingCity: billingCity,
            shippingZipPostal: billingZipPostal,
        })
    }






    // Getting Customer from index DB
    const GetCustomerFromIDB = () => {
        useIndexedDB("customers").getAll().then((rows) => {
            setAllCustomerList(rows);
        });
    }

    let useCancelled = false;
    useEffect(() => {
        textInput.current.focus();
        if (useCancelled == false) {
            GetCustomerFromIDB()
        }
        // Edit Customer setState Save From Props Data
        if (props.editcustomerparam == "editcustomer") {
            var billingAddress1 = ''
            var billingAddress2 = ''
            var billingZipPostal = ''
            var billingCity = ''
            var billingState = ''
            var billingCountry = ''
            var shippingAddress1 = ''
            var shippingAddress2 = ''
            var shippingZipPostal = ''
            var shippingCity = ''
            var shippingState = ''
            var shippingCountry
            props.CustomerAddress.map(item => {
                if (item.TypeName == "billing") {
                    billingAddress1 = item.Address1
                    billingAddress2 = item.Address2
                    billingCity = item.City
                    billingState = item.State
                    billingCountry = item.Country
                    billingZipPostal = item.PostCode

                } else if (item.TypeName == "shipping") {
                    shippingAddress1 = item.Address1
                    shippingAddress2 = item.address2
                    shippingZipPostal = item.PostCode
                    shippingCity = item.City
                    shippingState = item.State
                    shippingCountry = item.Country
                }
            })
            setPhone(props.customerDetailData.Contact);
            setValues({
                WPId: "",
                email: props.customerDetailData.Email,
                fName: props.customerDetailData.FirstName,
                lName: props.customerDetailData.LastName,
                tel: "",
                website: "",
                billingAddress1: billingAddress1,
                billingAddress2: billingAddress2,
                billingZipPostal: billingZipPostal,
                billingCity: billingCity,
                billingCountry: "",
                shippingAddress1: shippingAddress1,
                shippingAddress2: shippingAddress1,
                shippingCity: shippingCity,
                shippingZipPostal: shippingCountry,
            })
            setcountry_name(billingCountry)
            setstate_name(billingState)
            setShippingCountryName(shippingCountry)
            setshippingstate_name(shippingState)
            setCust_ID(props.customerDetailData.WPId)

        } else if (props.isShow === true) {
            clearInputFeild();
        }
        return () => {
            useCancelled = true;
        }
    }, [props.editcustomerparam, props.isShow]);



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



    // Check data validation 
    const validate = (values) => {
        //    console.log("values validate", values)
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



    const handleSubmit = (addtocart) => {
        // e.preventDefault();
        const { fName, lName, tel, website, billingAddress1, billingAddress2, billingZipPostal, billingCity, billingCountry, shippingAddress1, shippingAddress2, shippingCity, email, shippingZipPostal } = values
        if (validate(values)) {
            var userExist = false;
            userExist = getExistingCustomerEmail(values.email);
            if (userExist == true) {
                alert("Given email already exist! Please try another")

                // Create New Customer
            } else if (props.editcustomerparam !== "editcustomer" && Cust_ID == "" && addtocart !== "addtocart") {
                const save = {
                    WPId: "",
                    FirstName: fName,
                    LastName: lName,
                    Contact: phone,
                    startAmount: 0,
                    Email: email,
                    udid: UID,
                    notes: " ",
                    //Billing
                    StreetAddress: billingAddress1 ? billingAddress1 : "",
                    StreetAddress2: billingAddress2 ? billingAddress2 : "",
                    BillingPincode: billingZipPostal ? billingZipPostal : "",
                    BillingCity: billingCity ? billingCity : "",
                    BillingCountry: country_name ? country_name : "",
                    BillingState: state_name ? state_name : "",
                    //Shippig
                    shippingAddress1: shippingAddress1 ? shippingAddress1 : "",
                    shippingAddress2: shippingAddress2 ? shippingAddress2 : "",
                    ShippingPincode: shippingZipPostal ? shippingZipPostal : "",
                    shippingCity: shippingCity ? shippingCity : '',
                    ShippingCountry: Shippingcountry_name ? Shippingcountry_name : "",
                    ShippingState: shipping_state_name ? shipping_state_name : "",
                    website: website ? website : ""

                }
                console.log("save", save)
                dispatch(customersave(save, 'create',));
                clearInputFeild()
                props.toggleCreateCustomer()

                // Customer Create And  Add To Cart
            } else if (addtocart == "addtocart") {
                const save = {
                    WPId: "",
                    FirstName: fName,
                    LastName: lName,
                    Contact: phone,
                    startAmount: 0,
                    Email: email,
                    udid: UID,
                    notes: " ",
                    //Billing
                    StreetAddress: billingAddress1 ? billingAddress1 : '',
                    StreetAddress2: billingAddress2 ? billingAddress2 : '',
                    BillingPincode: billingZipPostal ? billingZipPostal : '',
                    BillingCity: billingCity ? billingCity : '',
                    BillingCountry: country_name ? country_name : '',
                    BillingState: state_name ? state_name : '',
                    //Shippig
                    shippingAddress1: shippingAddress1 ? shippingAddress1 : '',
                    shippingAddress2: shippingAddress2 ? shippingAddress2 : '',
                    ShippingPincode: shippingZipPostal ? shippingZipPostal : '',
                    shippingCity: shippingCity ? shippingCity : '',
                    ShippingCountry: Shippingcountry_name ? Shippingcountry_name : '',
                    ShippingState: shipping_state_name ? shipping_state_name : '',
                    website: website ? website : ''
                }
                setisCusToSaveCart(true)
                console.log("add to cart", save)
                dispatch(customersave(save, 'create',));
                clearInputFeild()
            }


        }
    };

    const updateHandleSubmit = () => {

        const { fName, lName, tel, website, billingAddress1, billingAddress2, billingZipPostal, billingCity, billingCountry, shippingAddress1, shippingAddress2, shippingCity, email, shippingZipPostal } = values
        if (validate(values)) {
            // Update and Edit Customer
            if (Cust_ID && Cust_ID != "") {
                const update = {
                    WPId: Cust_ID,
                    FirstName: fName,
                    LastName: lName,
                    Contact: phone,
                    startAmount: 0,
                    Email: email,
                    udid: UID,
                    notes: " ",
                    //Billing
                    StreetAddress: billingAddress1 ?billingAddress1:"",
                    StreetAddress2: billingAddress2 ?billingAddress2:"",
                    BillingPincode: billingZipPostal ?billingZipPostal:"",
                    BillingCity: billingCity ?billingCity:'',
                    BillingCountry: country_name,
                    BillingState: state_name,
                    //Shippig
                    shippingAddress1: shippingAddress1,
                    shippingAddress2: shippingAddress2,
                    ShippingPincode: shippingZipPostal,
                    shippingCity: shippingCity,
                    ShippingCountry: Shippingcountry_name,
                    ShippingState: shipping_state_name,
                    website: website
                }
                dispatch(customerupdate(update, 'update'));
                console.log("update", update)
                clearInputFeild()
                props.toggleEditcustomer()
            }
        }


    }





    const clearInputFeild = () => {

        // setValues({
        //     WPId: "", fName: "", lName: "", tel: "", website: "", billingAddress1: "", billingAddress2: "", billingZipPostal: "", billingCity: "", billingCountry: "", shippingAddress1: "", shippingAddress2: "", shippingCity: "", email: "", phone: "", shippingZipPostal: "",
        // })
        setValues(initialValues);
        settoggleSameBilling(false)
        setPhone('');
        /// setValues({ email: "" })
        setcountry_name("")
        setstate_name("")
        setShippingCountryName("")
        setshippingstate_name("")
        setCust_ID("")


    }




    /// Customer add in Index DB
    const { add, update, getByID, getAll, deleteRecord } = useIndexedDB("customers");
    const AddCustomerInIndexDB = (UID, customerAdd) => {
        add(customerAdd).then(
            (key) => {
                console.log("ID Generated: ", key);
                props.getCustomerFromIDB && props.getCustomerFromIDB()
            },
            (error) => {
                console.log(error);
            }
        )
    }

    const UpdateCustomerInIndexDB = (UID, customerAdd) => {
        update(customerAdd).then(
            (key) => {
                console.log("ID Generated: ", key);
                props.getCustomerFromIDB && props.getCustomerFromIDB()
            },
            (error) => {
                console.log(error);
            }
        )
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
            props.toggleCreateCustomer() && props.toggleCreateCustomer();
            props.toggleEditcustomer() && props.toggleEditcustomer();
        }
        else {
            e.stopPropagation();
        }
    }


    // Billing DropDown Click  
    const onChangeList = (code, name) => {
        var finalStatelist = [];
        getStateList && getStateList.find(function (element) {
            if (element.Country == code) {
                finalStatelist.push(element)
            }
        })
        setviewStateList(finalStatelist)
        setcountry_name(name)
        setstate_name('')
    }
    // Billing DropDown Click  
    const onChangeStateList = (code, name) => {
        setstate_name(name.replace(/[^a-zA-Z]/g, ' '))
    }


    // shipping DropDown Click  
    const shippCountryClick = (code, name) => {
        var finalStatelist = [];
        getStateList && getStateList.find(function (element) {
            if (element.Country == code) {
                finalStatelist.push(element)
            }
        })
        setShippingViewStateList(finalStatelist)
        setShippingCountryName(name)
        setshippingstate_name('')

    }

    // shipping DropDown Click  
    const onChangeShipStateList = (code, name) => {
        setshippingstate_name(name.replace(/[^a-zA-Z]/g, ' '))
    }








    // Customer create and Save API response
    const [customerres] = useSelector((state) => [state.customersave])
    useEffect(() => {
        if (customerres && customerres.status == STATUSES.IDLE && customerres.is_success && customerres.data) {
           // console.log("customersave",customerres)
            AddCustomerInIndexDB(UID, customerres.data.content)
            if (isCusToSaveCart == true) {
                addCustomerToSale(customerres.data.content)
            }

        }
    }, [customerres, isCusToSaveCart]);


     // Customer Edit  API response
     const [customereditsucc] = useSelector((state) => [state.customerupdate])
     useEffect(() => {
       if (customereditsucc && customereditsucc.status == STATUSES.IDLE && customereditsucc.is_success && customereditsucc.data) {
        // console.log("customereditsucc",customereditsucc)
       UpdateCustomerInIndexDB(UID,customereditsucc.data.content)
       }
     }, [customereditsucc]);



    // Customer add to card
    const addCustomerToSale = (customerAdd) => {
        if (customerAdd) {
            localStorage.setItem('AdCusDetail', JSON.stringify(customerAdd))
            var list = localStorage.getItem('CHECKLIST') !== null ? (typeof localStorage.getItem('CHECKLIST') !== 'undefined') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null : null;
            if (list != null) {
                const CheckoutList = {
                    ListItem: list.ListItem,
                    customerDetail: customerAdd ? customerAdd : [],
                    totalPrice: list.totalPrice,
                    discountCalculated: list.discountCalculated,
                    tax: list.tax,
                    subTotal: list.subTotal,
                    TaxId: list.TaxId,
                    TaxRate: list.TaxRate,
                    oliver_pos_receipt_id: list.oliver_pos_receipt_id,
                    order_date: list.order_date,
                    order_id: list.order_id,
                    status: list.status,
                    showTaxStaus: list.showTaxStaus,
                    _wc_points_redeemed: list._wc_points_redeemed,
                    _wc_amount_redeemed: list._wc_amount_redeemed,
                    _wc_points_logged_redemption: list._wc_points_logged_redemption
                }
                localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList))
            }
            navigate('/home')
        }

    }

   // console.log("values",values)
  //  console.log(" props.searchSringCreate", props.searchSringCreate)



    return (
        <>
            {customerres.status == STATUSES.LOADING ? <LoadingModal /> : null}

            <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
                <div className={props.isShow === true ? "subwindow create-customer current" : "subwindow create-customer"}>
                    <div className="subwindow-header">
                        {props.editcustomerparam == 'editcustomer' ? <>
                            <p>Edit Customer</p> <button className="close-subwindow" onClick={() => props.toggleEditcustomer()}>
                                <img src={X_Icon_DarkBlue} alt="" />
                            </button>
                        </>
                            :
                            <> <p>Create Customer</p>     <button className="close-subwindow" onClick={() => props.toggleCreateCustomer()}>
                                <img src={X_Icon_DarkBlue} alt="" />
                            </button>
                            </>}


                    </div>
                    <div className="subwindow-body">
                        {/* <form id="myform" autoComplete="off"> */}
                        {/* <section id="contactInfoSection"> */}
                        <div id="custInfoSection">
                            <p>Contact Information</p>
                            <div className="input-row">
                                <div className="input-col">
                                    <label for="newCustEmail">Email*</label>
                                    <input type="email" placeholder="Enter Email" name='email'
                                        value={values.email ? values.email : props.searchSringCreate} onChange={(e) => handleChange(e.target.name, e.target.value)} autoComplete ='off' ref={textInput} />
                                    {/* <p>{errors.email}</p> */}
                                    <div className="error-wrapper">{errors.email}</div>
                                </div>

                                <div className="input-col">
                                    <label for="newCustPhone">Phone Number</label>
                                    <input id="newCustPhone" type="text" pattern='[0-9]{0,5}' autoComplete='off' maxLength={13} placeholder="Enter Phone Number" name='tel' value={phone} onChange={handleChangePhone} />
                                    <div className="error-wrapper"></div>
                                </div>
                            </div>
                            <div className="input-row">
                                <div className="input-col">
                                    <label for="newCustFirstName">First Name</label>
                                    <input type="text" id="newCustFirstName" value={values.fName} placeholder="Enter First Name" name='fName' onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                    <div className="error-wrapper"></div>
                                    {/* <p>{errors.fName}</p> */}
                                </div>

                                <div className="input-col">
                                    <label for="newCustLastName">Last Name</label>
                                    <input type="text" id="newCustLastName" placeholder="Enter Last Name" name='lName' onChange={(e) => handleChange(e.target.name, e.target.value)} value={values.lName} />
                                    <div className="error-wrapper"></div>
                                    {/* <p>{errors.lName}</p> */}
                                </div>
                            </div>
                            <div className="input-row">
                                <div className="input-col">
                                    <label for="newCustWebsite">Website</label>
                                    <input type="url" id="newCustWebsite" placeholder="Enter URL" name='website' value={values.website} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                    <div className="error-wrapper"></div>
                                </div>
                                <div className="input-col"></div>
                            </div>
                            {/* </section> */}
                        </div>
                        <div id="billingAddressSection">
                            <p>Billing Address</p>
                            <div className="input-row">
                                <div className="input-col">
                                    <label for="newCustAddress1Billing">Address 1</label>
                                    <input type="text" id="newCustAddress1Billing" placeholder="Enter Address 1" name="billingAddress1" value={values.billingAddress1} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                    <div className="error-wrapper"></div>
                                </div>
                                <div className="input-col">
                                    <label for="newCustAddress2Billing">Address 2</label>
                                    <input type="text" id="newCustAddress2Billing" placeholder="Enter Address 2" name="billingAddress2" value={values.billingAddress2} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                    <div className="error-wrapper"></div>
                                </div>
                            </div>
                            <div className="input-row">
                                <div className="input-col">
                                    <label for="newCustZipPCBilling">Zip/Postal Code</label>
                                    <input type="text" id="newCustZipPCBilling" placeholder="Enter Zip/Postal Code" name="billingZipPostal" value={values.billingZipPostal} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                    <div className="error-wrapper"></div>
                                </div>
                                <div className="input-col">
                                    <label for="newCustCityBilling">City</label>
                                    <input type="text" id="newCustCityBilling" name="billingCity" placeholder="Enter City" value={values.billingCity} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                    <div className="error-wrapper"></div>
                                </div>

                            </div>
                            <div className="input-row">
                                <div className="input-col">
                                    <label for="newCustStateProvBilling">State/Province</label>
                                    <div onClick={hundledropdown} className={toggleDrowpdown === true ? "dropdown-wrapper open " : "dropdown-wrapper"} >
                                        <input type="text" id="newCustStateProvBilling" placeholder="Select State/Province" value={country_name.replace(/[^a-zA-Z]/g, ' ')} readOnly />
                                        <div className="error-wrapper" ></div>
                                        <img src={down_angled_bracket} alt="" />
                                        <div className="option-container"    >
                                            {getCountryList && getCountryList.map((item, index) => {
                                                return (
                                                    <div className="option" onClick={() => onChangeList(item.Code, item.Name)} >
                                                        <p key={index} value={item.Code}>{item.Name.replace(/[^a-zA-Z]/g, ' ')}</p>
                                                    </div>)
                                            })}

                                        </div>
                                    </div>
                                </div>
                                <div className="input-col">
                                    <label for="newCustCountryBilling">Country</label>
                                    <div onClick={hundleseconddropdown} className={togglesecondDropdown === true ? "dropdown-wrapper open " : "dropdown-wrapper"}>
                                        <input type="text" id="newCustCountryBilling" placeholder="Select Country" value={state_name.replace(/[^a-zA-Z]/g, ' ')} readOnly />
                                        <div className="error-wrapper"></div>
                                        <img src={down_angled_bracket} alt="" />
                                        <div className="option-container" >
                                            {viewStateList && viewStateList.map((item, index) => {
                                                return (
                                                    <div className="option" onClick={() => onChangeStateList(item.Code, item.Name)}>
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
                                    <input type="checkbox" id="sameAsBillingCheckbox" name="sameAsBillingCheckbox" onClick={ClickSameBilling} />
                                    <div className="custom-checkbox">
                                        <img src={Checkmark} alt="" />
                                    </div>
                                    Same as billing
                                </label>
                            </div>
                            <div className={toggleSameBilling === true ? "input-row hidden " : "input-row"} >
                                <div className="input-col">
                                    <label for="shippingAddress1">Address 1</label>
                                    <input type="text" id="shippingAddress1" placeholder="Enter Address 1" value={values.shippingAddress1} name='shippingAddress1' onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                </div>
                                <div className="input-col">
                                    <label for="shippingAddress2">Address 2</label>
                                    <input type="text" id="shippingAddress2" name="shippingAddress2" value={values.shippingAddress2} placeholder="Enter Address 2" onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                </div>
                            </div>
                            <div className={toggleSameBilling === true ? "input-row hidden " : "input-row"}>
                                <div className="input-col">
                                    <label for="shippingZipPostal">Zip/Postal Code</label>
                                    <input type="text" id="shippingZipPostal" name='shippingZipPostal' value={values.shippingZipPostal} placeholder="Enter Zip/Postal Code" onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                </div>
                                <div className="input-col">
                                    <label for="shippingCity">City</label>
                                    <input type="text" id="shippingCity" placeholder="Enter City" name="shippingCity" value={values.shippingCity} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                                </div>
                            </div>
                            <div className={toggleSameBilling === true ? "input-row hidden " : "input-row"}>
                                <div className="input-col">
                                    <label for="newCustStateProvShipping">State/Province</label>
                                    <div onClick={hundleThirdDropdown} className={togglethirdDropdown === true ? "dropdown-wrapper open " : "dropdown-wrapper"}>
                                        <input type="text" id="newCustStateProvShipping" placeholder="Select State/Province" value={Shippingcountry_name.replace(/[^a-zA-Z]/g, ' ')} readOnly />
                                        <div className="error-wrapper"></div>
                                        <img src={down_angled_bracket} alt="" />
                                        <div className="option-container">
                                            {getCountryList && getCountryList.map((item, index) => {
                                                return (
                                                    <div className="option" onClick={() => shippCountryClick(item.Code, item.Name)}>
                                                        <p key={index} value={item.Code}  >{item.Name.replace(/[^a-zA-Z]/g, ' ')}</p>
                                                    </div>)
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="input-col">
                                    <label for="newCustCountryShipping">Country</label>
                                    <div onClick={hundleFourDropdown} className={toggleFourDropdown === true ? "dropdown-wrapper open " : "dropdown-wrapper"}>
                                        <input type="text" id="newCustCountryShipping" placeholder="Select Country" value={shipping_state_name.replace(/[^a-zA-Z]/g, ' ')} readOnly />
                                        <div className="error-wrapper"></div>
                                        <img src={down_angled_bracket} alt="" />
                                        <div className="option-container">
                                            {ShippingViewStateList && ShippingViewStateList.map((item, index) => {
                                                return (
                                                    <div className="option" onClick={() => onChangeShipStateList(item.Code, item.Name)}>
                                                        <p key={index} value={item.Code} > {props.country_name !== '' ? item.Name.replace(/[^a-zA-Z]/g, ' ') : ''}</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {props.editcustomerparam == 'editcustomer' ? <div className="button-row">
                            <button onClick={updateHandleSubmit}>Save and Update</button>
                        </div> : <div className="button-row">
                            <button onClick={handleSubmit}>Create Customer</button>
                            <button onClick={() => handleSubmit("addtocart")}>Create & Add to Cart</button>
                        </div>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Customercreate 