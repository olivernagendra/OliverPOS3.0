import React, { useState, useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';

import NotificationsSounds from '../../images/svg/NotificationsSounds.svg';
import Approval_Icon from '../../images/svg/Approval-Icon.svg';
import VolumeIcon from '../../images/svg/VolumeIcon.svg';
import Changelog_Icon from '../../images/svg/Changelog-Icon.svg';
import Info_Icon from '../../images/svg/Info-Icon.svg';
import Error_Icon from '../../images/svg/Error-Icon.svg';
import ActiveUser from '../../settings/ActiveUser';
const Notifications = (props) => {
    const [isSoundNotification, setisSoundNotification] = useState(false);
    const [notificationList, setNotificationList] = useState([]);
    const toggleiSoundNotification = () => {
        setisSoundNotification(!isSoundNotification)
    }
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "notifications-wrapper") {
            props.toggleNotifications();
        }
    }
    const prepareNotificationList = async () => {
        //const { NotificationFilters } = this.props;
        var temp_Order = 'TempOrders_' + (ActiveUser.key.Email);
        var TempOrders = localStorage.getItem(temp_Order) ? JSON.parse(localStorage.getItem(temp_Order)) : [];  //JSON.stringify
        var notificationlist = [];

        TempOrders && TempOrders.map(list => {
            if (list.new_customer_email !== "") {
                var tempVar = TempOrders.find(l => l.TempOrderID == list.TempOrderID && l.new_customer_email == "")
                if (tempVar) {
                    list.order_status = tempVar.order_status
                    list.OrderID = tempVar.OrderID
                }
            }
        })
        TempOrders && TempOrders.map(list => {
            var description = "";
            //order completed
            if (list.Status == "true" && list.order_status == "completed") {
                description = ((<div className="notification approval">
                    <div className="side-color"></div>
                    <div className="main-row">
                        <img src={Approval_Icon} alt="" />
                        <p>Order# {list.TempOrderID}</p>
                    </div>
                </div>))
            }
            else //order refunded successfully
                if (list.Status == "true" && list.order_status === "refunded") {
                    description = ((<div className="notification info">
                        <div className="side-color"></div>
                        <div className="main-row">
                            <img src={Info_Icon} alt="" />
                            <p>Order# {list.TempOrderID}</p>
                        </div>
                    </div>))
                }
                else //sync issue
                    if (list.Status == "failed" && list.order_status == "completed") {
                        description = ((<div className="notification error">
                            <div className="side-color"></div>
                            <div className="main-row">
                                <img src={Approval_Icon} alt="" />
                                <p>Order# {list.TempOrderID}</p>
                            </div>
                        </div>))
                    }
                    else
                        if (list.Sync_Count > 1 && list.order_status == "completed" && list.new_customer_email !== "" && list.isCustomerEmail_send == false) {
                            description = ((<div className="notification approval">
                                <div className="side-color"></div>
                                <div className="main-row">
                                    <img src={Approval_Icon} alt="" />
                                    <p>Order# {list.TempOrderID}</p>
                                </div>
                            </div>))
                        }

            var TempOrderID = list.TempOrderID
            var time = list.Status == "true" ? list.date : list.date;
            var title = "";

            // var title = // TO SEND EMAIL TO NEW ADDED CUSTOMER 
            //     list.Sync_Count > 1 && list.order_status == "completed" && list.new_customer_email !== "" && list.isCustomerEmail_send == false ? "EMAIL SENDING FAILED TO CUSTOMER"
            //         : list.order_status == "completed" && list.new_customer_email !== "" && list.isCustomerEmail_send == false ? "EMAIL SENDING TO CUSTOMER"
            //             : list.order_status == "completed" && list.new_customer_email !== "" && list.isCustomerEmail_send == true ? "EMAIL SENT TO CUSTOMER"
            //                 //title for  new order sync failed
            //                 : list.Status == "failed" && list.order_status == "completed" ? "NEW ORDER (#" + TempOrderID + ") SYNC ISSUE"
            //                     //NEW ORDER CREATED
            //                     : list.Status == "true" && list.order_status == "completed" ? "NEW ORDER CREATED IN WP"
            //                         //REFUND
            //                         : list.Status == "true" && list.order_status == "refunded" ? "ORDER REFUNDED  IN WP"
            //                             : "CREATING ORDER IN WP"

            // var description =  //dec for email send
            //     list.Sync_Count > 1 && list.order_status == "completed" && list.new_customer_email !== "" && list.isCustomerEmail_send == false ? "There was an issue to send email to customer for order#" + list.TempOrderID + ""
            //         : list.order_status == "completed" && list.new_customer_email !== "" && list.isCustomerEmail_send == false ? "Sending email to customer for order#" + list.TempOrderID + ""
            //             : list.order_status == "completed" && list.new_customer_email !== "" && list.isCustomerEmail_send == true ? "Email sent succeessfully to customer for order#" + list.TempOrderID + ""
            //                 //dec for order syc failed
            //                 : list.Status == "failed" && list.order_status == "completed" ? "There was an issue syncing over please check your connection an try again later"
            //                     // desc for order sync completed 
            //                     : list.Status == "true" && list.order_status == "completed" ? "We Are Happy To Inform You That Oliver POS Has Just Created Order #" + list.TempOrderID + " For You."
            //                         // desc for refund
            //                         : list.Status == "true" && list.order_status == "refunded" ? "order  Refunded  successfully." : "Hang on tight for just a bit longer we are pushing the order to your webshop."
            var status = list.Status
            var Index = list.Index
            var OrderID = list.OrderID
            // if (status == 'true' && OrderID) {
            //     this.setState({ isSyncStart: true })
            // }

            var _order = {
                "time": time,
                "title": title,
                "description": description,
                "status": status,
                "Index": Index,
                "OrderID": OrderID,
                "TempOrderID": TempOrderID,
                "new_customer_email": list.new_customer_email,
                "isCustomerEmail_send": list.isCustomerEmail_send,
                "Sync_Count": list.Sync_Count
            }
            notificationlist.push(_order);
        })
        // console.log("notifyList", notificationlist);
        localStorage.setItem('notifyList', JSON.stringify(notificationlist))
        setNotificationList(notificationlist)
        //this.setState({ notifyList: localStorage.getItem('notifyList') ? JSON.parse(localStorage.getItem('notifyList')) : [] })
        //NotificationFilters && NotificationFilters(this.state.notifyList)
    }

    useEffect(() => {
        prepareNotificationList();
    }, []);
    return (
        <div id="notificationsWrapper" className={props.isShow === true ? "notifications-wrapper" : "notifications-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div id="notificationsContent" className="notifications">
                <div id="soundNotificationsWrapper" className={isSoundNotification === true ? "sound-notifications-wrapper" : "sound-notifications-wrapper hidden"}>
                    <div className="sound-notifications">
                        <div className="header">
                            <img src={VolumeIcon} alt="" />
                            <p>Sound Notifications</p>
                        </div>
                        <div className="body">
                            <p>Sound Options</p>
                            <div className="row">
                                <p>POS Order</p>
                                <label className="toggle-wrapper">
                                    <input type="checkbox" id="posOrder" />
                                    <div className="custom-toggle">
                                        <div className="knob"></div>
                                    </div>
                                </label>
                            </div>
                            <div className="row">
                                <p>Web Order</p>
                                <label className="toggle-wrapper">
                                    <input type="checkbox" id="webOrder" />
                                    <div className="custom-toggle">
                                        <div className="knob"></div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="header">
                    <p>Notifications</p>
                    <div className="dropdown-options"></div>
                    <button id="notiSoundOptions" onClick={() => toggleiSoundNotification()}>
                        <img src={NotificationsSounds} alt="" />
                    </button>
                    <button id="mobileNotiExit" onClick={() => props.toggleNotifications()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="body">
                    <p>Today</p>
                    {
                        notificationList && notificationList.map(a => {
                            return a.description
                        })
                    }
                    {/* <div className="notification approval">
                        <div className="side-color"></div>
                        <div className="main-row">
                            <img src={Approval_Icon} alt="" />
                            <p>Order# 123890083 Created</p>
                        </div>
                    </div>
                    <div className="notification approval">
                        <div className="side-color"></div>
                        <div className="main-row">
                            <img src={Approval_Icon} alt="" />
                            <p>Order# 123890082 Created</p>
                        </div>
                    </div>
                    <div className="notification approval">
                        <div className="side-color"></div>
                        <div className="main-row">
                            <img src={Approval_Icon} alt="" />
                            <p>Order# 123890081 Created</p>
                        </div>
                    </div>
                    <div className="notification error">
                        <div className="side-color"></div>
                        <div className="main-row">
                            <img src={Error_Icon} alt="" />
                            <p>Order# 123890081 not synced</p>
                        </div>
                        <a href="#">Retry</a>
                    </div> */}
                    {/* <p>15/02/2022</p> */}
                    {/* <div className="notification info">
                        <div className="side-color"></div>
                        <div className="main-row">
                            <img src={Info_Icon} alt="" />
                            <p>Website Order #4654896</p>
                        </div>
                    </div>
                    <div className="notification changelog">
                        <div className="side-color"></div>
                        <div className="main-row">
                            <img src={Changelog_Icon} alt="" />
                            <p>Change Log</p>
                        </div>
                        <p>Bug Fixes:</p>
                        <ul>
                            <li>ashd</li>
                            <li>asjdoiasjd</li>
                            <li>sadjklas</li>
                        </ul>
                        <p>Feature Updates:</p>
                        <ul>
                            <li>ashd</li>
                            <li>asjdoiasjd</li>
                            <li>sadjklas</li>
                        </ul>
                    </div> */}
                </div>
            </div>
        </div>)
}

export default Notifications 