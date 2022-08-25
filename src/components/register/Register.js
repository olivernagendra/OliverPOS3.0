import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import AngledBracket_Left_Blue from '../../images/svg/AngledBracket-Left-Blue.svg'
import AngledBracket_Right_Grey from '../../images/svg/AngledBracket-Right-Grey.svg'
import Register_Icon_White from '../../images/svg/Register-Icon-White.svg'
import Kiosk_Icon_White from '../../images/svg/Kiosk-Icon-White.svg'
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg'


import STATUSES from "../../constants/apiStatus";
import { register } from "./registerSlice";
import { firebaseRegister } from "./firebaseRegisterSlice";
import { useNavigate } from 'react-router-dom';
import { get_locName, get_UDid, get_userName } from "../common/localSettings";
const Register = () => {
    const [selRegister, setSelRegister] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    var registers = [];
    var self_registers = [];
    var firebase_registers = [];

    const [respRegister, respFirebaseRegisters] = useSelector((state) => [state.register, state.firebaseRegister])

    if (respRegister.status === STATUSES.error) {
        console.log(respRegister.error)
    }
    if (respRegister.status == STATUSES.IDLE && respRegister.is_success) {
        const data = respRegister.data;
        registers = data && data.content && data.content.filter(a => a.IsSelfCheckout == false);
        self_registers = data && data.content && data.content.filter(a => a.IsSelfCheckout == true);
    }

    if (respFirebaseRegisters.status == STATUSES.IDLE && respFirebaseRegisters.is_success) {
        firebase_registers = respFirebaseRegisters.data && respFirebaseRegisters.data.content;
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => { //calling multiple api
        var loc_id = localStorage.getItem('Location');
        dispatch(register({ "id": loc_id }));
        dispatch(firebaseRegister());

    }
    const handleSubmit = (item, isTakeOver = false) => {
        var arry = [];
        arry.push(item)
        localStorage.setItem('pdf_format', JSON.stringify(arry))
        localStorage.setItem('register', item.id);
        localStorage.setItem('registerName', item.name);
        var getudid = get_UDid('UDID');
        localStorage.setItem(`last_login_register_id_${getudid}`, item.id);
        localStorage.setItem(`last_login_register_name_${getudid}`, item.name);
        localStorage.setItem('selectedRegister', JSON.stringify(item))
        setSelRegister(item);
        if (isTakeOver == false)
            navigate('/pin');
        else
            toggleSubwindow("takeover-register");
    }
    const takeOver = () => {
        navigate('/pin');
    }

    if (respRegister.status == STATUSES.LOADING) {
        return <div> Loading... </div>
    }
    return (
        <React.Fragment>
            <div className="choose-wrapper">
                <div className="choose-header">
                    <button id="backButton" onClick={() => window.location = "/location"} >
                        <img src={AngledBracket_Left_Blue} alt="" />
                        Back
                    </button>
                    <p>{get_userName() + " - " + get_locName()}</p>
                </div>
                <div className="choose-body-default">
                    <p>Choose Register/Device</p>
                    <div className="divider"></div>
                    <div className="button-container">
                        <p>Registers</p>
                        <div className="divider"></div>
                        <div className="button-group col">
                            {
                                registers.map((item, index) => {
                                    var inr = true;
                                    {
                                        firebase_registers && firebase_registers.length > 0 && firebase_registers.map((firebaseItem, indx) => {
                                            if (inr == true) {
                                                if (firebaseItem.RegisterId == item.id && firebaseItem.Status !== "available") {
                                                    inr = false
                                                }
                                            }
                                        })
                                    }
                                    return <button key={index} className={inr == true ? "option" : "option assigned"} onClick={() => handleSubmit(item, inr == true ? false : true)}>
                                        <div className="img-container background-blue">
                                            <img src={Register_Icon_White} alt="" className="register-icon" />
                                        </div>
                                        <div className="col">
                                            <p className="style1">{item.name}</p>
                                            <p className="style2">{inr == true ? 'Available' : 'Assigned'}</p>
                                        </div>
                                        {inr === true ?
                                            <React.Fragment><img src={AngledBracket_Right_Grey} alt="" />
                                                <div className="fake-button background-blue">Select</div></React.Fragment>
                                            : <React.Fragment>
                                                <img src={AngledBracket_Right_Grey} alt="" />
                                                <div className="fake-button background-blue">Take Over</div></React.Fragment>}
                                    </button>

                                })}

                        </div>
                        <p>Kiosks</p>
                        <div className="divider"></div>
                        <div className="button-group">
                            {self_registers.map((item, index) => {
                                return <button key={index} className="option" onClick={() => handleSubmit(item)}>
                                    <div className="img-container background-violet">
                                        <img src={Kiosk_Icon_White} alt="" className="kiosk-icon" />
                                    </div>
                                    <div className="col">
                                        <p className="style1">{item.name}</p>
                                        <p className="style2">Available</p>
                                    </div>
                                    <img src={AngledBracket_Right_Grey} alt="" />
                                    <div className="fake-button background-violet">Select</div>
                                </button>
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div className="subwindow-wrapper hidden">
                <div className="subwindow takeover-register">
                    <div className="subwindow-header">
                        <p>Take Over Register</p>
                        <button className="close-subwindow" >
                            {/* onClick={() => toggleSubwindow()} */}
                            <img src={X_Icon_DarkBlue} alt="" />
                        </button>
                    </div>
                    <div className="subwindow-body">
                        <div className="auto-margin-top"></div>
                        <p>
                            Are you sure you <br />
                            want to take over <b>{selRegister && selRegister.name}</b>? <br /><br />
                            This action will kick out the current user.
                        </p>
                        <button id="takeoverRegister" onClick={() => takeOver()}>Take Over</button>
                        <button id="cancelTakeover" >Cancel</button>
                        {/* onClick={() => toggleSubwindow()} */}
                        <div className="auto-margin-bottom"></div>
                    </div>
                </div>
            </div>
        </React.Fragment>)
}
export default Register