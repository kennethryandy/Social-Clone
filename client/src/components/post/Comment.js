import React,{forwardRef} from 'react'
import {Link} from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
//Material ui
import MuiLink from '@material-ui/core/Link'
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider'
const Comment = forwardRef(({comment},ref) =>{ 
  dayjs.extend(relativeTime)
  let date;
  if(+comment.createdAt){
     date = new Date(+comment.createdAt).toISOString()
  }else{
     date = new Date(comment.createdAt).toISOString()
  }
  return(
    comment && 
    <>
    <CardHeader
      ref={ref}
      avatar={
        <Avatar component={Link} to={`${process.env.REACT_APP_API_URL}/user/${comment.userId}`} src={`${process.env.REACT_APP_API_URL}/api/user/img/${comment.imageUrl}`}/>
      }
      title={<Typography variant="body2"><MuiLink component={Link} to={`/user/${comment.userId}`}>{comment.username}</MuiLink>: {comment.content}</Typography>}
      subheader={<Typography color="textSecondary" variant="caption" component="p">{dayjs(date).fromNow()}</Typography>}
    />
    <Divider/>
    </>
  )
})
export default Comment
