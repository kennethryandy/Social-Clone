import React, { useState, useRef } from 'react'
import Picker from 'emoji-picker-react';
import {withRouter} from 'react-router-dom'
//Redux
import {useDispatch, useSelector} from 'react-redux'
import {createPost} from '../../redux/actions/dataActions'
//MATERIAL UI
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment';
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton'
import {makeStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import EmojiIcon from '@material-ui/icons/EmojiEmotions';

const useStyles = makeStyles(theme => ({
  cards: {
    '& button': {
      transition: 'ease 3s'
    },
    margin: theme.spacing(3),
  },
  input: {
    '& input': {
      height: `${theme.spacing(1)}vh`
    },
  },
  inputIcon: {
    margin: `${theme.spacing(1)}px`
  },
  title: {
    margin: theme.spacing(1)
  },
  avatar: {
    margin: `0 ${theme.spacing(2)}px`
  },
  btnContainer: {
    margin: `2px ${theme.spacing(1)}px`
  },
  content: {
    padding: theme.spacing(2)
  },
}))
const CreatePost = (props) => {
  const {credentials, authenticated} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [input, setInput] = useState("")
  const [showButton, setShowButton] = useState("none")
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const classes = useStyles()

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleSubmit = () => {
    if(input.trim() === ""){
      return
    }
    dispatch(createPost(input))
    setInput("")
  }

  const onEmojiClick = (event, emojiObject) => {
    setInput(prevState => prevState + emojiObject.emoji)
    setShowButton("")
    if(event){
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
    }
    setOpen(false);
  };

  return (
    credentials && 
    <>
    <Card style={{width: props.location.pathname !== '/' ? "60%" : ""}} className={classes.cards} elevation={3}>
    <Typography className={classes.title} variant="subtitle2" gutterBottom>Create Post</Typography>
    <Divider/>
    <TextField 
      fullWidth 
      className={classes.input}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Avatar src={`${process.env.REACT_APP_API_URL}/api/user/img/${credentials?.imageUrl}`} className={classes.avatar}/>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton 
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}>
            <EmojiIcon className={classes.avatar}/>
            </IconButton>
          </InputAdornment>
        )
      }}
      placeholder="What's on your mind?"
      name="content"
      value={input}
      onChange={e => setInput(e.target.value)}
      onFocus={() => setShowButton("")}
      onBlur={() => {
        if(!input){
          setTimeout(() => {setShowButton("none"); setInput("");},300)
        }
      }}
      />
      <CardContent classes={{root: classes.content}}>
      <div className={classes.btnContainer} style={{display:showButton}}>
        <Button onClick={handleSubmit} variant="contained" color="primary" size="small" fullWidth disabled={!authenticated}>{authenticated ? 'Post' : 'Please Login'}</Button>
      </div>
      </CardContent>
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
  </>
  )
}

export default withRouter(CreatePost)
