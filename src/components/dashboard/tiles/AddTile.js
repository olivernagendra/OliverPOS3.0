import React, { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import X_Icon_DarkBlue from '../../../images/svg/X-Icon-DarkBlue.svg';
const AddTile = (props) => {

    // const [respAttribute, respCategory] = useSelector((state) => [state.attribute.data.content, state.category.data.content])
    // console.log("---respAttribute----"+respAttribute)
    return (
        <div className="subwindow add-tile">
        <div className="subwindow-header">
            <p>Add Tile</p>
            <button className="close-subwindow">
                <img src={X_Icon_DarkBlue} alt="" />
            </button>
        </div>
        <div className="subwindow-body">
            <div className="auto-margin-top"></div>
            <label htmlFor="tileLink">Select Tile Link</label>
            <input type="text" id="tileLink" placeholder="Search for Tag/Category/Attributes/Product" />
            <p>Select the tile color</p>
            <div className="radio-group">
                {/* {
                    props.categoryList && props.categoryList.map(c=>
                        {
                            <p>{c.name}</p>
                        })
                } */}
                <label>
                    <input type="radio" id="violet" name="tile-color" value="violet" />
                    <div className="custom-radio-button background-violet"></div>
                </label>
                <label>
                    <input type="radio" id="blue" name="tile-color" value="blue" />
                    <div className="custom-radio-button background-blue"></div>
                </label>
                <label>
                    <input type="radio" id="cyan" name="tile-color" value="cyan" />
                    <div className="custom-radio-button background-cyan"></div>
                </label>
                <label>
                    <input type="radio" id="teal" name="tile-color" value="teal" />
                    <div className="custom-radio-button background-teal"></div>
                </label>
                <label>
                    <input type="radio" id="lime" name="tile-color" value="lime" />
                    <div className="custom-radio-button background-lime"></div>
                </label>
                <label>
                    <input type="radio" id="yellow" name="tile-color" value="yellow" />
                    <div className="custom-radio-button background-yellow"></div>
                </label>
                <label>
                    <input type="radio" id="coral" name="tile-color" value="coral" />
                    <div className="custom-radio-button background-coral"></div>
                </label>
                <label>
                    <input type="radio" id="red" name="tile-color" value="red" />
                    <div className="custom-radio-button background-red"></div>
                </label>
            </div>
            <button>Add Tile</button>
            <div className="auto-margin-bottom"></div>
        </div>
    </div>)
}

export default AddTile 