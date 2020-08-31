import { GET_POSTS, LIKE_POST, UNLIKE_POST, LOADING_DATA, ADD_COMMENT, CREATE_POST, DELETE_POST, LOADING_CREATE_POST, LOADING_DELETE_POST} from '../types'

const initialState = {
  posts:[],
  loading: false,
  loadingCreatePost: false,
  loadingDelete: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      }
    case LOADING_CREATE_POST:
      return {
        ...state,
        loadingCreatePost: true
      }
    case LOADING_DELETE_POST:
      return {
        ...state,
        loadingDelete: true
      }
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false
      }
    case CREATE_POST: 
      return{
        ...state,
        posts: [action.payload, ...state.posts],
        loadingCreatePost: false
      }
    case DELETE_POST: 
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload),
        loadingDelete: false
      }
    case ADD_COMMENT:
      const newPosts = state.posts.map(post => {
        if(post._id === action.payload.postId){
          return {...post, comments: [...post.comments,action.payload]}
        }
        return post
      })
      return{
        ...state,
        posts: newPosts
      }
    case LIKE_POST:
    case UNLIKE_POST:
      return {
        ...state,
        posts: state.posts.map(post => post._id === action.payload._id ? post = action.payload : post)
      }
    default:
      return state
  }
}