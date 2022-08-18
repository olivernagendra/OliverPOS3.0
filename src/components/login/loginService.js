import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
//import Config from '../Config'

//const API_URL = Config.key.OP_API_URL
export const loginApi=createApi({
    reducerPath:'loginApi',
    baseQuery:fetchBaseQuery({
        baseUrl:'https://dev1.app.olivertest.com/api/',
    }),
    
    endpoints:(builder)=>({    
        getAllRegister:builder.query({ //for All Records
            query:()=>({
                url:`v1/Firebase/GetRegisters`,
                method:"GET",
                headers: {
                    "access-control-allow-origin": "*",
                    "access-control-allow-credentials": "true",
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic MjZmMzY3MDEtMTBmNi00MzFjLTkyY2QtNzA4Yzg0NzZmOTliOmY3MDRhMGFjLTQzODgtNDg3YS05MmViLTU2NmFiMjQ5NWJlZA==',
                }
            })
        }),
        // getOnePost:builder.query({  //for single record
        //     query:(id)=>({
        //         url:`posts/${id}`,
        //         method:"GET"
        //     })
        // }),
        // getPostByLimit:builder.query({  //for limited record
        //     query:(num)=>{
        //        return {
        //         url:`posts?_limit=${num}`,
        //         method:"GET"
        //        } 
        //     }
        // }),
        // deletePost:builder.mutation({  //delete
        //     query:(id)=>{
        //        return {
        //         url:`posts/${id}`,
        //         method:"DELETE"
        //        } 
        //     }
        // }),
        login:builder.mutation({  //save
            query:(data)=>{
               return {
                url:`/v1/account/Login`,
                method:"POST",
                body:data,
                headers: {
                    "access-control-allow-origin": "*",
                    "access-control-allow-credentials": "true",
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(sessionStorage.getItem("AUTH_KEY")),
                }
               } 
            }
        })
    })
})

export const {useLoginMutation,useGetAllRegisterQuery}=loginApi;