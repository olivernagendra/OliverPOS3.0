import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import AngledBracket_Left_Blue from '../../images/svg/AngledBracket-Left-Blue.svg'
import EmptyCart from '../../images/svg/EmptyCart.svg'
import person from '../../images/svg/person.svg'
import { get_customerName, get_UDid, get_userName } from '../common/localSettings';

import STATUSES from "../../constants/apiStatus";
import { useNavigate } from 'react-router-dom';
import LeftNavBar from "../common/commonComponents/LeftNavBar";
import Header from "./Header";
import CartListBody from "../common/commonComponents/CartListBody";
const Checkout = () => {
    const [subTotal, setSubTotal] = useState(0.00);
    const [taxes, setTaxes] = useState(0.00);
    const [discount, setDiscount] = useState(0.00);
    const [total, setTotal] = useState(0.00);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const setValues = (st, tx, dis, tt) => {
        setSubTotal(st);
        setTaxes(tx);
        setDiscount(dis);
        setTotal(tt);
    }
    const addCustomer=()=>
    {
        alert('add customer to order');
    }

    return <div className="checkout-wrapper">
        <LeftNavBar ></LeftNavBar>
        <Header ></Header>
        <div className="cart">
            <div className="checkout-cart-header">
                {get_customerName()==null?
                <button onClick={()=>addCustomer()}>Add Customer to Order</button>:
                <div className="cart-customer">
                    <div className="avatar">
                        <img src={person} alt="" />
                    </div>
                    <div className="text-col">
                        <p className="style1">{get_customerName().Name}</p>
                        <p className="style2">{get_customerName().Email}</p>
                    </div>
                </div>
}
            </div>
            <CartListBody setValues={setValues}></CartListBody>
            {/* <div className="body">
                <img src={EmptyCart} alt="" />
                <div className="cart-item">
                    <div className="main-row">
                        <p className="quantity">2</p>
                        <p className="content-style">Face Mask</p>
                        <p className="price">$16.00</p>
                    </div>
                </div>
                <div className="cart-item">
                    <div className="main-row aligned">
                        <div className="tag customer">Customer</div>
                        <div className="content-style">Freddy Mercury</div>
                    </div>
                </div>
                <div className="cart-item">
                    <div className="main-row">
                        <p className="quantity">10</p>
                        <p className="content-style">Snapback Baseball Hat with Logo</p>
                        <p className="price">$24.00</p>
                    </div>
                    <div className="secondary-col">
                        <p>Medium</p>
                        <p>Navy</p>
                    </div>
                </div>
                <div className="cart-item">
                    <div className="main-row aligned">
                        <div className="tag group">Group</div>
                        <p className="content-style">Table 1</p>
                    </div>
                </div>
                <div className="cart-item">
                    <div className="main-row">
                        <p className="quantity">10,000</p>
                        <p className="content-style">Reusable Coffee Cups</p>
                        <p className="price">$60,000</p>
                    </div>
                </div>
                <div className="cart-item">
                    <div className="main-row aligned">
                        <div className="tag custom-fee">Custom Fee</div>
                        <div className="content-style">Shipping Fee</div>
                        <div className="price">$20.00</div>
                    </div>
                </div>
                <div className="cart-item">
                    <div className="main-row aligned">
                        <div className="tag cart-note">Note</div>
                        <p className="content-style line-capped">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus, praesentium perferendis. Soluta impedit ea
                            numquam voluptatum qui odit maxime distinctio. Voluptatibus maxime esse voluptates, inventore id commodi aliquid?
                            Nostrum, hic!
                        </p>
                    </div>
                </div>
                <div className="cart-item">
                    <div className="main-row">
                        <p className="quantity">1</p>
                        <p className="content-style">Dress Shirt</p>
                        <p className="price">$45.00</p>
                    </div>
                    <div className="secondary-col">
                        <p>White</p>
                        <p>Neck: 16"</p>
                        <p>Sleeve: 34"</p>
                        <p>Chest: 42"</p>
                        <p><b>**Note:</b> If no white available, please get black.</p>
                    </div>
                </div>
                <div className="cart-item">
                    <div className="main-row">
                        <p className="quantity">1</p>
                        <p className="content-style">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem consequatur cum inventore similique totam sit fuga
                            repudiandae vel necessitatibus numquam, est perspiciatis hic beatae delectus aspernatur iste placeat nihil illo?
                        </p>
                        <p className="price">$45.00</p>
                    </div>
                    <div className="secondary-col">
                        <p>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam praesentium consequuntur eveniet dignissimos
                            laboriosam veritatis numquam! Officiis vel consequatur quisquam reprehenderit tenetur eveniet alias? Voluptatibus
                            repellat est magnam ipsum inventore.
                        </p>
                    </div>
                </div>
            </div> */}
            <div className="footer">
                <div className="totals">
                    <div className="row">
                        <p>Subtotal</p>
                        <p><b>${subTotal}</b></p>
                    </div>
                    {discount !== 0 ?
                        <div className="row">
                            <p>Cart Discount - 25%</p>
                            <p><b>-${discount}</b></p>
                        </div> : null}
                    {taxes !== 0 ?
                        <div className="row">
                            <p>Taxes</p>
                            <p><b>${taxes}</b></p>
                        </div> : null}
                    <div className="row">
                        <p><b>Total</b></p>
                        <p><b>${total}</b></p>
                    </div>
                </div>
            </div>
        </div>
        <div className="checkout-body">
            <button id="balanceButton" className="balance-container">
                <div className="row">
                    <p className="style1">Balance Due</p>
                    <p className="style2">$43.45</p>
                </div>
                <div className="row">
                    <p className="style3">Card</p>
                    <p className="style3">$60.00</p>
                </div>
                <div className="row">
                    <p className="style3">Cash</p>
                    <p className="style3">$20.00</p>
                </div>
                <div className="row">
                    <p className="style4">Total Paid</p>
                    <p className="style4">$80.00</p>
                </div>
            </button>
            <p className="style1">Click to make a partial payment</p>
            <p className="style2">Quick Split</p>
            <div className="button-row">
                <button>1/2</button>
                <button>1/3</button>
                <button>1/4</button>
            </div>
            <div className="button-row">
                <button>By Product</button>
                <button>By People</button>
            </div>
            <p className="style2">Customer Payment Types</p>
            <p className="style3">Please add a customer to make customer payment types available</p>
            <div className="button-row">
                <button disabled>Layaway</button>
                <button>Store Credit ($24.99)</button>
            </div>

            <div className="payment-types">
                <p>Payment Types</p>
                <div className="button-container">
                    <button className="background-blue">Cash</button>
                    <button className="background-coral">Card</button>
                    <button>
                        <img src="../Assets/Images/SVG/Stripe Icon.svg" alt="" />
                    </button>
                    <button>
                        <img src="../Assets/Images/SVG/Amelia_Icon.svg" alt="" />
                    </button>
                    <button className="background-teal">
                        <img src="../Assets/Images/SVG/spongebob-squarepants-2.svg" alt="" />
                    </button>
                    <button className="background-cyan">Placeholder</button>
                    <button className="background-red">Placeholder</button>
                    <button className="background-yellow">Placeholder</button>
                    <button className="background-lime">Placeholder</button>
                    <button className="background-violet">Placeholder</button>
                </div>
            </div>
        </div>
    </div>
}
export default Checkout