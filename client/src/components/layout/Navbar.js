import React,{useState, useRef} from 'react'
import {NavLink} from 'react-router-dom'
import Notifications from './Notifications'
import AppbarBurger from './AppbarBurger'
//REDUX
import {useDispatch, useSelector} from 'react-redux'
import {logoutUser} from '../../redux/actions/userActions'
//MATERIAL UI
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Drawer from '@material-ui/core/Drawer'
import Grow from '@material-ui/core/Grow';
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MuiLink from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
//ICONS
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import ArrowRightIcon from '@material-ui/icons/ChevronRight';
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  drawerPaper: {
    width: 240,
  },
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  brand: {
    fontSize: '1rem',
    fontWeight: 600,
    [theme.breakpoints.down('xs')]: {
      fontSize: '.7rem'
    },
  },
  navLink: {
    margin: '0 8px',
    borderRadius: '0',
    borderRight: '1px solid #e9ebee',
    height: theme.spacing(2)
  },
  NavLinks: {
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  }
}));

const Navbar = () => {
  const state = useSelector(state => state.user)
  const {credentials, authenticated, loading} = state
  const dispatch = useDispatch()
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(false)
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if(event){
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
    }

    setOpen(false);
  };
  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }
  return (
    <>
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <div className={classes.title}>
          {!loading && 
          <Hidden smUp>
          <IconButton color='inherit' edge="start" onClick={() => setOpenSideBar(true)}>
            <ArrowRightIcon/>
          </IconButton>
        </Hidden>}
          <Button color="inherit" component={NavLink} to="/">
            <Typography variant="h6" className={classes.brand} >
              Social Clone
            </Typography>
          </Button>
          </div>
          {authenticated ? (
          <>
            <div className={classes.NavLinks}>
              <Button className={classes.navLink} color="inherit" component={NavLink} to="/">Home</Button>
              <Button className={classes.navLink} color="inherit" component={NavLink} to={state ? `/user/${credentials?._id}` : '/'}>{!loading ? credentials.username : 'PROFILE'}</Button>
            </div>
            <Notifications />
            <IconButton ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle} color="inherit">
              <ExpandMoreIcon/>
            </IconButton>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                      <MenuItem>
                        <MuiLink onClick={handleClose} component={NavLink} to="/">Home</MuiLink>
                      </MenuItem>
                      <MenuItem><MuiLink onClick={handleClose} component={NavLink} to={state ? `/user/${credentials._id}` : '/'}>Profile</MuiLink></MenuItem>
                      <MenuItem>
                        <MuiLink onClick={() => {
                            handleClose()
                            dispatch(logoutUser())
                          }} 
                          component={NavLink}  
                          to="/login">
                          Logout
                        </MuiLink>
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          </>
          ) : (
          <>
            <Button color="inherit" component={NavLink} to="/Login">Login</Button>
            <Button color="inherit" component={NavLink} to="/Signup">Signup</Button>
          </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer classes={{paper: classes.drawerPaper}} open={openSideBar} onClose={() => setOpenSideBar(false)}>
        <AppbarBurger open={setOpenSideBar}/>
      </Drawer>
    </div>
    <div className={classes.appBarSpacer}></div>
  </>
  )
}

export default Navbar