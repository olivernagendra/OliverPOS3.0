import React from "react";
// import NoVariationsSelected from '../../../images/svg/NoVariationsSelected.svg';
const MsgPopup_NoVariationSelected = (props) => {
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleNoVariationSelected();
        }
    }
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? "subwindow no-variation-selected current" : "subwindow no-variation-selected"}>
                <div class="subwindow-body">
                    <div class="auto-margin-top"></div>
                    <p class="style1">No Variation Selected</p>
                    {/* <img src={NoVariationsSelected} alt="" /> */}
                    <p class="style2">
                        Please select all variations and attributes <br />
                        before adding this product to the cart.
                    </p>
                    <button id="closeNoVariations" onClick={() => props.toggleNoVariationSelected()}>Go Back</button>
                    <div class="auto-margin-bottom"></div>
                </div>
            </div></div>)
}

export default MsgPopup_NoVariationSelected 