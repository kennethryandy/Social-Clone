import React,{useState} from 'react'
import Comment from '../post/Comment'
import ExpandPost from '../post/ExpandPost'
import Like from '../post/Like'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {Link} from 'react-router-dom'
//Redux
import { useDispatch, useSelector } from 'react-redux'
import {addComment} from '../../redux/actions/dataActions'
//Material ui
import {postsStyles} from './profileStyles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography'
import MuiLink from '@material-ui/core/Link'
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider'
import Collapse from '@material-ui/core/Collapse'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment';
import Badge from '@material-ui/core/Badge';
import Dialog from '@material-ui/core/Dialog'
import Zoom from '@material-ui/core/Zoom';
//ICONS
import AccountCircle from '@material-ui/icons/AccountCircle'
import SendIcon from '@material-ui/icons/Send';
import ExpandIcon from '@material-ui/icons/CallMade';
import CommentIcon from '@material-ui/icons/QuestionAnswer';
import CloseIcon from '@material-ui/icons/Close'

const UserPosts = ({posts, username, imageUrl, _id}) => {
  const classes = postsStyles()
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const [expanded, setExpanded] = useState(false);
  const [commentInput, setCommentInput] = useState("")
  const [expandPost, setExpandPost] = useState(false)
  dayjs.extend(relativeTime)

  const handleCommentSubmit = () => {
    if(user.authenticated){
      if(commentInput.trim() !== ""){
        dispatch(addComment(posts._id, commentInput))
        setCommentInput("")
      }else{
        setCommentInput("")
        return
      }
    }else{
      return
    }
  }
  return(
    posts ?(
    <Card className={classes.cards} elevation={2}>
        <CardHeader
          avatar={
            <Avatar src={`${process.env.REACT_APP_API_URL}/${imageUrl}`}/>
          }
          title={<MuiLink component={Link} to={`/user/${_id}`}>{username}</MuiLink>}
          subheader={<Typography color="textSecondary" variant="caption" component="p">{dayjs(posts.createdAt).fromNow()}</Typography>}
        />
        <CardContent>
          <Typography>{posts.content}</Typography>
        </CardContent>
        <Divider/>
        <CardActions disableSpacing className={classes.actions}>
          <Like post={posts._id} likeCount={posts.likeCount}/>
          <IconButton
            onClick={() => setExpanded(!expanded)}
          >
            <Badge color="primary" badgeContent={posts.commentCount}>
              <CommentIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={() => setExpandPost(true)}>
            <ExpandIcon/>
          </IconButton>
          <Dialog TransitionComponent={Zoom} maxWidth="sm" open={expandPost} onClose={() => setExpandPost(false)}>
            <IconButton aria-label="close" className={classes.closeButton} onClick={() => setExpandPost(false)}>
              <CloseIcon />
            </IconButton>
            <ExpandPost post={posts} imageUrl={imageUrl} username={username} setExpandPost={setExpandPost}/>
          </Dialog>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent style={{maxHeight: 300, overflow: 'auto',position: 'relative'}}>
              {posts.comments && posts.comments.map(comment => <Comment comment={comment} key={comment._id}/> )}
            </CardContent>
          <TextField
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            variant="outlined"
            type="text" 
            fullWidth 
            placeholder="Add comment"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {user.authenticated ? <Avatar className={classes.inputIcon} src={`${process.env.REACT_APP_API_URL}/${user.credentials.imageUrl}`}/> : <AccountCircle/>}
                </InputAdornment>
              ),
              endAdornment:( 
                <InputAdornment position="end">
                  <IconButton disabled={!user.authenticated} onClick={handleCommentSubmit}>
                    <SendIcon color="primary" className={classes.inputIcon}/>
                  </IconButton>
                </InputAdornment>
              )
            }}
            onKeyDown={e => {
                if(e.keyCode === 13){
                  handleCommentSubmit(e)
                }
              }
            }
            disabled={!user.authenticated}
          />
        </Collapse>
      </Card>): (
        <p>No posts</p>
      )
  )
}

export default UserPosts
