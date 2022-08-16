import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
//import './App.css';
// import Login from './loginPage/Login';
 //import Coin from './app/coin/Coin';
import { useGetAllPostQuery,useGetOnePostQuery,useGetPostByLimitQuery,useDeletePostMutation,useCreatePostMutation } from './services/post';
import {useLoginMutation,useGetAllRegisterQuery} from './services/loginService'

function APICall() {
 // const response=useGetAllPostQuery()
 // const response=useGetOnePostQuery(2);
  //const response=useGetPostByLimitQuery(5);

  //DeleteData
  //const [deletePost,response]=useDeletePostMutation();

  //save 
  // const [createPost,response]=useCreatePostMutation();
  // const createPostData=(newPost)=>{
  //   createPost(newPost)
  // }
  // const deletePostData=(id)=>{
  //   deletePost(id)
  // }

  //Login ------------
   const [userLogin,response]=useLoginMutation();
  const handleUserLogin=()=>{
    userLogin({email:"test@mailinator.com",password:"123456"})
  }

//  // const handleGetAllRegister=()=>{
//      const getAllRegisterResponse=useGetAllRegisterQuery()
//      console.log("Registers",getAllRegisterResponse);
//  // }
  
  console.log("Response",response)
  return (
    <div className="App">
      <header className="App-header">Hello
   {/* <Coin /> */}
        {/* <Counter /> */}
{/* <Login/> */}
       {/* <button onClick={()=>deletePostData(2)}>Delete Post</button> */}
       {/* <button onClick={()=>createPostData({title:'New Post',body:'Test body',userId:1})}>New Post</button> */}

       <button onClick={()=>handleUserLogin()}>user Login</button>
       {/* <button onClick={()=>handleGetAllRegister()}>Get All Register</button> */}

      </header>
    </div>
  );
}

export default APICall;
