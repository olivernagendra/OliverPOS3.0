import React, { useState } from "react"
import { useDispatch, useSelector } from 'react-redux';
import {chunkArray} from '../common/localSettings'
import imgOpenReg from '../../images/svg/OpenSign-BaseBluesvg.svg'
import imgBackSpace from '../../images/svg/Backspace-BaseBlue.svg'

import {validatePin} from "./pinSlice"
import { useNavigate } from "react-router-dom";
import { get_UDid } from "../common/localSettings"; 
import STATUSES from "../../constants/apiStatus";
import moment from 'moment';
const Pin=()=>{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalSize,setTotalSize]=useState(0)
    const [txtValue,setTxtValue]=useState("")
    const [isloading,setIsloading]=useState(false)
    const { status, data, error, is_success } = useSelector((state) => state.pin)
    if (status === STATUSES.error) {
        console.log(error)
    }
    if (status === STATUSES.IDLE && is_success) {       
       localStorage.setItem('user', JSON.stringify(data.content));
       if (typeof (Storage) !== "undefined") {
           localStorage.setItem("check_subscription_status_datetime", new Date());
       }

        if (localStorage.getItem("PRODUCT_REFRESH_DATE") == null) {
            localStorage.setItem("PRODUCT_REFRESH_DATE", moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss'))
          }

          var _lang = localStorage.getItem("LANG");

          var user = JSON.parse(localStorage.getItem("user"))
          var lang = user && user.language ? user.language : 'en';
          localStorage.setItem("LANG", lang);

          //Reloading the component if new language set for the login user.                  
          if (_lang && _lang !== lang) {
           // window.location = '/';
          }
          navigate('/prodcutloader')

    }

   
    const  pinNumberList= ["1", "2", "3", "4", "5", "6", "7", "8", "9", " ", "0", "c"];
    const trshPin= ['txt1', 'txt2', 'txt3', 'txt4']
    
const NumInput = props =>
    chunkArray(props.numbers, 3).map((num, index) => (
        <div key={index} className="pin-button-row">
            {num.map((nm, i) => {
                if(nm==" "){ return}
                return (
                     <button key={"input" + i} type="button" id={props.id} 
                     onClick={() => { addToScreen(nm) }} 
                     className={nm === 'c'?"backspace":""}> 
                             {nm === 'c' ? <img src={imgBackSpace}/> : nm} 
                     </button>
                )        
                        
            })
            
            }
            </div>
    ))

    // display dot pin
const TrashPin = () =>
    trshPin.map((pinId, ind) => {
        console.log("totalSize",totalSize)
        return (

            <div key = {ind} className={"pin-entry " +(totalSize >= ind+1 && "entered" )}></div>
            // <li key = {ind}>
            //     <input style={props.style} key={ind} id={pinId} type={props.type} className={props.className} />
            // </li>
        )
    })
// show entered number for create pin
const ShowCreatePin = props =>
    props.trshPin.map((pinId, ind) => {
        return (
            <li key ={ind}>
                {/* <input style={props.style} key={ind} id={pinId} type={props.type} classNameNameName={props.classNameNameName} /> */}
                <input type="number" key={ind + 1} id={pinId + 1} className={props.className} />
                {/*type={props.type}  className="if-show-only" */}
            </li>
        )
    })
  const  addToScreen=(inputNo) =>{
     if(inputNo === " ") {return} 
        //var lenght_is = e.length - 1
        //var newString = inputNo;//e[lenght_is];
        if (inputNo === "c") {
            if (totalSize > 0) {
               // this.resetScreen();
            } else {
                 setTotalSize(0);
                setTxtValue('');
            }
            return;
        }
        if (totalSize < 4) {
            var value= txtValue+ inputNo
            var size=totalSize+ 1
            setTxtValue(value);
            setTotalSize(size );
            console.log(txtValue, totalSize)
           // setTimeout(function () {
                fillPass(value);
           // }.bind(this), 100)
        }
      
        // $('#whichkey').focus()
        var _envType = localStorage.getItem('env_type');
        if (_envType && _envType !== "") {
           // $('#whichkey').attr('readonly', true);
        } else {
            //$('#whichkey').focus();
        }
    }
   const fillPass=(enteredPin)=> {
        // var i = 1;
        // for (i = 1; i <= 4; i++) {
        //     if (enteredPin.length >= i) {
                if (enteredPin.length >= 4) {
                    //const { dispatch } = this.props;
                    if (isloading === false) {
                        setIsloading(true)
                        localStorage.removeItem('logoutclick'); //For webview            
                        setTimeout(function () {    //Need delay for reaset text
                            var userID = "";

                            if (localStorage.getItem("userId")) {
                                userID = localStorage.getItem("userId");
                            } else {
                                userID = localStorage.getItem('clientDetail') ? JSON.parse(localStorage.getItem('clientDetail')).user_id : "";
                                localStorage.setItem("userId", userID)
                            }
                            //     else if(localStorage.getItem('sitelist'))
                            //     {              
                            //         var decodedString =localStorage.getItem('sitelist') ;     
                            //     var decod = window.atob(decodedString);
                            //    // console.log("decodedString",decod);
                            //     var divicedata=JSON.parse(decod);
                            //    // console.log("userid",divicedata[0].userId);
                            //      userID=divicedata[0].userId;

                            //     }
                            // console.log("UserID",userID);
                            if (enteredPin !== null && enteredPin !== '' && userID && userID !== '') {
                                // var hasPin = localStorage.getItem('clientDetail') && JSON.parse(localStorage.getItem('clientDetail')).HasPin
                                //this.setState({ creatPinTxt: txtValue })
                                var hasPin = localStorage.getItem('hasPin')
                                console.log(typeof (enteredPin));
                                if (hasPin !== 'false') {
                                   dispatch(validatePin({"pin":enteredPin,"userid": userID,"UDID":get_UDid('UDID')}));
                                } else {
                                   //dispatch(validatePin.createPin(txtValue, userID));
                                }
                            }

                            setTxtValue("");
                            setTotalSize (0);
                        }, 100)
                    }
                }
            //     if (totalSize == i) {
            //         var val = txtValue.charAt(totalSize - 1)
            //        // $("#txt" + i + '1').val(val);
            //     }
            //     //$("#txt" + i).removeClass("bg_trasn");
            // } else {
            //    // $("#txt" + i + '1').val('');
            //     //$("#txt" + i).addClass("bg_trasn");
            // }
      //  }
    }


    return <div className="idle-register-wrapper">
    <header>
        <img src={imgOpenReg} alt="" />
        <div className="col">
            <p className="style1">Sushi Sun</p>
            <div className="divider"></div>
            <p className="style2">Register 1</p>
            <p className="style3">Water St. Location</p>
            <button id="closeRegister1">Close Register</button>
        </div>
    </header>
    <main>
        <p>Enter Your User ID</p>
        <div className="pinpad">
            <div className="pin-entries">
                <TrashPin />
                {/* <div className="pin-entry"></div>
                <div className="pin-entry"></div>
                <div className="pin-entry"></div>
                <div className="pin-entry"></div> */}
                {/* <div className="pin-entry"></div>
                <div className="pin-entry"></div> */}
            </div>
            <NumInput id="keyss" type="button" numbers={pinNumberList} onClick={addToScreen} readOnly={false} classNameNameName2="fill-dotted-clear" />
            {/* <div className="pin-button-row">
                <button>1</button>
                <button>2</button>
                <button>3</button>
            </div>
            <div className="pin-button-row">
                <button>4</button>
                <button>5</button>
                <button>6</button>
            </div>
            <div className="pin-button-row">
                <button>7</button>
                <button>8</button>
                <button>9</button>
            </div>
            <div className="pin-button-row">
                <button>0</button>
                <button className="backspace">
                    <img src="../Assets/Images/SVG/Backspace-BaseBlue.svg" alt="" />
                </button>
            </div> */}
        </div>
        <button id="closeRegister2">Close Register</button>
    </main>
</div>
}

export default Pin