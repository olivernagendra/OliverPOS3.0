import React, { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import CircledPlus_Icon_Border from '../../../images/svg/CircledPlus-Icon-Border.svg';
import STATUSES from "../../../constants/apiStatus";
import { tile } from './tileSlice';

const AddTileType = (arr, n) => {
    const newArry = arr.map((item) => {
        return { ...item, type: n };
    });
    return newArry
}
const TileList = () => {
    var favTiles = [];
    var favArrayList = [];
    const dispatch = useDispatch();
    useEffect(() => {
        var regId = localStorage.getItem('register');
        if (typeof regId != "undefined" && regId != null) {
            dispatch(tile({ "id": regId }));
        }
    }, []);

    const { status, data, error, is_success } = useSelector((state) => state.tile)
    if (status === STATUSES.error) {
        console.log(error)
    }
    if (status == STATUSES.IDLE && is_success) {

        favTiles = data && data.content;
        var FavProduct = favTiles.FavProduct;
        var FavAttribute = favTiles.FavAttribute;
        var FavSubAttribute = favTiles.FavSubAttribute;
        var FavCategory = favTiles.FavCategory;
        var FavSubCategory = favTiles.FavSubCategory;

        FavProduct = AddTileType(favTiles.FavProduct, 'product');
        FavAttribute = AddTileType(favTiles.FavAttribute, 'attribute');
        FavSubAttribute = AddTileType(favTiles.FavSubAttribute, 'sub-attribute');
        FavCategory = AddTileType(favTiles.FavCategory, 'category');
        FavSubCategory = AddTileType(favTiles.FavSubCategory, 'sub-category');

        favArrayList = [...FavProduct, ...FavAttribute, ...FavSubAttribute, ...FavCategory, ...FavSubCategory];
        favArrayList = [...favArrayList].sort((a, b) => a.Order - b.Order);

    }
    return (
        <div className="products">
            {
                favArrayList.map((item, index) => {
                    switch (item.type) {
                        case "product":
                            return <button className="product" key={index} >
                                <div className="body background-blue">
                                    <img src={item.Image} alt="" />
                                </div>
                                <div className="footer">
                                    <p>
                                        {item.Title}
                                    </p>
                                </div>
                            </button>
                            break;
                        case "attribute":
                        case "sub-attribute":
                            return <button className="category"  key={index}>
                                <p>
                                    {item.attribute_slug}
                                </p>
                            </button>
                            break;
                        case "category":
                        case "sub-category":
                            return <button className="category"  key={index}>
                                <p>
                                    {item.name}
                                </p>
                            </button>
                            break;
                        default:
                            break;
                    }
                })
            }

            {/* <button className="product">
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
            </button> */}
            <button className="add-tile">
                <img src={CircledPlus_Icon_Border} alt="" />
                Add Tile
            </button>
        </div>)
}

export default TileList 