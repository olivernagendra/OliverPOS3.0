import React from 'react'
import AvatarIcon from '../../assets/images/svg/AvatarIcon.svg'
const Customerlist = (props) => {
  return (
     <>
          <button  onClick={(e)=> props.onClick(e)}    id={props.FirstName}  className={props.updateCustomerId === props.CustomerId ?"customer-card no-transform selected":"customer-card no-transform"}>
            <div className="avatar">
              <img src={AvatarIcon} alt="" />
            </div>
            <div className="text-group">
              <p className="style1">{props.FirstName}  {props.LastName} </p>
              <p className="style2">{props.Email}</p>
            </div>
            {props.updateCustomerId === props.CustomerId ?  <div  className="selected-indicator" ></div>:""  }
          
          </button>
          </>
        )
     }

export default Customerlist