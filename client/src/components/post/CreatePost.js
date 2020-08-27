import React, { useState } from 'react'
import {withRouter} from 'react-router-dom'
//Redux
import {useDispatch, useSelector} from 'react-redux'
import {createPost} from '../../redux/actions/dataActions'
//MATERIAL UI
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment';
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar';
import {makeStyles} from '@material-ui/core/styles'
import { Typography, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  cards: {
    '& .content': {
      padding:0,
    },
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
  }
}))
const CreatePost = (props) => {
  const {credentials, authenticated} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [showButton, setShowButton] = useState("none")
  const [input, setInput] = useState("")
  const classes = useStyles()

  const handleSubmit = () => {
    if(input.trim() === ""){
      return
    }
    dispatch(createPost(input))
    setInput("")
    setShowButton("none")
  }
  return (
    credentials && 
    <Card style={{width: props.location.pathname !== '/' ? "60%" : ""}} className={classes.cards} elevation={3}>
    <CardContent className="content">
    <Typography className={classes.title} variant="subtitle2" gutterBottom>Create Post</Typography>
    <Divider/>
    <TextField 
      fullWidth 
      className={classes.input}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Avatar src={`${process.env.REACT_APP_API_URL}/${credentials?.imageUrl}`} className={classes.avatar}/>
          </InputAdornment>
        ),
      }}
      placeholder="What's on your mind?"
      name="content"
      value={input}
      onChange={e => setInput(e.target.value)}
      onFocus={() => setShowButton("")}
      onBlur={() => setTimeout(() => {setShowButton("none"); setInput("");},300)}
      />
      <Button style={{display:showButton}} onClick={handleSubmit} variant="contained" color="primary" size="small" fullWidth disabled={!authenticated}>{authenticated ? 'Post' : 'Please Login'}</Button>
    </CardContent>
  </Card>
  )
}

export default withRouter(CreatePost)
