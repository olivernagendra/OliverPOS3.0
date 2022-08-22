import React, { useState } from "react"
import {chunkArray} from '../common/localSettings'
import imgOpenReg from '../../images/svg/OpenSign-BaseBluesvg.svg'
const Pin=()=>{
    const [totalSize,setTotalSize]=useState(0)
    const [txtValue,setTxtValue]=useState("")
    const isloading=false;
    const  pinNumberList= ["1", "2", "3", "4", "5", "6", "7", "8", "9", " ", "0", "c"];

    
const NumInput = props =>
    chunkArray(props.numbers, 3).map((num, index) => (
        <div key={index} className="pin-button-row">
            {num.map((nm, i) => {
                return (
                     <button key={"input" + i} type="button" id={props.id} 
                     onClick={() => { addToScreen(nm) }} 
                     >{nm == 'c' ? '' : nm} </button>
                )        
                        
            })
            
            }
            </div>
    ))

const TrashPin = props =>
    props.trshPin.map((pinId, ind) => {
        return (
            <li key = {ind}>
                <input style={props.style} key={ind} id={pinId} type={props.type} className={props.className} />
            </li>
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
     if(inputNo == " ") {return} 
        //var lenght_is = e.length - 1
        //var newString = inputNo;//e[lenght_is];
        if (inputNo == "c") {
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
            // setTimeout(function () {
            //     fillPass();
            // }.bind(this), 100)
        }
        console.log(txtValue, totalSize)
        // $('#whichkey').focus()
        var _envType = localStorage.getItem('env_type');
        if (_envType && _envType !== "") {
           // $('#whichkey').attr('readonly', true);
        } else {
            //$('#whichkey').focus();
        }
    }
   const fillPass=()=> {
        var i = 1;
        for (i = 1; i <= 4; i++) {
            if (totalSize >= i) {
                if (totalSize >= 4) {
                    const { dispatch } = this.props;
                    if (isloading == false) {
                        this.setState({ isloading: true })
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
                            if (txtValue !== null && txtValue !== '' && userID && userID !== '') {
                                // var hasPin = localStorage.getItem('clientDetail') && JSON.parse(localStorage.getItem('clientDetail')).HasPin
                                this.setState({ creatPinTxt: txtValue })
                                var hasPin = localStorage.getItem('hasPin')
                                console.log(typeof (txtValue));
                                if (hasPin != 'false') {
                                   // dispatch(pinLoginActions.pinLogin(txtValue, userID));
                                } else {
                                  //  dispatch(pinLoginActions.createPin(txtValue, userID));
                                }
                            }

                            setTxtValue("");
                            setTotalSize (0);
                        }.bind(this), 100)
                    }
                }
                if (totalSize == i) {
                    var val = txtValue.charAt(totalSize - 1)
                   // $("#txt" + i + '1').val(val);
                }
                //$("#txt" + i).removeClass("bg_trasn");
            } else {
               // $("#txt" + i + '1').val('');
                //$("#txt" + i).addClass("bg_trasn");
            }
        }
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
                <div className="pin-entry"></div>
                <div className="pin-entry"></div>
                <div className="pin-entry"></div>
                <div className="pin-entry"></div>
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