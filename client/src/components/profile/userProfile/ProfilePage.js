import React,{useEffect, useState} from 'react'
import UserPosts from '../UserPosts'
//Redux
import { useDispatch, useSelector } from 'react-redux';
import {uploadImage} from '../../../redux/actions/userActions'
//Material ui
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
// import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
// import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import {profileStyles} from '../profileStyles/'

//ICONS
import InfoIcon from '@material-ui/icons/Info';
import HomeIcon from '@material-ui/icons/Home';
import FavoriteIcon from '@material-ui/icons/Favorite';
// import EditIcon from '@material-ui/icons/Edit';
import EditProfileDetails from '../EditProfileDetails';
import CreatePost from '../../post/CreatePost';


const ProfilePage = () => {
  const dispatch = useDispatch()
  const state = useSelector(state => state.user)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const classes = profileStyles()

  useEffect(() => {
    if(state) setLoading(false)
  // eslint-disable-next-line
  },[])
  const handleImageChange = e => {
    const image = e.target.files[0]
    const formData = new FormData();
    formData.append('uploadImage', image,image.name)
    dispatch(uploadImage(formData))
  }

  const handleEditPicture = () => {
    const fileInput = document.getElementById('imageInput')
    fileInput.click();
  }
  const { loadingProfile, loadingUserDetails, credentials } = state
  return (
    !loading ? (
    <div className={classes.profileContainer}>
      <Card elevation={3} className={classes.card}>
        <input hidden="hidden" type="file" id="imageInput" onChange={e => handleImageChange(e)} />
        {/* <CardHeader 
          action={
            <Tooltip title="Edit cover photo">
              <IconButton disabled>
                <EditIcon color="primary" />
              </IconButton>
            </Tooltip>
          }
        /> */}
        <CardActionArea onClick={handleEditPicture} className={classes.imageButton}>
          {!loadingProfile ? (
            <Tooltip title="Edit profile picture" placement="top">
              <CardMedia 
                component="img"
                image={`${process.env.REACT_APP_API_URL}/${credentials.imageUrl}`}
                className={classes.profileImage}
              />
            </Tooltip>) : (
              <CardMedia 
                component="img"
                image={`${process.env.REACT_APP_API_URL}/uploads/default-profile-pic.png`}
                className={classes.profileImage}
              />
            )
          }
          
        </CardActionArea>
        <CardContent className={classes.cardContent}>
          <Typography color="primary" className={classes.title} gutterBottom variant="h4" component="h3">
            {credentials.username}
          </Typography>
          {!loadingUserDetails ? (
            <List className={classes.userDetails}>
            {credentials.bio ? (
            <>
              <Divider/>
              <ListItem>
                <ListItemIcon className={classes.icons}>
                  <InfoIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary={<Typography variant="body1" color="secondary">Bio: <span style={{color:'black'}}>{credentials.bio}</span></Typography>}/>
              </ListItem>
            </>) : (
            <>
              <Divider/>
              <ListItem>
                <ListItemIcon className={classes.icons}>
                  <InfoIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary={<Typography variant="body1" color="secondary">Bio: <span style={{color:'rgba(0, 0, 0, 0.54)'}}>Edit your bio</span></Typography>}/>
              </ListItem>
            </>
            )
            }
            {credentials.location ? (
            <>
              <Divider/>
              <ListItem>
              <ListItemIcon className={classes.icons}>
                <HomeIcon color="primary"/>
              </ListItemIcon>
                <ListItemText primary={<Typography variant="body1" color="secondary">Lives at <span style={{color:'black'}}>{credentials.location}</span></Typography>}/>
              </ListItem>
            </>) : (
            <>
              <Divider/>
              <ListItem>
              <ListItemIcon className={classes.icons}>
                  <HomeIcon color="primary"/>
              </ListItemIcon>
                <ListItemText primary={<Typography variant="body1" color="secondary">Location: <span style={{color:'rgba(0, 0, 0, 0.54)'}}>Where are you from.</span></Typography>}/>
              </ListItem>
            </>
            )
            }
            {credentials.status ? (
            <>
              <Divider/>
              <ListItem>
                <ListItemIcon className={classes.icons}>
                  <FavoriteIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary={<Typography variant="body1" color="secondary">Relationship Status: <span style={{color:'black'}}>{credentials.status}</span></Typography>}/>
              </ListItem>
            </>) : (
            <>
              <Divider/>
              <ListItem>
                <ListItemIcon className={classes.icons}>
                  <FavoriteIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary={<Typography variant="body1" color="secondary">Status: <span style={{color:'rgba(0, 0, 0, 0.54)'}}>What is your current relationship status</span></Typography>}/>
              </ListItem>
            </>
            )
            }
            <Button onClick={() => setOpen(true)} size="large" variant="outlined" color="primary">Edit</Button>
          </List>
          ) : (
            <p>loading...</p>
          )}
        </CardContent>
      </Card>
      <EditProfileDetails open={open} setOpen={setOpen}/>
      <CreatePost/>
      {credentials.posts && 
      credentials.posts.map(posts => <UserPosts key={posts._id} posts={posts} username={credentials.username} imageUrl={credentials.imageUrl} _id={credentials._id}/>)
      }
    </div>
    ): (
      <p>loading component...</p>
    )
  )
}

export default ProfilePage
