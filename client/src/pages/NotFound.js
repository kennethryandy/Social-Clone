import React from 'react'
import {Link} from 'react-router-dom'
import brokenImg from '../assests/brokenLike.jpg'
import {makeStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import MuiLink from '@material-ui/core/Link'
const useStyles = makeStyles(theme => ({
  mainWrapper: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
}))

const NotFound = () => {
  const classes = useStyles()
  return (
    <div className={classes.mainWrapper}>
      <img src={brokenImg} />
      <Typography style={{margin:"1rem 0"}} variant="h3" color="primary">Sorry! we can't find this page.</Typography>
      <Typography variant="h5"><MuiLink component={Link} to='/'>Go back</MuiLink></Typography>
    </div>
  )
}

export default NotFound