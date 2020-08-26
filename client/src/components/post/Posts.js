import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Comment from './Comment'
import Like from './Like'
import ExpandPost from './ExpandPost'
//Redux
import {useSelector, useDispatch} from 'react-redux'
import {addComment} from '../../redux/actions/dataActions'
//MATERIAL UI
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'
import MuiLink from '@material-ui/core/Link'
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment';
import Badge from '@material-ui/core/Badge';
import Zoom from '@material-ui/core/Zoom';
//ICONS
import AccountCircle from '@material-ui/icons/AccountCircle'
import SendIcon from '@material-ui/icons/Send';
import ExpandIcon from '@material-ui/icons/CallMade';
import CommentIcon from '@material-ui/icons/QuestionAnswer';
import CloseIcon from '@material-ui/icons/Close'

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
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}))

const Posts = ({post}) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const {loading} = useSelector(state => state.data)
  const {creator, content, createdAt} = post
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false);
  const [expandPost, setExpandPost] = useState(false)
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
    !loading && (
      <>
      <Card className={classes.cards} elevation={2}>
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
          <IconButton onClick={() => setExpandPost(true)}>
            <ExpandIcon/>
          </IconButton>
          <Dialog TransitionComponent={Zoom} maxWidth="sm" open={expandPost} onClose={() => setExpandPost(false)}>
            <IconButton aria-label="close" className={classes.closeButton} onClick={() => setExpandPost(false)}>
                <CloseIcon />
            </IconButton>
            <ExpandPost post={post} setExpandPost={setExpandPost}/>
          </Dialog>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent style={{maxHeight: 300, overflow: 'auto',position: 'relative'}}>
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
  )
}

export default Posts
