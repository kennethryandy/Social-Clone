import React from 'react'
//Redux
import { useSelector } from 'react-redux';
//Material ui
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';

//ICONS
import InfoIcon from '@material-ui/icons/Info';
import HomeIcon from '@material-ui/icons/Home';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {profileStyles} from '../profileStyles'
import UserPosts from '../UserPosts';

const UsersProfiles = () => {
  const classes = profileStyles()
  const {getUser} = useSelector(state => state.user)
  
  return (
    getUser &&
    <div className={classes.profileContainer}>
      <Card elevation={3} className={classes.card}>
        <CardActionArea className={classes.imageButton}>
          <CardMedia 
            component="img"
            image={`${process.env.REACT_APP_API_URL}/${getUser.imageUrl}`}
            className={classes.profileImage}
          />
        </CardActionArea>
        <CardContent className={classes.cardContent}>
          <Typography color="primary" className={classes.title} gutterBottom variant="h4" component="h3">
            {getUser.username}
          </Typography>
            <List className={classes.userDetails}>
            {getUser.bio &&
            <>
              <Divider/>
              <ListItem>
                <ListItemIcon className={classes.icons}>
                  <InfoIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary={<Typography variant="body1" color="secondary">Bio: <span style={{color:'black'}}>{getUser.bio}</span></Typography>}/>
              </ListItem>
            </>
            }
            {getUser.location &&
            <>
              <Divider/>
              <ListItem>
              <ListItemIcon className={classes.icons}>
                <HomeIcon color="primary"/>
              </ListItemIcon>
                <ListItemText primary={<Typography variant="body1" color="secondary">Lives at <span style={{color:'black'}}>{getUser.location}</span></Typography>}/>
              </ListItem>
            </>
            }
            {getUser.status &&
            <>
              <Divider/>
              <ListItem>
                <ListItemIcon className={classes.icons}>
                  <FavoriteIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary={<Typography variant="body1" color="secondary">Relationship Status: <span style={{color:'black'}}>{getUser.status}</span></Typography>}/>
              </ListItem>
            </>
            }
          </List>
        </CardContent>
      </Card>
      {getUser.posts && getUser.posts.map(post => <UserPosts key={post._id} posts={post} imageUrl={getUser.imageUrl} username={getUser.username} _id={getUser._id}/>)}
    </div>
  )
}

export default UsersProfiles
