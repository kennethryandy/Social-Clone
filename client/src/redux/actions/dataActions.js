import { GET_POSTS, LIKE_POST, UNLIKE_POST,ADD_COMMENT,
  CREATE_POST, LOADING_DATA, ADD_POST} from '../types'
import axios from 'axios'
export const getAllPosts = () => async dispatch => {
  dispatch({type:LOADING_DATA})
  try {
    const reqBody = {
      query: `
        query{
          posts{
            _id
            content
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
    const res = await axios.post('/graphql',reqBody)
    dispatch({
      type:GET_POSTS,
      payload: res.data.data.posts
    })
  } catch (error) {
    console.error(error)
  }
}

export const createPost = (content) => async dispatch => {
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
    const res = await axios.post('/graphql', reqBody)
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
  } catch (error) {
    console.log(error);
  }
}


export const likePost = (postId) => async dispatch => {
  const reqBody = {
    query: `
      mutation{
        likePost(postId:"${postId}"){
          _id
          content
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
    const res = await axios.post('/graphql', reqBody)
    console.log("DATA: ",res)
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
  const reqBody = {
    query: `
      mutation{
        unlikePost(postId:"${postId}"){
          _id
          content
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
  const res = await axios.post('/graphql', reqBody)
  dispatch({
    type:UNLIKE_POST,
    payload: res.data.data.unlikePost
  })
}

export const addComment = (postId, content) => async dispatch => {
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
    const res = await axios.post('/graphql', reqBody)
    dispatch({
      type:ADD_COMMENT,
      payload: res.data.data.addComment
    })
  } catch (error) {
    console.log("ERROR", error)
    console.log(error.message)
  }
}
