import React, { useEffect, useLayoutEffect } from "react";
import CircledPlus_Icon_Border from '../../images/svg/CircledPlus-Icon-Border.svg';
const ProductList = () => {
    return (
        <div className="products">
        <button className="product">
            <div className="body background-blue">
                <img src="../Assets/Images/Temp/Hanged-Tshirt.png" alt="" />
            </div>
            <div className="footer">
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint illo incidunt tempore explicabo, dolore recusandae quaerat
                    eum deserunt alias, vitae sed quis suscipit voluptate consequuntur. Doloribus quo quibusdam ex dolore.
                </p>
            </div>
        </button>
        <button className="product">
            <div className="body background-teal">
                <img src="../Assets/Images/Temp/Hanged-Tshirt.png" alt="" />
            </div>
            <div className="footer">
                <p>Graphic T-Shirt</p>
            </div>
        </button>
        <button className="category">
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit minima labore quos totam, possimus facere aliquam reiciendis
                maxime dignissimos eaque adipisci quo modi voluptas aut laboriosam vitae incidunt ullam facilis.
            </p>
        </button>
        <button className="category background-violet">
            <p>Clothing</p>
        </button>
        <button className="add-tile">
            <img src={CircledPlus_Icon_Border} alt="" />
            Add Tile
        </button>
    </div>)
}

export default ProductList 