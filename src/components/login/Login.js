import React,{useState} from "react";
import { useNavigate } from 'react-router-dom';
import imglogo from '../../images/svg/Oliver-Horizontal.svg'
import imgGoogle from '../../images/svg/google-logo.svg'
import imgFaceBook from '../../images/svg/facebook-logo.svg'
import imgApple from '../../images/svg/apple-logo.svg'
import { useDispatch, useSelector,shallowEqual } from 'react-redux';
import {userLogin} from '../../app/features/login/loginSlice';
import STATUSES from "../../constants/apiStatus";
function Login(){
  const navigate = useNavigate();
   const [userEmail,setName]=useState("")
   const [password,setPassword]=useState("") 

    const dispatch= useDispatch();
    const { status, data, error,is_success } = useSelector((state) => state.login)
      console.log("status",status, "data",data, "error",error,"is_success",is_success)

      if(status ==STATUSES.error){
            console.log(error)
        }
        if(status ==STATUSES.IDLE && is_success){
            navigate('/site')
        }
   

const handleUserLogin=()=>{     
  
    dispatch (userLogin({"email":userEmail,"password":password}) )
      
       }
  
    const handleNameChange=(e)=> {
       // console.log("event",e.target.value);
        setName(e.target.value);
    }

    const handlePasswordChange=(e)=> {
       // console.log("event",e.target.value);
        setPassword(e.target.value);
    }
  

return  ( <div className="login-wrapper">
    <div className="auto-margin-top"></div>
    {/* counter: {counter} */}
    <img src={imglogo}/>
    <p >Sign in to your Oliver POS Account</p>
    {error !=="" && <div className="danger">{error} </div> }
    <form className="login-form">
        <label htmlFor="email">Email</label>
        <input type="text" id="email" placeholder="Enter Email"  onChange={(e)=>handleNameChange(e)}/>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="Enter Password"   onChange={(e)=>handlePasswordChange(e)} />
        <div className="row">
            <a href="#">Forgot your Password?</a>
            <label className="custom-checkbox-wrapper">
                <input type="checkbox" />
                <div className="custom-checkbox">
                    <img src="./Assets/Images/SVG/Checkmark.svg" alt="" />
                </div>
                Remember Me?
            </label>
        </div>
        <button type="button" onClick={()=>handleUserLogin()}>Sign In</button>
    </form>
    <div className="or-row">
        <div className="divider"></div>
        <p>OR</p>
        <div className="divider"></div>
    </div>
    <button id="googleButton" type="button"   >
        <div className="img-container">
            <img src={imgGoogle} alt="" />

        </div>
        Sign in with Google
    </button>
    <button id="facebookButton" type="button" >
        <div className="img-container">
            <img src={imgFaceBook} alt="" />
        </div>
        Sign in with Facebook
    </button>
    <button id="appleButton" type="button" >
        <div className="img-container">
            <img src={imgApple} alt="" />
        </div>
        Sign in with Apple
    </button>
    <div className="row">
        <p>Don't have an account?</p>
        <a href="#">Sign up Now!</a>
    </div>
    <div className="auto-margin-bottom"></div>
   
</div>
  )
};

export default Login;