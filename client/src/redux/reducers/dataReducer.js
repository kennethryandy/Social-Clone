import { GET_POSTS, LIKE_POST, UNLIKE_POST, LOADING_DATA, ADD_COMMENT, CREATE_POST} from '../types'

const initialState = {
  posts:[],
  post: {},
  loading: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
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
        posts: [action.payload, ...state.posts]
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