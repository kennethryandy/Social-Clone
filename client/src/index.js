import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import axios from 'axios';
import jwtDecode from 'jwt-decode'
import {Provider} from 'react-redux'
import store from './redux/store'
import {SET_AUTH} from './redux/types'
import {logoutUser, getUserData} from './redux/actions/userActions'

const token = localStorage.userToken
if(token){
  const decodedToken = jwtDecode(token)
  if(decodedToken.exp * 4000 < Date.now()){
    console.log('Token expires')
    store.dispatch(logoutUser())
    window.location.href = '/login'
  }else{
    store.dispatch({type: SET_AUTH})
    axios.defaults.headers.common['Authorization'] = token
    store.dispatch(getUserData())
  }
}

ReactDOM.render(<Provider store={store}><App /></Provider>,document.getElementById('root'));