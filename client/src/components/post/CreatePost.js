import React, { useState, useRef } from 'react'
import Picker from 'emoji-picker-react';
import {withRouter} from 'react-router-dom'
//Redux
import {useDispatch, useSelector} from 'react-redux'
import { createPost } from '../../redux/actions/dataActions'
//MATERIAL UI
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import InputAdornment from '@material-ui/core/InputAdornment';
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogContent'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import {makeStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
//ICONS
import PhotoIcon from '@material-ui/icons/PhotoSizeSelectActualOutlined';
import EmojiIcon from '@material-ui/icons/EmojiEmotions';

const useStyles = makeStyles(theme => ({
  cards: {
    '& button': {
      transition: 'all 3s ease'
    },
    margin: theme.spacing(3),
  },
  input: {
    '& textarea': {
      margin: '.7rem 1rem'
    },
  },
  inputIcon: {
    margin: `${theme.spacing(1)}px`
  },
  title: {
    margin: theme.spacing(1)
  },
  btnContainer: {
    margin: `2px ${theme.spacing(1)}px`
  },
  content: {
    padding: theme.spacing(2)
  },
  postImage: {
    width: '100%',
    height: 'auto',
    border: '1px solid #e9ebee',
    borderRadius: '.6rem'
  },
  postImgContainer: {
    width: 160,
    margin: '1rem auto 0 auto',
    cursor: 'pointer'
  },
}))
const CreatePost = (props) => {
  const state = useSelector(state => state.user)
  const post = useSelector(state => state.data)
  const {credentials, authenticated} = state
  const dispatch = useDispatch()
  const [postImage, setPostImage] = useState(null)
  const [input, setInput] = useState("")
  const [showButton, setShowButton] = useState("none")
  const [open, setOpen] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const anchorRef = useRef(null);
  const classes = useStyles()

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleSubmit = () => {
    if(postImage){
      const image = postImage.file
      const formData = new FormData();
      formData.append('uploadImage', image,image.name)
      dispatch(createPost(input, formData))
    }else{
      if(input.trim() === ""){
        return
      }
      dispatch(createPost(input))
    }
    setPostImage(null)
    setInput("")
    setShowButton(false)
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

  const handleOpenFile = () => {
    const fileInput = document.getElementById('imageInput')
    fileInput.click();
  }

  const handleImageChange = e => {
    if(e.target.files[0].type === "image/jpeg" || e.target.files[0].type === "image/png" || e.target.files[0].type === "image/gif"){
      setShowButton(true)
      setPostImage({img: URL.createObjectURL(e.target.files[0]), file: e.target.files[0]})
    }else{
      return
    }
  }

  const handleRemoveImage = () => {
    setPostImage(null)
    setOpenConfirmation(false)
  }

  return (
    credentials && state.allUsers ?
    (<>
    <Card style={{width: props.location.pathname !== '/' ? "60%" : ""}} className={classes.cards} elevation={3}>
    <Typography className={classes.title} variant="subtitle2" gutterBottom>Create Post</Typography>
    <Divider/>
    <TextField 
      fullWidth 
      multiline
      className={classes.input}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Avatar src={`${process.env.REACT_APP_API_URL}/api/user/img/${credentials?.imageUrl}`} style={{marginLeft: '8px'}}/>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleOpenFile}>
              <PhotoIcon/>
            </IconButton>
            <IconButton 
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}>
            <EmojiIcon/>
              </IconButton>
          </InputAdornment>
        )
      }}
      placeholder={`What's on your mind? ${credentials?.username?.split(" ")[0].charAt(0).toUpperCase() + credentials?.username?.split(" ")[0].slice(1)}`}
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
      <input hidden="hidden" type="file" id="imageInput" onChange={e => handleImageChange(e)} />
      {postImage && 
      <div onClick={() => setOpenConfirmation(true)} className={classes.postImgContainer}>
        <Tooltip title="Remove item">
          <img src={postImage.img} className={classes.postImage}/>
        </Tooltip>
      </div>
      }
      <CardContent classes={{root: classes.content}}>
        <div className={classes.btnContainer} style={{display:showButton}}>
          <Button onClick={handleSubmit} variant="contained" color="primary" size="small" fullWidth disabled={!authenticated || post?.loadingCreatePost}>{post?.loadingCreatePost ? <LinearProgress color="secondary"/> : 'Post'}</Button>
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
    <Dialog
      open={openConfirmation}
      onClose={() => setOpenConfirmation(false)}
    >
    <DialogTitle>{"Delete post?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this post?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenConfirmation(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleRemoveImage} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
    </>):
    <h1>loading</h1>
  )
}

export default withRouter(CreatePost)
