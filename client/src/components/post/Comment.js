import React from 'react'
import {Link} from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ScrollToBottom from 'react-scroll-to-bottom'
//Material ui
import MuiLink from '@material-ui/core/Link'
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider'
const Comment = ({comment}) =>{ 
  dayjs.extend(relativeTime)
  let date;
  if(+comment.createdAt){
     date = new Date(+comment.createdAt).toISOString()
  }else{
     date = new Date(comment.createdAt).toISOString()
  }
  return(
    <ScrollToBottom style={{height: 300}}>
    <CardHeader
      avatar={
        <Avatar component={Link} to={`/user/${comment.userId}`} src={`http://localhost:4000/${comment.imageUrl}`}/>
      }
      title={<Typography variant="body2"><MuiLink component={Link} to={`/user/${comment.userId}`}>{comment.username}</MuiLink>: {comment.content}</Typography>}
      subheader={<Typography color="textSecondary" variant="caption" component="p">{dayjs(date).fromNow()}</Typography>}
    />
    <Divider/>
    </ScrollToBottom>
  )
}
export default Comment
