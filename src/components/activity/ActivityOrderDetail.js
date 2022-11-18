import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import STATUSES from "../../constants/apiStatus";
import { FormateDateAndTime } from '../../settings/FormateDateAndTime';
import OnlineSale from '../../assets/images/svg/OnlineSale.svg'
import InStoreSale from '../../assets/images/svg/InStoreSale.svg'
const ActivityOrderDetail = () => {

    const navigate = useNavigate()

    const [activityOrderDetails, setActivityOrderDetails] = useState([])

    // Getting Response from activitygetDetail Api
    const [activitygetdetails] = useSelector((state) => [state.activityGetDetail])
    useEffect(() => {
        if (activitygetdetails && activitygetdetails.status == STATUSES.IDLE && activitygetdetails.is_success && activitygetdetails.data) {
            setActivityOrderDetails(activitygetdetails.data.content);

        }
    }, [activitygetdetails]);
    //console.log("activityOrderDetails", activityOrderDetails)

    var DateTime = activityOrderDetails
    var gmtDateTime = "";
    if (DateTime && DateTime.OrderDateTime && DateTime.time_zone) {
        gmtDateTime = FormateDateAndTime.formatDateAndTime(DateTime.OrderDateTime, DateTime.time_zone)
    }
    var Customerdata = activityOrderDetails && activityOrderDetails.orderCustomerInfo ? activityOrderDetails.orderCustomerInfo : ''

    const OpenCustomer = (data) => {
        // console.log("data",data)
        if (data.orderCustomerInfo.customer_email !== '') {
            sessionStorage.setItem("customerredirect", data.orderCustomerInfo.customer_email ? data.orderCustomerInfo.customer_email : "");
            navigate('/customers')
        }
    }




    return (<>
       





        {/* <div className="quick-info">
            <div className="row">
                <div className="group">
                    <img src={activityOrderDetails != "" && activityOrderDetails.OliverReciptId !== '' ? InStoreSale : OnlineSale} alt="" />
                    <p>Order #{activityOrderDetails && activityOrderDetails.order_id}</p>
                </div>
                <p className="style1">{activityOrderDetails.order_status}</p>
            </div>
            <div className="row">
                <p className="style2">Served by: {activityOrderDetails.ServedBy}</p>
                <p className="style2">July 19, 2022 &nbsp; 12:35PM</p>
            </div>
            <div className="row">
                <p className="style3">
                    Total: <b>{
                        (activityOrderDetails && activityOrderDetails.refunded_amount > 0) ? <div>{parseFloat(activityOrderDetails.total_amount - activityOrderDetails.refunded_amount).toFixed(2)} <del>{parseFloat(activityOrderDetails && activityOrderDetails.total_amount).toFixed(2)}</del></div> : parseFloat(activityOrderDetails && activityOrderDetails.total_amount).toFixed(2)
                    }</b>
                </p>
            </div>
        </div>
        <div className="scrollable">
            <div className="customer-info">
                <div className="col">
                    <p className="style1">Customer Information</p>
                    <p className="style2">{Customerdata && Customerdata.customer_name ? Customerdata.customer_name : Customerdata && Customerdata.customer_first_name}</p>
                    <p className="style2">{Customerdata && Customerdata.customer_email ? Customerdata.customer_email : ''}</p>
                    <p className="style2">{Customerdata && Customerdata.customer_phone ? Customerdata.customer_phone : ''}</p>
                </div>
                {activityOrderDetails.orderCustomerInfo !== '' && activityOrderDetails.orderCustomerInfo !== null ? <button id="openCustomerButton" onClick={() => OpenCustomer(activityOrderDetails)}>Open Customer</button> : ""}
            </div>

        </div> */}
    </>
    )
}

export default ActivityOrderDetail