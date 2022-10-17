import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import STATUSES from "../../constants/apiStatus";
import { FormateDateAndTime } from '../../settings/FormateDateAndTime';
const ActivityOrderDetail = () => {
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
    return (<>
        <div className="quick-info">
            <div className="col">
                <p className="style1">Order #{activityOrderDetails.order_id}</p>
                <p className="style2">Total: <b>{
                    (activityOrderDetails.refunded_amount > 0) ? <div>{(activityOrderDetails.total_amount - activityOrderDetails.refunded_amount)} <del>{activityOrderDetails.total_amount}</del></div> : activityOrderDetails.total_amount
                }</b></p>
                <p className="style3" >
                    {
                        gmtDateTime !== '' ? gmtDateTime : "Not Found"
                    }
                </p>

            </div>
            <div className="col right">
                <div className="row">
                    <img src="../assets/images/svg/OnlineSale.svg" alt="" />
                    <p>{activityOrderDetails.order_status}</p>
                </div>
                <p className="style2">Served by: <b>{activityOrderDetails.ServedBy}</b></p>
                <p className="style3">12:35pm</p>
            </div>
        </div>
        <div className="customer-info">
            <div className="col">
                <p className="style1">{Customerdata && Customerdata.customer_address ? Customerdata.customer_address : ''}</p>
                <p className="style2">{Customerdata && Customerdata.customer_city ? Customerdata.customer_city : ''}</p>
                <p className="style2">{Customerdata && Customerdata.customer_email ? Customerdata.customer_email : ''}</p>
                <p className="style2">{Customerdata && Customerdata.customer_phone ? Customerdata.customer_phone : ''}</p>
            </div>
            {activityOrderDetails.orderCustomerInfo !== '' && activityOrderDetails.orderCustomerInfo !== null ? <button>Open Customer</button> : ""}
        </div>
    </>
    )
}

export default ActivityOrderDetail