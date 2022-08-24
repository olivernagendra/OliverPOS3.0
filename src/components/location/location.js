import React, {  useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import AngledBracket_Left_Blue from '../../images/svg/AngledBracket-Left-Blue.svg'
import AngledBracket_Right_Grey from '../../images/svg/AngledBracket-Right-Grey.svg'
import Store_Icon_White from '../../images/svg/Store-Icon-White.svg'
import { location } from './locationSlice';
import { get_UDid } from '../common/localSettings';
import STATUSES from "../../constants/apiStatus";
import { useNavigate } from 'react-router-dom';
const Location = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    var decodedString = localStorage.getItem('UDID');
    var decod = decodedString ? atob(decodedString) : '';
    var UDID = decod;
    var userId = localStorage.getItem('userId') ? localStorage.getItem('userId') : 0;

    const { status, data, error, is_success } = useSelector((state) => state.location)
    // console.log("status", status, "data", data, "error", error, "is_success", is_success)

    if (status == STATUSES.error) {
        console.log(error)
    }
    if (status == STATUSES.IDLE && is_success) {
        // console.log("data----->" + data)
    }
    useEffect(() => {
        dispatch(location({ "udid": UDID, "userId": userId }));

    }, []);

    const handleSubmit = (item) => {
        localStorage.setItem('Location', item.id);
        localStorage.setItem('LocationName', item.name);
        var getudid = get_UDid('UDID');
        localStorage.setItem(`last_login_location_id_${getudid}`, item.id);
        localStorage.setItem(`last_login_location_name_${getudid}`, item.name);
        localStorage.setItem('WarehouseId', item.warehouse_id);
        if (item.id) {
            navigate('/register')
        }
    }
    if (status == STATUSES.LOADING) {
        return <div> Loading... </div>
    }
    return <div className="choose-wrapper">
        <div className="choose-header">
            <button id="backButton" onClick={() => window.location = "/site"}>
                <img src={AngledBracket_Left_Blue} alt="" />
                Back
            </button>
            <p>{localStorage.getItem('user_full_name')?localStorage.getItem('user_full_name'):''}</p>
        </div>
        <div className="choose-body-default">
            <p>Choose Location</p>
            <div className="divider"></div>
            <div className="button-container">

                {data !== null && data.content !== undefined &&
                    data.content.map((item, index) => {
                        return (

                            <button key={index} className="option" onClick={() => handleSubmit(item)}>
                                <div className="img-container background-blue">
                                    <img src={Store_Icon_White} alt="" className="store-icon" />
                                </div>
                                <div className="col">
                                    <p className="style1">{item.name}</p>
                                </div>
                                <img src={AngledBracket_Right_Grey} alt="" />
                                <div className="fake-button background-blue">Select</div>
                            </button>
                        )
                    })}
                {/* <button className="option">
                    <div className="img-container background-blue">
                        <img src={Store_Icon_White} alt="" className="store-icon" />
                    </div>
                    <div className="col">
                        <p className="style1">139 Water Street</p>
                    </div>
                    <img src={AngledBracket_Right_Grey} alt="" />
                    <div className="fake-button background-blue">Select</div>
                </button>
                <button className="option">
                    <div className="img-container background-blue">
                        <img src={Store_Icon_White} alt="" className="store-icon" />
                    </div>
                    <div className="col">
                        <p className="style1">75 Moncston Rd.</p>
                    </div>
                    <img src={AngledBracket_Right_Grey} alt="" />
                    <div className="fake-button background-blue">Select</div>
                </button>
                <button className="option">
                    <div className="img-container background-blue">
                        <img src={Store_Icon_White} alt="" className="store-icon" />
                    </div>
                    <div className="col">
                        <p className="style1">Pop-up Location</p>
                    </div>
                    <img src={AngledBracket_Right_Grey} alt="" />
                    <div className="fake-button background-blue">Select</div>
                </button> */}
            </div>
        </div>
    </div>
}
export default Location