import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_UNAUTH, LOADING_USER, EDIT_USER_DETAILS, LOADING_USER_DETAILS, LOADING_PROFILE_PICTURE, GET_USER, MARKED_NOTIFICATIONS_READ } from '../types'
import axios from 'axios'
import { getAllPosts } from './dataActions'

export const uploadImage = (formData) => async dispatch => {
  try {
    await axios.post(process.env.REACT_APP_API_URL+'/api/user/uploadImage', formData)
    dispatch({type:LOADING_PROFILE_PICTURE})
    dispatch(getUserData())
    dispatch(getAllPosts())
  } catch (error) {
    console.log(error.message)
  }
}

export const loginUser = (userData, history) => async dispatch => {
  dispatch({type: LOADING_UI})
  try {
    const res = await axios.post(process.env.REACT_APP_API_URL+'/graphql', userData)
    setAuthorizationHeaders(res.data.data.login.token)
    dispatch(getUserData())
    dispatch({type: CLEAR_ERRORS})
    history.push('/')
  } catch (error) {
    if(error.response && error.response.data && error.response.data.errors){
      dispatch({type: SET_ERRORS, payload: error.response.data.errors[0].message})
    }else{
      dispatch({type:SET_ERRORS, payload: "Please try again."})
    }
  }
}

export const signupUser = (newUser, history) => async dispatch => {
  dispatch({type: LOADING_UI})
  try {
    const res = await axios.post(process.env.REACT_APP_API_URL+'/graphql', newUser)
    setAuthorizationHeaders(res.data.data.signup.token)
    dispatch(getUserData())
    dispatch({type: CLEAR_ERRORS})
    history.push('/')
  } catch (error) {
    if(error.response && error.response.data && error.response.data.errors){
      dispatch({type: SET_ERRORS, payload: error.response.data.errors[0].message})
    }else{
      dispatch({type:SET_ERRORS, payload: "Please try again."})
    }
  }
}

export const logoutUser = () => dispatch => {
  localStorage.removeItem('userToken')
  delete axios.defaults.headers.common['Authorization']
  dispatch({type: SET_UNAUTH})
}

export const getUserData = () => async dispatch => {
  dispatch({type: LOADING_USER})
  try {
    const res = await axios.get(process.env.REACT_APP_API_URL+'/api/user')
    dispatch({
      type: SET_USER,
      payload: res.data
    })
  } catch (error) {
    console.log(error)
  }
}

export const editUserDetails = (userDetails) => async dispatch => {
  const reqBody = {
    query: `
      mutation{
        editUserDetails(userDetails:{bio:"${userDetails.bio}" location:"${userDetails.location}" status: "${userDetails.status}"}){
          bio
          location
          status
        }
      }
    `
  }
  try {
    const res = await axios.post(process.env.REACT_APP_API_URL+'/graphql', reqBody)
    dispatch({type:LOADING_USER_DETAILS})
    dispatch({
      type:EDIT_USER_DETAILS,
      payload: res.data.data.editUserDetails
    })
  } catch (error) {
    console.log(error)
  }
}

export const getUser = id => async dispatch => {
  dispatch({type:LOADING_USER})
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${id}`)
    dispatch({
      type: GET_USER,
      payload: res.data
    })
  } catch (error) {
    console.log(error)
      // dispatch({
      //   type:SET_ERRORS,
      //   payload: error.response.data.errors[0].message
      // })
  }
}

export const markedNotif = (userId) => async dispatch => {
  try {
    await axios.post(process.env.REACT_APP_API_URL+'/api/user/notifications', {userId})
    dispatch({
      type: MARKED_NOTIFICATIONS_READ
    })
  } catch (error) {
    console.log(error.message)
  }
}

const setAuthorizationHeaders = token => {
  const userToken = `Bearer ${token}`
  localStorage.setItem('userToken', userToken)
  axios.defaults.headers.common['Authorization'] = userToken
}