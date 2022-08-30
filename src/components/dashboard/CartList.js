import React, { useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';
import EmptyCart from '../../images/svg/EmptyCart.svg';
import CircledX_Grey from '../../images/svg/CircledX-Grey.svg';
const CartList = () => {
    return (
        <div className="cart">
        <div className="mobile-header">
            <p>Cart</p>
            <button id="exitCart">
                <img src={X_Icon_DarkBlue} alt="" />
            </button>
        </div>
        <div className="body">
            <img src={EmptyCart} alt="" />
            <div className="cart-item">
                <div className="main-row">
                    <p className="quantity">2</p>
                    <p className="content-style">Face Mask</p>
                    <p className="price">$16.00</p>
                    <button className="remove-cart-item">
                        <img src={CircledX_Grey} alt="" />
                    </button>
                </div>
            </div>
            <div className="cart-item">
                <div className="main-row aligned">
                    <div className="tag customer">Customer</div>
                    <div className="content-style">Freddy Mercury</div>
                    <button className="remove-cart-item">
                        <img src={CircledX_Grey} alt="" />
                    </button>
                </div>
            </div>
            <div className="cart-item">
                <div className="main-row">
                    <p className="quantity">10</p>
                    <p className="content-style">Snapback Baseball Hat with Logo</p>
                    <p className="price">$24.00</p>
                    <button className="remove-cart-item">
                        <img src={CircledX_Grey} alt="" />
                    </button>
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
                    <button className="remove-cart-item">
                        <img src={CircledX_Grey} alt="" />
                    </button>
                </div>
            </div>
            <div className="cart-item">
                <div className="main-row">
                    <p className="quantity">10,000</p>
                    <p className="content-style">Reusable Coffee Cups</p>
                    <p className="price">$60,000</p>
                    <button className="remove-cart-item">
                        <img src={CircledX_Grey} alt="" />
                    </button>
                </div>
            </div>
            <div className="cart-item">
                <div className="main-row aligned">
                    <div className="tag custom-fee">Custom Fee</div>
                    <div className="content-style">Shipping Fee</div>
                    <div className="price">$20.00</div>
                    <button className="remove-cart-item">
                        <img src={CircledX_Grey} alt="" />
                    </button>
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
                    <button className="remove-cart-item">
                        <img src={CircledX_Grey} alt="" />
                    </button>
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
                    <button className="remove-cart-item">
                        <img src={CircledX_Grey} alt="" />
                    </button>
                </div>
                <div className="secondary-col">
                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam praesentium consequuntur eveniet dignissimos
                        laboriosam veritatis numquam! Officiis vel consequatur quisquam reprehenderit tenetur eveniet alias? Voluptatibus
                        repellat est magnam ipsum inventore.
                    </p>
                </div>
            </div>
        </div>
        <div className="footer">
            <div className="totals">
                <div className="row">
                    <p>Subtotal</p>
                    <p><b>$128.87</b></p>
                </div>
                <div className="row">
                    <p>Cart Discount - 25%</p>
                    <button id="editCartDiscount">edit</button>
                    <p><b>-$12.99</b></p>
                </div>
                <div className="row">
                    <button id="taxesButton">Taxes</button>
                    <p>(15%)</p>
                    <p><b>$15.42</b></p>
                </div>
            </div>
            <div className="checkout-container">
                <button>Checkout - $10,234.32</button>
            </div>
        </div>
    </div>)
}

export default CartList 