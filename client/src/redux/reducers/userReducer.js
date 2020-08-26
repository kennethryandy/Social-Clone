import { SET_USER, SET_AUTH, SET_UNAUTH, LOADING_USER, LIKE_POST, UNLIKE_POST, EDIT_USER_DETAILS, LOADING_PROFILE_PICTURE, LOADING_USER_DETAILS, GET_USER, ADD_POST, ADD_COMMENT, MARKED_NOTIFICATIONS_READ } from '../types'

const initialState = {
  authenticated: false,
  loading: false,
  loadingUserDetails: false,
  loadingProfile: false,
  credentials: {},
  getUser: {},
  likes: [],
  notifications: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH:
      return {
        ...state,
        authenticated: true
      }
    case SET_UNAUTH:
      return {
        initialState
      }
    case LOADING_PROFILE_PICTURE: 
    return {
      ...state,
      loadingProfile: true
    }
    case SET_USER:
      return {
        ...state,
        ...action.payload,
        authenticated: true,
        loading: false,
        loadingProfile: false
      }
    case LOADING_USER:
      return {
        ...state,
        loading: true
      }
    case LIKE_POST:
      return{
        ...state,
        likes: [
          ...state.likes,
          {
            user: state.credentials._id,
            post: action.payload._id
          }
        ]
      }
    case UNLIKE_POST:
      return {
        ...state,
        likes: state.likes.filter(like => like.post !== action.payload._id)
      }
    case LOADING_USER_DETAILS:
      return {
        ...state,
        loadingUserDetails: true
      }
    case EDIT_USER_DETAILS:
      return {
        ...state,
        credentials: {...state.credentials, bio: action.payload.bio, location: action.payload.location, status: action.payload.status},
        loadingUserDetails: false
      }
    case GET_USER:
      return {
        ...state,
        getUser: action.payload,
        loading: false
      }
    case ADD_POST:
      return {
        ...state,
        credentials: {
          ...state.credentials,
          posts: [action.payload, ...state.credentials.posts]
        }
      }
    case ADD_COMMENT:
      const newComment = state.credentials.posts.map(post => {
        if(post._id === action.payload.postId){
          return {...post, comments: [...post.comments,action.payload]}
        }
        return post
      })
      return {
        ...state,
        credentials: {
          ...state.credentials,
          posts: newComment
        }
      }
    case MARKED_NOTIFICATIONS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notif => ({...notif, read: true}))
      }
    default:
      return state
  }
}