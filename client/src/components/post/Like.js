import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {likePost,unlikePost} from '../../redux/actions/dataActions'
import ThumbUpRoundedIcon from '@material-ui/icons/ThumbUpRounded';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';

const Like = ({post, likeCount}) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const likedPost = () => {
    const liked = user.likes.find(like => like.post === post)
    if(user.likes.length > 0 && liked) return true
    else return false
  }
  const handleLike = () => {
    dispatch(likePost(post))
  }
  const handleUnlike = () => {
    dispatch(unlikePost(post))
  }
  const likeButton = !user.authenticated ? (
    <Tooltip title="Like" placement="top">
      <IconButton onClick={() => handleLike()} color="primary">
        <Badge color="primary" badgeContent={likeCount}>
          <ThumbUpOutlinedIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  ): (
    likedPost() ? (
      <Tooltip title="Unlike" placement="top">
        <IconButton onClick={handleUnlike} color="primary">
          <Badge color="primary" badgeContent={likeCount}>
            <ThumbUpRoundedIcon />
          </Badge>
        </IconButton>
      </Tooltip>): (
      <Tooltip title="Like" placement="top">
        <IconButton onClick={handleLike} color="primary">
          <Badge color="primary" badgeContent={likeCount}>
            <ThumbUpOutlinedIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      )
  )
  return likeButton
}

export default Like
