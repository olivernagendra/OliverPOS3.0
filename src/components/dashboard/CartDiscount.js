import React, { useState,useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';
const CartDiscount = (props) => {
    const [isShowDiscount, setisShowDiscount] = useState(false);
    const toggleShowDiscount = () => {
        setisShowDiscount(!isShowDiscount)
    }
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleCartDiscount();
        }
        else {
            //e.stopPropagation();
            // if(e && e.target && e.target.className && e.target.className === "custom-radio")
            // {
            //     setisShowDiscount(!isShowDiscount)
            // }
        }
        // console.log(e.target.className)
    }
    return (
        <div className={props.isShow===true?"subwindow-wrapper":"subwindow-wrapper hidden"} onClick={(e)=>outerClick(e)}>
        {/* <div className={props.isShow===true? "subwindow cart-discount current":"subwindow cart-discount"}>
            <div className="subwindow-header">
                <p>Add Cart Discount</p>
                <button className="close-subwindow" onClick={()=>props.toggleCartDiscount()}>
                    <img src={X_Icon_DarkBlue} alt="" />
                </button>
            </div>
            <div className="subwindow-body">
                <label htmlFor="cartDiscountAmount">Discount amount:</label>
                <input type="number" id="cartDiscountAmount" placeholder="0" />
                <p>Select type of discount to be applied to cart:</p>
                <div className="button-row">
                    <button id="dollarDiscount">$ Discount</button>
                    <button id="percentDiscount">% Discount</button>
                </div>
            </div>
        </div> */}
        

        <div className={props.isShow===true?"subwindow discount-fee custom-fee current":"subwindow discount-fee custom-fee"}>
				<div className="subwindow-header">
					<p>Custom Fees/Discounts</p>
					<button className="close-subwindow" onClick={()=>props.toggleCartDiscount()}>
						<img src={X_Icon_DarkBlue} alt="" />
					</button>
				</div>
				<div className="subwindow-body">
					<div className="auto-margin-top"></div>
					<p className="style1">Select an option:</p>
					<div className="toggle-container">
						<label >
							<input type="radio" id="customFeeRadio" name="customFeeDiscount" defaultChecked={isShowDiscount==false?true:false} />
							<div className="custom-radio" onClick={()=>toggleShowDiscount()}>
								<p>Custom Fee</p>
							</div>
						</label>
						<label >
							<input type="radio" id="discountRadio" name="customFeeDiscount" />
							<div className="custom-radio" onClick={()=>toggleShowDiscount()}>
								<p>Discount</p>
							</div>
						</label>
					</div>
					<div className={isShowDiscount==false?"custom-fee unhide":"custom-fee hide"}>
						<label htmlFor="customFeeLabel">Custom Fee Label</label>
						<input type="text" id="customFeeLabel" placeholder="Name your custom fee" />
						<input type="number" id="customFeeAmount" placeholder="0.00" />
						<p>Applies a custom fee item to cart</p>
						<div className="button-row">
							<button>With Tax</button>
							<button>Without Tax</button>
						</div>
					</div>
					<div className={isShowDiscount==true?"cart-discount unhide":"cart-discount hide"}>
						<div className="main">
							<label htmlFor="discountAmount">Discount amount:</label>
							<input type="number" id="discountAmount" placeholder="0.00" />
							<p>Select type of discount to be applied to cart:</p>
							<div className="button-row">
								<button>$ Discount</button>
								<button>% Discount</button>
							</div>
						</div>
						<div className="list">
							<p>Pre-set discounts</p>
							<button>
								<p>Super Sale (20%)</p>
							</button>
							<button>
								<p>Student Day (5%)</p>
							</button>
							<button>
								<p>Canada Day (10%)</p>
							</button>
							<button>
								<p>
									Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia rem placeat temporibus impedit quo, magni
									distinctio, obcaecati velit, laboriosam praesentium eveniet vero fugiat. Repellendus eligendi aliquid vel ipsum
									praesentium vero.
								</p>
							</button>
						</div>
					</div>
					<div className="auto-margin-bottom"></div>
				</div>
			</div>
        
        </div>
        
        
        
        
        )
}

export default CartDiscount 