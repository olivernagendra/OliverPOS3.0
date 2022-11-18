import React from 'react'
import AvatarIcon from '../../assets/images/svg/AvatarIcon.svg'
const Customerlist = (props) => {
  var intials = []
  intials = props.FirstName.charAt(0) + props.LastName.charAt(0)
  return (
    <>
      <button onClick={(e) => props.onClick(e)} id={props.FirstName} className={props.updateCustomerId === props.CustomerId ? "customer-card no-transform selected" : "customer-card no-transform"}>
        <div className="avatar">
          {intials ? intials : <><img src={AvatarIcon} alt="" /></>}

        </div>
        <div className="text-group">
          <p className="style1">{props.FirstName ? props.FirstName : props.userName ? props.userName : '' + " " + props.LastName} </p>
          <p className="style2">{props.Email}</p>
        </div>
        {props.updateCustomerId === props.CustomerId ? <div className="selected-indicator" ></div> : ""}

      </button>
    </>
  )
}

export default Customerlist