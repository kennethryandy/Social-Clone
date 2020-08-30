import React,{ useEffect, useState, useRef, forwardRef } from 'react'
import FlipMove from 'react-flip-move'
import Picker from 'emoji-picker-react';
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
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ListItemText from '@material-ui/core/ListItemText'
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
import Popper from '@material-ui/core/Popper'
import Grow from '@material-ui/core/Grow'
import Zoom from '@material-ui/core/Zoom';
//ICONS
import AccountCircle from '@material-ui/icons/AccountCircle'
import SendIcon from '@material-ui/icons/Send';
import ExpandIcon from '@material-ui/icons/CallMade';
import CommentIcon from '@material-ui/icons/QuestionAnswer';
import CloseIcon from '@material-ui/icons/Close'
import EmojiIcon from '@material-ui/icons/EmojiEmotions';
import MoreIcon from '@material-ui/icons/MoreHoriz';
import DeleteIcon from '@material-ui/icons/Clear';
import ExpandOptionIcon from '@material-ui/icons/AspectRatio';

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
  lists: {
    padding:0,
    margin:0
  }
}))

const Posts = forwardRef(({post}, ref) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const {loading} = useSelector(state => state.data)
  const {creator, content, createdAt} = post
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false);
  const [expandPost, setExpandPost] = useState(false)
  const [commentInput, setCommentInput] = useState("")
  const [open, setOpen] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const anchorRef = useRef(null);
  const anchorSetting = useRef(null)
  const messagesEndRef = useRef(null)
  dayjs.extend(relativeTime)

  const scrollToBottom = () => {
   if(messagesEndRef && messagesEndRef.current && messagesEndRef.current.scrollIntoView){
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
   }
  }

  useEffect(scrollToBottom);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const onEmojiClick = (event, emojiObject) => {
    setCommentInput(prevState => prevState + emojiObject.emoji)
    if(event){
      if (anchorSetting.current && anchorSetting.current.contains(event.target)) {
        return;
      }
    }
    setOpen(false);
  };

  const handleClose = (event) => {
    if(event){
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
    }
    setOpenMore(false);
  };

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
      <Card ref={ref} className={classes.cards} elevation={2}>
        <CardHeader
          avatar={
            <Avatar component={Link} to={`/user/${creator._id}`} src={`${process.env.REACT_APP_API_URL}/api/user/img/${creator.imageUrl}`}/>
          }
          action={
            <IconButton 
              onClick={() => setOpenMore(prevState => !prevState)}
              ref={anchorSetting}
              aria-controls={openMore ? 'menu-list-grow' : undefined}
              aria-haspopup="true">
              <MoreIcon />
            </IconButton>
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
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent style={{maxHeight: '300px', overflowY: 'scroll'}}>
            <FlipMove>
              {post.comments.map(comment => <Comment comment={comment} key={comment._id}/> )}
              <div ref={messagesEndRef} />
            </FlipMove>
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
                  {user.authenticated ? <Avatar className={classes.inputIcon} src={`${process.env.REACT_APP_API_URL}/api/user/img/${user.credentials.imageUrl}`}/> : <AccountCircle/>}
                </InputAdornment>
              ),
              endAdornment:( 
                <InputAdornment position="end">
                  <IconButton 
                  ref={anchorRef}
                  aria-controls={open ? 'menu-list-grow' : undefined}
                  aria-haspopup="true"
                  onClick={handleToggle}>
                    <EmojiIcon className={classes.avatar}/>
                  </IconButton>
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
      <Popper style={{zIndex: 9999}} placement='bottom-end' open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          style={{ transformOrigin: 'right top'}}
        >
            <Picker onEmojiClick={onEmojiClick} disableSearchBar disableSkinTonePicker/>
        </Grow>
        )}
      </Popper>
      <Popper style={{zIndex: 9999}} placement='bottom-end' open={openMore} anchorEl={anchorSetting.current} role={undefined} transition disablePortal>
          {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          style={{ transformOrigin: 'right top'}}
        >
          <Paper elevation={3}>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList className={classes.lists} autoFocusItem={openMore} id="menu-list-grow">
                <MenuItem onClick={handleClose}>
                  <ExpandOptionIcon onClick={() => {
                    setExpandPost(true) 
                    handleClose()
                    }} 
                    fontSize="small" 
                    style={{color: "rgba(0, 0, 0, 0.54)", marginRight: "8px"}}/>
                  <ListItemText secondary="Expand"/>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <DeleteIcon fontSize="small" style={{color: "rgba(0, 0, 0, 0.54)", marginRight: "8px"}}/>
                  <ListItemText secondary="Delete"/>
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
        )}
      </Popper>
      <Dialog TransitionComponent={Zoom} maxWidth="sm" open={expandPost} onClose={() => setExpandPost(false)}>
        <IconButton aria-label="close" className={classes.closeButton} onClick={() => setExpandPost(false)}>
          <CloseIcon />
        </IconButton>
        <ExpandPost post={post} imageUrl={creator.imageUrl} username={creator.username} setExpandPost={setExpandPost}/>
      </Dialog>
      </>
    )
  )
})

export default Posts