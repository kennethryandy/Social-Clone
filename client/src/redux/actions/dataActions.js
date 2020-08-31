import { GET_POSTS, LIKE_POST, UNLIKE_POST,ADD_COMMENT,
  CREATE_POST, DELETE_POST, LOADING_DATA, ADD_POST, LOADING_LIKE, LOADING_COMMENT, LOADING_CREATE_POST, LOADING_DELETE_POST} from '../types'
import axios from 'axios'

export const getAllPosts = () => async dispatch => {
  setAxiosHeaders()
  dispatch({type:LOADING_DATA})
  try {
    const reqBody = {
      query: `
        query{
          posts{
            _id
            content
            postImageUrl
            creator{
              username
              imageUrl
              _id
            }
            comments{
              _id
              content
              username
              imageUrl
              userId
              postId
              createdAt
            }
            commentCount
            likeCount
            createdAt
          }
        }
      `
    }
    const res = await axios.post(process.env.REACT_APP_API_URL+'/graphql',reqBody)
    dispatch({
      type:GET_POSTS,
      payload: res.data.data.posts
    })
  } catch (error) {
    console.error(error)
  }
}

export const createPost = (content, formData) => async dispatch => {
  dispatch({type: LOADING_CREATE_POST})
  const reqBody = {
    query: `
      mutation{
        createPost(content:"${content}"){
          _id
          content
          likes{
            user
            post
            _id
          }
          creator{
            _id
            username
            imageUrl
          }
          comments{
            _id
            content
            createdAt
          }
          commentCount
          likeCount
          createdAt
        }
      }
    `
  }
  try {
    if(formData){
      console.log(formData)
      const resImageUrl = await axios.post(process.env.REACT_APP_API_URL+'/api/user/postImage', formData)
      if(resImageUrl.data.success){
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/postImageInput/${resImageUrl.data.postImageUrl}`, {content})
        dispatch({
          type: CREATE_POST,
          payload: res.data
        })
        dispatch({
          type: ADD_POST,
          payload: {
            ...res.data,
            creator: res.data.creator._id
          }
        })
      }
    }else{
      console.log(formData)
      const res = await axios.post(process.env.REACT_APP_API_URL+'/graphql', reqBody)
      dispatch({
        type: CREATE_POST,
        payload: res.data.data.createPost
      })
      dispatch({
        type: ADD_POST,
        payload: {
          ...res.data.data.createPost,
          creator: res.data.data.createPost.creator._id
        }
      })
    }
  } catch (error) {
    console.log(error);
  }
}
export const deletePost = (postId) => async dispatch => {
  dispatch({type:LOADING_DELETE_POST})
  await axios.delete(`${process.env.REACT_APP_API_URL}/api/post/${postId}`)
  dispatch({
    type: DELETE_POST,
    payload: postId
  })
}
export const likePost = (postId) => async dispatch => {
  dispatch({type: LOADING_LIKE})
  const reqBody = {
    query: `
      mutation{
        likePost(postId:"${postId}"){
          _id
          content
          postImageUrl
          creator{
            username
            imageUrl
            _id
          }
          comments{
            _id
            content
            username
            imageUrl
            userId
            postId
            createdAt
          }
          commentCount
          likeCount
          createdAt
        }
      }
    `
  } 
  try {
    const res = await axios.post(process.env.REACT_APP_API_URL+'/graphql', reqBody)
    dispatch({
      type:LIKE_POST,
      payload: res.data.data.likePost
    })
  } catch (error) {
    console.log("ERROR", error)
    console.log(error.message)
  }
}

export const unlikePost = (postId) => async dispatch => {
  dispatch({type: LOADING_LIKE})
  const reqBody = {
    query: `
      mutation{
        unlikePost(postId:"${postId}"){
          _id
          content
          postImageUrl
          creator{
            username
            imageUrl
            _id
          }
          comments{
            _id
            content
            username
            imageUrl
            userId
            postId
            createdAt
          }
          commentCount
          likeCount
          createdAt
        }
      }
    `
  }
  const res = await axios.post(process.env.REACT_APP_API_URL+'/graphql', reqBody)
  dispatch({
    type:UNLIKE_POST,
    payload: res.data.data.unlikePost
  })
}

export const addComment = (postId, content) => async dispatch => {
  dispatch({type:LOADING_COMMENT})
  const reqBody = {
    query:`
      mutation{
        addComment(commentInput:{postId:"${postId}", content:"${content}"}){
          _id
          content
          username
          imageUrl
          userId
          postId
          createdAt
        }
      }
    `
  }
  try {
    const res = await axios.post(process.env.REACT_APP_API_URL+'/graphql', reqBody)
    dispatch({
      type:ADD_COMMENT,
      payload: res.data.data.addComment
    })
  } catch (error) {
    console.log(error.message)
  }
}


const setAxiosHeaders = () => {
  axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
  axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET,POST,DELETE'
  axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'application/json'
}