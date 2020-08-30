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

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

export default createStore(
  reducers, 
  initialState, 
  composeEnhancers(
    applyMiddleware(...middleware)
  )
)