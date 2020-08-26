import React from 'react'
//Material ui
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import {makeStyles} from '@material-ui/core/styles'
//Material Icons
import ArrowLeftIcon from '@material-ui/icons/ChevronLeft';
import SideProfile from '../profile/SideProfile'

const useStyles = makeStyles(theme => ({
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
}))

const AppbarBurger = ({open}) => {
  const classes = useStyles()
  return (
    <>
    <div className={classes.drawerHeader}>
      <IconButton onClick={() => open(false)}>
        <ArrowLeftIcon/>
      </IconButton>
    </div>
    <Divider />
    <SideProfile/>
    </>
  )
}

export default AppbarBurger
