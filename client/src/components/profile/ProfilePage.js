import React,{useEffect, useState} from 'react'
import ProfileSkeleton from '../layout/Skeletons/ProfileSkeleton'
import UserPosts from './UserPosts'
import EditProfileDetails from './EditProfileDetails';
import CreatePost from '../post/CreatePost';
import img from '../../assests/no-man.jpg'

//REDUX
import { useDispatch, useSelector } from 'react-redux';
import {uploadImage} from '../../redux/actions/userActions'
import Card from '@material-ui/core/Card';
// import CardActionArea from '@material-ui/core/CardActionArea';
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
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import {profileStyles} from './profileStyles/'
//ICONS & SKELETONS
import InfoIcon from '@material-ui/icons/Info';
import HomeIcon from '@material-ui/icons/Home';
import FavoriteIcon from '@material-ui/icons/Favorite';
import EditIcon from '@material-ui/icons/Edit';
import Skeleton from '@material-ui/lab/Skeleton';


const ProfilePage = ({id}) => {
  const classes = profileStyles()
  const state = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [ownProfile, setOwnProfile] = useState(false)
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(id === state.credentials._id){
      setOwnProfile(true)
      setUser(state.credentials)
    }else{
      const userExist = state.allUsers?.find(user => user._id === id)
      if(userExist){
        setUser(userExist)
      }
    }
    setLoading(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[id, state])

  const handleImageChange = e => {
    if(ownProfile){
      const image = e.target.files[0]
      const formData = new FormData();
      formData.append('uploadImage', image,image.name)
      dispatch(uploadImage(formData))
    }else{
      return
    }
  }

  const handleEditPicture = () => {
    const fileInput = document.getElementById('imageInput')
    fileInput.click();
  }

  return (
    user && !loading ? (
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
          {!state.loadingProfile ? 
          (<div style={{display: 'flex', flexDirection: 'column'}}>
          <CardMedia 
            component="img"
            image={user.imageUrl ? `${process.env.REACT_APP_API_URL}/api/user/img/${user.imageUrl}` : img}
            className={classes.profileImage}
          />
            <Tooltip disabled={!ownProfile} title="Edit profile picture">
              <IconButton style={{display: ownProfile ? "" : "none"}} hidden={!ownProfile} className={classes.editIconBtn} disabled={!ownProfile} onClick={handleEditPicture}>
                <EditIcon/>
              </IconButton>
            </Tooltip>
          </div> ): (
            <Skeleton style={{margin: "1rem auto 0 auto"}} variant="circle" width={240} height={240} />
            )
          }
        <CardContent className={classes.cardContent}>
          <Typography color="primary" className={classes.title} gutterBottom variant="h4" component="h3">
            {user.username}
          </Typography>
          {!state?.loadingUserDetails ? (
             <List className={classes.userDetails}>
             {user.bio ? (
             <>
               <Divider/>
               <ListItem>
                 <ListItemIcon className={classes.icons}>
                   <InfoIcon color="primary"/>
                 </ListItemIcon>
                 <ListItemText primary={<Typography variant="body1" color="secondary">Bio: <span style={{color:'black'}}>{user.bio}</span></Typography>}/>
               </ListItem>
             </>) : ownProfile && (
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
             {user.location ? (
             <>
               <Divider/>
               <ListItem>
               <ListItemIcon className={classes.icons}>
                 <HomeIcon color="primary"/>
               </ListItemIcon>
                 <ListItemText primary={<Typography variant="body1" color="secondary">Lives at <span style={{color:'black'}}>{user.location}</span></Typography>}/>
               </ListItem>
             </>) : ownProfile && (
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
             {user.status ? (
             <>
               <Divider/>
               <ListItem>
                 <ListItemIcon className={classes.icons}>
                   <FavoriteIcon color="primary"/>
                 </ListItemIcon>
                 <ListItemText primary={<Typography variant="body1" color="secondary">Relationship Status: <span style={{color:'black'}}>{user.status}</span></Typography>}/>
               </ListItem>
             </>) : ownProfile && (
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
             {ownProfile && <Button onClick={() => setOpen(true)} size="large" variant="outlined" color="primary">Edit</Button>}
           </List>
          ): (
            <>
              <Skeleton style={{marginTop: '2.5rem'}} variant="text" width="60%"/>
              <Skeleton style={{marginTop: '2.5rem'}} variant="text" width="60%"/>
              <Skeleton style={{marginTop: '2.5rem'}} variant="text" width="60%"/>
            </>
          )}
        </CardContent>
      </Card>
      <EditProfileDetails open={open} setOpen={setOpen}/>
      {ownProfile && id === state.credentials._id && <CreatePost/>}
      {user.posts && 
      user.posts.map(posts => <UserPosts key={posts._id} posts={posts} username={user.username} imageUrl={user.imageUrl} _id={user._id}/>)
      }
      </div>
    ) : (
      <ProfileSkeleton/>
    )
  )
}

export default ProfilePage
