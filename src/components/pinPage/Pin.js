import React, { useState } from "react"
// import { useDispatch, useSelector } from 'react-redux';
import { get_locName, get_regName} from '../common/localSettings'
import imgOpenReg from '../../images/svg/OpenSign-BaseBluesvg.svg'
// import imgBackSpace from '../../images/svg/Backspace-BaseBlue.svg'

// import {createPin, validatePin} from "./pinSlice"
// import { useNavigate } from "react-router-dom";
// import { get_UDid } from "../common/localSettings"; 
// import STATUSES from "../../constants/apiStatus";
// import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import PinPad from "../PinPad";

const Pin=()=>{
//     const dispatch = useDispatch();
    const navigate = useNavigate();
//     const [totalSize,setTotalSize]=useState(0)
//     const [txtValue,setTxtValue]=useState("")
//     const [isloading,setIsloading]=useState(false)
//     const { status, data, error, is_success } = useSelector((state) => state.pin)
//     var hasPin = localStorage.getItem('hasPin')
//     if (status === STATUSES.error) {
//         console.log(error)
//     }
//     if (status === STATUSES.IDLE && is_success) {       
//        localStorage.setItem('user', JSON.stringify(data.content));
//        if (typeof (Storage) !== "undefined") {
//            localStorage.setItem("check_subscription_status_datetime", new Date());
//        }

//         if (localStorage.getItem("PRODUCT_REFRESH_DATE") == null) {
//             localStorage.setItem("PRODUCT_REFRESH_DATE", moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss'))
//           }

//           var _lang = localStorage.getItem("LANG");

//           var user = JSON.parse(localStorage.getItem("user"))
//           var lang = user && user.language ? user.language : 'en';
//           localStorage.setItem("LANG", lang);

//           //Reloading the component if new language set for the login user.                  
//           if (_lang && _lang !== lang) {
//            // window.location = '/';
//           }
          

          navigate('/home')

//     }

   
//     const  pinNumberList= ["1", "2", "3", "4", "5", "6", "7", "8", "9", " ", "0", "c"];
//     const trshPin= ['txt1', 'txt2', 'txt3', 'txt4']
    
// const NumInput = props =>
//     chunkArray(props.numbers, 3).map((num, index) => (
//         <div key={index} className="pin-button-row">
//             {num.map((nm, i) => {
//                 if(nm===" "){ return ""}
//                 return (
//                      <button key={"input" + i} type="button" id={props.id} 
//                      onClick={() => { addToScreen(nm) }} 
//                      className={nm === 'c'?"backspace":""}> 
//                              {nm === 'c' ? <img src={imgBackSpace}/> : nm} 
//                      </button>
//                 )        
                        
//             })
            
//             }
//             </div>
//     ))

//     // display dot pin
// const TrashPin = () =>
//     trshPin.map((pinId, ind) => {
//        // console.log("totalSize",totalSize)
//         return (
//             <div key = {ind} className={"pin-entry " +(totalSize >= ind+1 && "entered" )}></div>
           
//         )
//     })
// // show entered number for create pin
// const ShowCreatePin = props =>
//     trshPin.map((pinId, ind) => {
//         return (
//                   <input key ={ind} type="number" id={pinId + 1} onChange={(e)=>handle(e)}  /> 
//                 //   className={props.className}
//         )
//     })
//    const resetScreen=()=> {
//         var str =txtValue;
//         if (totalSize > 0) {
//             setTotalSize(totalSize-1);
//             setTxtValue(str.substring(0, str.length - 1));
//         } else {
//             setTotalSize(0);
//             setTxtValue("");
//         }
//         fillPass();
//     }
//   const  addToScreen=(inputNo) =>{
//      if(inputNo === " ") {return} 
//         //var lenght_is = e.length - 1
//         //var newString = inputNo;//e[lenght_is];
//         if (inputNo === "c") {
//             if (totalSize > 0) {
//                resetScreen();
//             } else {
//                  setTotalSize(0);
//                 setTxtValue('');
//             }
//             return;
//         }
//         if (totalSize < 4) {
//             var value= txtValue+ inputNo
//             var size=totalSize+ 1
//             setTxtValue(value);
//             setTotalSize(size );
//             console.log(value, size)
//             setTimeout(() => {
//                 fillPass(value);
//             }, 100);
          
//         }
      
//         // $('#whichkey').focus()
//         var _envType = localStorage.getItem('env_type');
//         if (_envType && _envType !== "") {
//            // $('#whichkey').attr('readonly', true);
//         } else {
//             //$('#whichkey').focus();
//         }
//     }
//    const fillPass=(enteredPin)=> {
        
//                 if (enteredPin.length >= 4) {
//                     //const { dispatch } = this.props;
//                     if (isloading === false) {
//                         setIsloading(true)
//                         localStorage.removeItem('logoutclick'); //For webview            
//                         setTimeout(function () {    //Need delay for reaset text
//                             var userID = "";

//                             if (localStorage.getItem("userId")) {
//                                 userID = localStorage.getItem("userId");
//                             } else {
//                                 userID = localStorage.getItem('clientDetail') ? JSON.parse(localStorage.getItem('clientDetail')).user_id : "";
//                                 localStorage.setItem("userId", userID)
//                             }
                            
//                             if (enteredPin !== null && enteredPin !== '' && userID && userID !== '') {
                                
                              
//                                 console.log(typeof (enteredPin) ,enteredPin,txtValue,);
//                                 if (hasPin !== 'false') {
//                                    dispatch(validatePin({"pin":enteredPin,"userid": userID,"UDID":get_UDid('UDID')}));
//                                 } else {
//                                    dispatch(createPin({"pin":enteredPin, "id":userID}));
//                                 }
//                             }

//                             setTxtValue("");
//                             setTotalSize (0);
//                         }, 100)
//                     }
//                 }
           
//     }

//    const handle=(e) =>{
//         const { value } = e.target;
//         const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
//         if (value === '' || re.test(value)) {
//             addToScreen(value)
//         }
//     }

//    const handleBack=(e)=> {
//         if (e.keyCode == 76 && e.ctrlKey) {
//             this.log_out()
//         }
//         if (e.keyCode == 86 && e.ctrlKey) {
//             //$('#PinPagebackButton').focus();
//         }
//         var key = e.which || e.keyCode;
//         if (key === 8) {
//             this.addToScreen('c')
//             e.preventDefault();
//         }
//         if (key === 13) {
//             //event.preventDefault();
//         }
//     }
    return <div className="idle-register-wrapper">
    <header>
        <img src={imgOpenReg} alt="" />
        <div className="col">
            <p className="style1">{get_locName()}</p>
            <div className="divider"></div>
            <p className="style2">{ get_regName()}</p>
            <p className="style3">{get_locName()}</p>
            <button id="closeRegister1">Close Register</button>
        </div>
    </header>
    <main>{<PinPad></PinPad>} <button id="closeRegister2">Close Register</button></main>
</div>
}

export default Pin