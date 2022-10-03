import React, { useState, useEffect, useRef } from "react";
import X_Icon_DarkBlue from '../../../images/svg/X-Icon-DarkBlue.svg';
import Arrow_Left from '../../../images/svg/Arrow_Left.svg';
import { chunkArray } from "../localSettings";
import LocalizedLanguage from "../../../settings/LocalizedLanguage";
const NumberPad = (props) => {
    const inputElement = useRef(null);
    const [totalSize, setTotalSize] = useState(0)
    const [txtValue, setTxtValue] = useState("")
    const outerClick = (e) => {

        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleNumberPad();
        }
    }
    const pinNumberList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "c"];
    const NumInput = props =>
        chunkArray(props.numbers, 3).map((num, index) => (
            <div key={index} className="button-row">
                {num.map((nm, i) => {
                    if (nm === " ") { return "" }
                    return (
                        <button key={"input" + i} type="button" id={props.id}
                            onClick={() => { addToScreen(nm) }}
                            className={nm === 'c' ? "backspace" : ""}>
                            {nm === 'c' ? <img src={Arrow_Left} /> : nm}
                        </button>
                    )
                })
                }
            </div>
        ))

    const resetScreen = () => {
        var str = txtValue;
        if (totalSize > 0) {
            setTotalSize(totalSize - 1);
            setTxtValue(str.substring(0, str.length - 1));
        } else {
            setTotalSize(0);
            setTxtValue("");
        }
    }
    const onChange = (e) => {
        const re = /^[0-9\.]+$/;
        var val = e.target.value
        if (val === '' || re.test(val)) {
            if (val.split('.').length > 2)
                val = val.replace(/\.+$/, "");
            setTxtValue(val)
            var size = totalSize + 1
            setTotalSize(size);
        }
    }
    const addToScreen = (inputNo) => {
        var lenght_is = inputNo.length - 1
        var newString = inputNo[lenght_is];
        if (inputNo === "c") {
            if (totalSize > 0) {
                resetScreen();
            } else {
                setTotalSize(0);
                setTxtValue('');
            }
            return;
        }
        var value = txtValue + newString
        if (value.split('.').length > 2)
            value = value.replace(/\.+$/, "");
        var size = totalSize + 1
        setTxtValue(value);
        setTotalSize(size);
    }
    return (<div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
        <div className={props.isShow === true ? "subwindow cash-payment step-1 current" : "subwindow cash-payment step-1"}>
            <div className="subwindow-header">
                <p>Cash Payment</p>
                <button className="close-subwindow" onClick={() => props.toggleNumberPad()}>
                    <img src={X_Icon_DarkBlue} alt="" />
                </button>
            </div>
            <div className="subwindow-body">
                <div className="step1">
                    <div className="auto-margin-top"></div>
                    <div className="text-row">
                        <p className="style1">Total balance:</p>
                        <p className="style2" id="cashStep1Balance">$X.XX</p>
                    </div>
                    <div className="input-numpad">
                        <div className="input-container">
                            <label for="cashPaymentAmount">{LocalizedLanguage.amountTendered}:</label>
                            <input ref={inputElement} autoFocus={true} type="text" id="cashPaymentAmount" placeholder="$0" value={txtValue} onChange={e => onChange(e)} />
                        </div>
                        <div id="numpad2">
                            <NumInput id="keyss" type="button" numbers={pinNumberList} readOnly={false} />
                            {/* <div className="button-row">
                                <button>1</button>
                                <button>2</button>
                                <button>3</button>
                            </div>
                            <div className="button-row">
                                <button>4</button>
                                <button>5</button>
                                <button>6</button>
                            </div>
                            <div className="button-row">
                                <button>7</button>
                                <button>8</button>
                                <button>9</button>
                            </div>
                            <div className="button-row">
                                <button>.</button>
                                <button>0</button>
                                <button className="backspace">
                                    <img src={Arrow_Left} alt="" />
                                </button>
                            </div> */}
                        </div>
                    </div>
                    <button id="enterCashPaymentButton" disabled={parseFloat(txtValue) > 0 ? false : true}>Enter</button>
                    <div className="auto-margin-bottom"></div>
                </div>
                <div className="step2">
                    <div className="auto-margin-top"></div>
                    <div className="text-row">
                        <p>Total balance:</p>
                        <p id="cashStep2Balance"><b>$X.XX</b></p>
                    </div>
                    <div className="text-row">
                        <p>Payment:</p>
                        <p id="cashStep2Payment"><b>$X.XX</b></p>
                    </div>
                    <div className="text-row">
                        <p>Balance remaining:</p>
                        <p id="cashStep2Remaining"><b>$X.XX</b></p>
                    </div>
                    <div className="text-row">
                        <p><b>Change:</b></p>
                        <p id="cashStep2Change"><b>$X.XX</b></p>
                    </div>
                    <button id="closeCashPaymentButton">Done</button>
                    <div className="auto-margin-bottom"></div>
                </div>
            </div>
        </div>
    </div>)
}
export default NumberPad 