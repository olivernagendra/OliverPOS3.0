import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const postApi=createApi({
    reducerPath:'postApi',
    baseQuery:fetchBaseQuery({
        baseUrl:'https://jsonplaceholder.typicode.com/',
    }),
    
    endpoints:(builder)=>({    
        getAllPost:builder.query({ //for All Records
            query:()=>({
                url:'posts',
                method:"GET"
            })
        }),
        getOnePost:builder.query({  //for single record
            query:(id)=>({
                url:`posts/${id}`,
                method:"GET"
            })
        }),
        getPostByLimit:builder.query({  //for limited record
            query:(num)=>{
               return {
                url:`posts?_limit=${num}`,
                method:"GET"
               } 
            }
        }),
        deletePost:builder.mutation({  //delete
            query:(id)=>{
               return {
                url:`posts/${id}`,
                method:"DELETE"
               } 
            }
        }),
        createPost:builder.mutation({  //save
            query:(newPost)=>{
               return {
                url:`posts`,
                method:"POST",
                body:newPost,
                headers:{
                    'content-type':'application/json;charset=UTF8'
                }
               } 
            }
        })
    })
})

export const {useGetAllPostQuery,useGetOnePostQuery,useGetPostByLimitQuery,
                useDeletePostMutation, useCreatePostMutation}=postApi;