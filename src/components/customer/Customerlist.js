import React from 'react'
import AvatarIcon from '../../assets/images/svg/AvatarIcon.svg'
const Customerlist = (props) => {
  return (
     <>
          <button onClick={props.onClick} id={props.FirstName}  className="customer-card no-transform selected">
            <div className="avatar">
              <img src={AvatarIcon} alt="" />
            </div>
            <div className="text-group">
              <p className="style1">{props.FirstName}  {props.LastName} </p>
              <p className="style2">{props.Email}</p>
            </div>
            <div className="selected-indicator"></div>
          </button>
          </>
        )
     }

export default Customerlist