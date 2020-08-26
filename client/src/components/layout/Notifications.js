import React,{useState, useRef} from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ExpandPost from '../post/ExpandPost' 
//Redux
import {useDispatch, useSelector} from 'react-redux'
import {markedNotif} from '../../redux/actions/userActions'
//Material ui
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip'
import Zoom from '@material-ui/core/Zoom';
import Dialog from '@material-ui/core/Dialog'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Avatar from '@material-ui/core/Avatar'
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import {makeStyles} from '@material-ui/core/styles'
//Material icons
import NotificationsIcon from '@material-ui/icons/Notifications';
import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}))

const Notifications = () => {
  const classes = useStyles()
  const state = useSelector(state => state.user)
  const notifications = state.notifications
  const posts = useSelector(state => state.data.posts)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [expandPost, setExpandPost] = useState(false)
  const [post, setPost] = useState({})
  dayjs.extend(relativeTime)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    const marked = notifications.length > 0 && notifications.filter(notif => notif.read === false)
    if(marked.length > 0){
      dispatch(markedNotif(state.credentials._id))
    }
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

  const handleExpandPost = (id) => {
    const postExist = posts.find(post => post._id === id)
    if(postExist){
      setPost(postExist)
      setExpandPost(true)
    }
    handleClose()
  }
  const unreadNotif = notifications.filter(notif => notif.read === false)
  const notificationsIcon = notifications && notifications.length > 0 ? (
    unreadNotif && unreadNotif.length > 0 ? (
      <Badge badgeContent={unreadNotif.length} color='inherit'>
        <NotificationsIcon color="secondary"/>
      </Badge>
    ) : (
      <NotificationsIcon />
    )
  ) : (
    <NotificationsIcon />
  )
  return (
    <>
      <Tooltip title="notifications">
        <IconButton ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          color="inherit">
          {notificationsIcon}
        </IconButton>
      </Tooltip>
      <Popper placement='bottom-end' open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: 'right top'}}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  {notifications && notifications.length > 0 ? (
                  notifications.map(notif => {
                    const verb = notif.type === 'like' ? 'liked' : 'commented on'
                    const time = dayjs(notif.createdAt).fromNow()
                    const textColor = notif.read ? 'textSecondary' : 'primary'
                    return (
                      <MenuItem onClick={() => {
                        handleClose()
                        handleExpandPost(notif.postId)
                        }} 
                        key={notif._id}>
                        <ListItemAvatar>
                          <Avatar alt={notif.sender} src={`/${notif.imageUrl}`} />
                        </ListItemAvatar>
                        <ListItemText color={textColor} primary={`${notif.sender} ${verb} you post.`} secondary={time}/>
                      </MenuItem>
                    )
                  })
                ) : (
                  <MenuItem>
                    <ListItemText primary="You have no notification."/>
                  </MenuItem>
                )}
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
        {post && <ExpandPost post={post} setExpandPost={setExpandPost}/>}
      </Dialog>
    </>
  )
}

export default Notifications
