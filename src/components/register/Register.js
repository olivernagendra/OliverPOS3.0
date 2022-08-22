import React, {  useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import AngledBracket_Left_Blue from '../../images/svg/AngledBracket-Left-Blue.svg'
import AngledBracket_Right_Grey from '../../images/svg/AngledBracket-Right-Grey.svg'
import Register_Icon_White from '../../images/svg/Register-Icon-White.svg'
import Kiosk_Icon_White from '../../images/svg/Kiosk-Icon-White.svg'

import STATUSES from "../../constants/apiStatus";
import { register } from "./registerSlice";
import { useNavigate } from 'react-router-dom';
import { get_UDid } from "../common/localSettings";
const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    var registers = [];
    var self_registers = [];
    const { status, data, error, is_success } = useSelector((state) => state.register)
    // console.log("status", status, "data", data, "error", error, "is_success", is_success)

    if (status == STATUSES.error) {
        console.log(error)
    }
    if (status == STATUSES.IDLE && is_success) {
        registers = data && data.content && data.content.filter(a => a.IsSelfCheckout == false);
        self_registers = data && data.content && data.content.filter(a => a.IsSelfCheckout == true);

    }

    useEffect(() => {
        var loc_id = localStorage.getItem('Location');
        dispatch(register({ "id": loc_id }));
    }, []);

    const handleSubmit = (item) => {
        // if (item.id) {
            var arry = [];
        arry.push(item)
        localStorage.setItem('pdf_format', JSON.stringify(arry))
        localStorage.setItem('register', item.id);
        localStorage.setItem('registerName', item.name);
        var getudid = get_UDid('UDID');
        localStorage.setItem(`last_login_register_id_${getudid}`, item.id);
        localStorage.setItem(`last_login_register_name_${getudid}`, item.name);
        localStorage.setItem('selectedRegister',JSON.stringify(item))
            navigate('/pin')
        // }
    }
    return (
        <React.Fragment>
            <div className="choose-wrapper">
                <div className="choose-header">
                    <button id="backButton" onClick={() => window.location = "/location"} >
                        <img src={AngledBracket_Left_Blue} alt="" />
                        Back
                    </button>
                    <p>{localStorage.getItem('user_full_name') +" - "+localStorage.getItem('LocationName')}</p>
                </div>
                <div className="choose-body-default">
                    <p>Choose Register/Device</p>
                    <div className="divider"></div>
                    <div className="button-container">
                        <p>Registers</p>
                        <div className="divider"></div>
                        <div className="button-group col">
                            {registers.map((item, index) => {
                                return <button className="option" onClick={()=>handleSubmit(item)}>
                                    <div className="img-container background-blue">
                                        <img src={Register_Icon_White} alt="" className="register-icon" />
                                    </div>
                                    <div className="col">
                                        <p className="style1">{item.name}</p>
                                        <p className="style2">Available</p>
                                    </div>
                                    <img src={AngledBracket_Right_Grey} alt="" />
                                    <div className="fake-button background-blue">Select</div>
                                </button>

                            })}
                          
                        </div>
                        <p>Kiosks</p>
                        <div className="divider"></div>
                        <div className="button-group">
                            {self_registers.map((item, index) => {
                                return <button className="option" onClick={()=>handleSubmit(item)}>
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
                        <button className="close-subwindow">
                            <img src="../Assets/Images/SVG/X-Icon-DarkBlue.svg" alt="" />
                        </button>
                    </div>
                    <div className="subwindow-body">
                        <div className="auto-margin-top"></div>
                        <p>
                            Are you sure you <br />
                            want to take over <b>Register 1</b>? <br /><br />
                            This action will kick out the current user.
                        </p>
                        <button id="takeoverRegister">Take Over</button>
                        <button id="cancelTakeover">Cancel</button>
                        <div className="auto-margin-bottom"></div>
                    </div>
                </div>
            </div>
        </React.Fragment>)
}
export default Register