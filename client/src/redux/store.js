import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'

import dataReducer from './reducers/dataReducer'
import userReducer from './reducers/userReducer'
import uiReducer from './reducers/uiReducer'

const initialState = {};
const middleware = [thunk]

const reducers = combineReducers({
  data: dataReducer,
  user: userReducer,
  UI: uiReducer
})

export default createStore(
  reducers, 
  initialState, 
  compose(
    applyMiddleware(...middleware)
  )
)