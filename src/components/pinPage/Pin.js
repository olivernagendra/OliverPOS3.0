import React from "react"
const Pin=()=>{
    const  pinNumberList= ["1", "2", "3", "4", "5", "6", "7", "8", "9", " ", "0", "c"];

    
const NumInput = props =>
    chunkArray(props.numbers, 3).map((num, index) => (
        <div key={index} className="pin-button-row">
            {num.map((nm, i) => {
                return (
                     <button key={"input" + i} type="button" id={props.id} 
                     onClick={() => { nm == " " ? '' : props.onClick(nm) }} 
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
                {/* <input style={props.style} key={ind} id={pinId} type={props.type} className={props.className} /> */}
                <input type="number" key={ind + 1} id={pinId + 1} className={props.className} />
                {/*type={props.type}  className="if-show-only" */}
            </li>
        )
    })
  const  addToScreen=(e) =>{
        var lenght_is = e.length - 1
        var newString = e[lenght_is];
        if (e == "c") {
            if (this.state.totalSize > 0) {
               // this.resetScreen();
            } else {
                this.state.totalSize = 0;
                this.state.txtValue = ''
            }
            return;
        }
        if (this.state.totalSize < 4) {
            this.state.txtValue += newString;
            this.state.totalSize += 1;
            setTimeout(function () {
               // this.fillPass();
            }.bind(this), 100)
        }

        // $('#whichkey').focus()
        var _envType = localStorage.getItem('env_type');
        if (_envType && _envType !== "") {
            $('#whichkey').attr('readonly', true);
        } else {
            $('#whichkey').focus();
        }
    }


    return <div class="idle-register-wrapper">
    <header>
        <img src="../Assets/Images/SVG/OpenSign-BaseBluesvg.svg" alt="" />
        <div class="col">
            <p class="style1">Sushi Sun</p>
            <div class="divider"></div>
            <p class="style2">Register 1</p>
            <p class="style3">Water St. Location</p>
            <button id="closeRegister1">Close Register</button>
        </div>
    </header>
    <main>
        <p>Enter Your User ID</p>
        <div class="pinpad">
            <div class="pin-entries">
                <div class="pin-entry"></div>
                <div class="pin-entry"></div>
                <div class="pin-entry"></div>
                <div class="pin-entry"></div>
                <div class="pin-entry"></div>
                <div class="pin-entry"></div>
            </div>
            <NumInput id="keyss" type="button" numbers={pinNumberList} onClick={addToScreen} readOnly={false} className2="fill-dotted-clear" />
            {/* <div class="pin-button-row">
                <button>1</button>
                <button>2</button>
                <button>3</button>
            </div>
            <div class="pin-button-row">
                <button>4</button>
                <button>5</button>
                <button>6</button>
            </div>
            <div class="pin-button-row">
                <button>7</button>
                <button>8</button>
                <button>9</button>
            </div>
            <div class="pin-button-row">
                <button>0</button>
                <button class="backspace">
                    <img src="../Assets/Images/SVG/Backspace-BaseBlue.svg" alt="" />
                </button>
            </div> */}
        </div>
        <button id="closeRegister2">Close Register</button>
    </main>
</div>
}

export default Pin