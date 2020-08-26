import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Comment from './Comment'
import Like from './Like'
//Redux
import {useSelector, useDispatch} from 'react-redux'
import {addComment} from '../../redux/actions/dataActions'
//MATERIAL UI
import {makeStyles} from '@material-ui/core/styles'
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
//ICONS
import AccountCircle from '@material-ui/icons/AccountCircle'
import SendIcon from '@material-ui/icons/Send';
import UnExpandIcon from '@material-ui/icons/CallReceived';
import CommentIcon from '@material-ui/icons/QuestionAnswer';

const useStyles = makeStyles(theme => ({
  cards:{
    margin: theme.spacing(3)
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: 0,
  },
  inputIcon: {
    marginRight: theme.spacing(1)
  }
}))

const ExpandPost = ({post, setExpandPost}) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const {creator, content, createdAt} = post
  const classes = useStyles()
  const [expanded, setExpanded] = useState(true);
  const [commentInput, setCommentInput] = useState("")
  dayjs.extend(relativeTime)

  const handleCommentSubmit = () => {
    if(commentInput.trim() !== ""){
      dispatch(addComment(post._id, commentInput))
      setCommentInput("")
    }else{
      setCommentInput("")
      return
    }
  }

  return (
    user.authenticated &&
    <>
      <Card className={classes.cards} >
        <CardHeader
          avatar={
            <Avatar component={Link} to={`/user/${creator._id}`} src={`${creator.imageUrl}`}/>
          }
          title={<MuiLink component={Link} to={`/user/${creator._id}`}>{creator.username}</MuiLink>}
          subheader={<Typography color="textSecondary" variant="caption" component="p">{dayjs(createdAt).fromNow()}</Typography>}
        />
        <CardContent>
          <Typography>{content}</Typography>
        </CardContent>
        <Divider/>
        <CardActions disableSpacing className={classes.actions}>
          <Like post={post._id} likeCount={post.likeCount}/>
          <IconButton
            onClick={() => setExpanded(!expanded)}
          >
            <Badge color="primary" badgeContent={post.commentCount}>
              <CommentIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={() => setExpandPost(false)}>
            <UnExpandIcon/>
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent style={{maxHeight: 160, overflow: 'auto',position: 'relative'}}>
              {post.comments.map(comment => <Comment comment={comment} key={comment._id}/> )}
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
                  {user.authenticated ? <Avatar className={classes.inputIcon} src={`${user.credentials.imageUrl}`}/> : <AccountCircle/>}
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
      </Card>
      </>
  )
}

export default ExpandPost
