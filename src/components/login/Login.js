import React,{useState,useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import imglogo from '../../images/svg/Oliver-Horizontal.svg'
import imgGoogle from '../../images/svg/google-logo.svg'
import imgFaceBook from '../../images/svg/facebook-logo.svg'
import imgApple from '../../images/svg/apple-logo.svg'
import { useDispatch, useSelector,shallowEqual } from 'react-redux';
//import {useLoginMutation,useGetAllRegisterQuery} from './loginService'
import {loginPanding, loginSuccess, loginFail,userLogin} from '../../app/features/login/loginSlice';

function Login(){
  const navigate = useNavigate();
   const [userEmail,setName]=useState("")
   const [password,setPassword]=useState("") 
   const [error,setError]=useState("") 
   //const [userLogin,loginResponse]=useLoginMutation(); 
    const dispatch= useDispatch();
    const loginResponse = useSelector((state) => state.login,shallowEqual);
    // console.log("loginResponse",loginResponse)
    if(loginResponse){
        const [data,error,status]=Object.entries(loginResponse);
        console.log("data",data,"error",error,"status",status)
    }
    // if(loginResponse.status==='error'){
    //    // setError(loginResponse.error  )
    // }

const handleUserLogin=()=>{     
   // console.log("userEmail,password",userEmail,password) 
    dispatch (userLogin({"email":userEmail,"password":password}) )
            //    console.log("res",res)
            //    if( res && res.data.is_success==false){
            //    setError(res.data.exceptions[0]);  
            //    }    
       }
  
    const handleNameChange=(e)=> {
       // console.log("event",e.target.value);
        setName(e.target.value);
    }

    const handlePasswordChange=(e)=> {
       // console.log("event",e.target.value);
        setPassword(e.target.value);
    }
  
    // if (loginResponse.status==='pending'){      
    //     dispatch(loginPanding())
    //     }
    // if (loginResponse.status==='fulfilled'){
    //     console.log(loginResponse.status)   
    //     if(loginResponse.data.is_success==false){
    //         //dispatch(loginFail(loginResponse.data.exceptions[0]))
           
            
    //     }else{
    //         //dispatch(loginSuccess(loginResponse.data))
    //          console.log("loginResponse",loginResponse.data);
    //         localStorage.setItem("clientDetail", JSON.stringify(loginResponse.data))
    //         navigate('/site')
    //     }
    // }


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