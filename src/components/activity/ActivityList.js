import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import FilterArrowDown from '../../assets/images/svg/FilterArrowDown.svg'
import FilterArrowUp from '../../assets/images/svg/FilterArrowUp.svg'
import InStoreSale from '../../assets/images/svg/InStoreSale.svg'
//import OnlineSale from '../../assets/images/SVG/OnlineSale.svg'
import moment from 'moment';
import Config from '../../Config'
import { FormateDateAndTime } from '../../settings/FormateDateAndTime';
import { LoadingSmallModal } from "../common/commonComponents/LoadingSmallModal";
const ActivityList = (props) => {
    const [isSortWrapper, setSortWrapper] = useState(false)
    const [SelectedTypes, setSelectedTypes] = useState('')
    const [AllActivityList, setAllActivityList] = useState([])

    var current_date = moment().format(Config.key.DATE_FORMAT);
    var customer_to_OrderId = (typeof localStorage.getItem("CUSTOMER_TO_OrderId") !== 'undefined' && localStorage.getItem("CUSTOMER_TO_OrderId") !== null) ? localStorage.getItem("CUSTOMER_TO_OrderId") : '';
    var id = `activity-order-${customer_to_OrderId}`
    var elmnt = document.getElementById(`${id}`);
    var ordersDate = new Array();
    var orders = props.orders;
    var custId = localStorage.getItem("CUSTOMER_TO_ACTVITY") !== 'undefined' && localStorage.getItem("CUSTOMER_TO_ACTVITY") !== null ? localStorage.getItem("CUSTOMER_TO_ACTVITY") : ""
    var ids = `activity-order-${custId}`
    var elmnts = document.getElementById(`${ids}`);

    if (typeof props.orders !== 'undefined') {
        for (const key in orders) {
            if (orders.hasOwnProperty(key)) {
                ordersDate.push(key)
            }
        }
        if (ordersDate.length > 0) {
            ordersDate.sort(function (a, b) {
                var keyA = new Date(a),
                    keyB = new Date(b);
                // Compare the 2 dates
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });
            ordersDate.reverse();
        }
    }


  
     

    return (
            <div className="body">
                {((!ordersDate) || ordersDate.length == 0) ?
                <LoadingSmallModal />
                    :
                    orders && ordersDate && ordersDate.map((getDate, index) => {
                        return (
                            <>
                                <div className="filter-name" key={"orderDatedv"+index}>
                                    <p key={"date" + index}> {current_date == getDate ? 'Today' : getDate}</p>
                                </div>
                                {
                                    getDate && orders && orders[getDate] && orders[getDate].map((order, index) => {
                                        var time = FormateDateAndTime.formatDateWithTime(order.date_time, order.time_zone);
                                        return (
                                            <button className="transaction-card no-transform selected" onClick={() => props.click(order, order.order_id)}>
                                                <div className="col">
                                                    <p className="style1">Order# {order.order_id}</p>
                                                    <p className="style2">{order.CustFullName}</p>
                                                    <div className="row">
                                                    {
                                                        (order.refunded_amount > 0) ? <img src={InStoreSale} alt="" /> :<img src={InStoreSale} alt="" />

                                                    }
                                                        <p>{order.order_status}</p>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    {
                                                        (order.refunded_amount > 0) ?
                                                        <p className="style3"> {parseFloat(order.total - order.refunded_amount) } 
                                                         &nbsp;<del>{parseFloat(order.total)}</del> 
                                                         </p>
                                                         : 
                                                         <p className="style3"> {parseFloat(order.total)}</p>
                                                    }
                                                    <p className="style4">{order.time}</p>
                                                </div>
                                                {props.updateActivityId == order.order_id ? <div className="selected-indicator"></div> :'' }
                                            </button>
                                        )
                                    })
                                }
                            </>
                        )
                    })

                }
            </div>
    )
}

export default ActivityList