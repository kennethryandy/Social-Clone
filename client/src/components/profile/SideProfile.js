import React from 'react'
import img from '../../assests/no-man.jpg'
import {withRouter, Link} from 'react-router-dom'
//MATERIAL UI
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import MuiLink from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
//ICONS 
import InfoIcon from '@material-ui/icons/Info';
import HomeIcon from '@material-ui/icons/Home';
import FavoriteIcon from '@material-ui/icons/Favorite';
//REDUX
import {useSelector} from 'react-redux'

const useStyles = makeStyles(theme => ({
  card: {
    marginTop: theme.spacing(3),
    padding: '.5rem 3rem',
    textTransform: 'capitalize',
    display: 'flex',
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down('sm')]: {
      padding: '0 .8rem',
       border: 'none'
    }
  },
  cardContent: {
    padding:0,
    width:'100%',
    margin: theme.spacing(2, 0)
  },
  icons: {
    justifyContent:'center'
  },
  profileImage: {
    margin: 'auto',
    height: 'auto',
    width:'100% !important',
    borderRadius: '50%',
    maxHeight: '16rem'
  },
  listItems: {
    padding: 0,
  },
  listText: {
    fontSize: theme.typography.body2.fontSize
  }
}))

const Profile = () => {
  const classes = useStyles()
  const user = useSelector(state => state.user)
  const {credentials,  loading, authenticated} = user
  return (
    authenticated ? (
    <>
    <Card elevation={3} className={classes.card} variant="outlined">
      <CardActionArea component={Link} to={`/user/${credentials?._id}`}>
        <CardMedia 
          component="img"
          image={credentials.imageUrl ? `${process.env.REACT_APP_API_URL}/api/user/img/${credentials.imageUrl}` : img}
          alt="profile-image"
          className={classes.profileImage}
          title={`${credentials?.username} profile image`}
        />
      </CardActionArea>
      <CardContent className={classes.cardContent}>
        <MuiLink component={Link} to={`/user/${credentials._id}`}>
          <Typography style={{textAlign:'center'}} gutterBottom variant="h5" component="h3">
            {credentials?.username}
          </Typography>
        </MuiLink>
        <List>
          {credentials?.bio && 
          <>
            <Divider/>
            <ListItem className={classes.listItems}>
            <ListItemIcon className={classes.icons}>
                <InfoIcon color="secondary"/>
            </ListItemIcon>
              <ListItemText classes={{primary: classes.listText}} primary={credentials.bio}/>
            </ListItem>
          </>
          }
          {credentials?.location && 
          <>
            <Divider/>
            <ListItem className={classes.listItems}>
              <ListItemIcon className={classes.icons}>
                <HomeIcon color="secondary"/>
              </ListItemIcon>
              <ListItemText classes={{primary: classes.listText}} primary={`Lives in ${credentials.location}`}/>
            </ListItem>
            <Divider/>
          </>
          }
          {credentials?.status &&
          <>
            <ListItem className={classes.listItems}>
            <ListItemIcon className={classes.icons}>
              <FavoriteIcon color="secondary"/>
            </ListItemIcon>
              <ListItemText classes={{primary: classes.listText}} primary={`Status: ${credentials.status}`}/>
            </ListItem>
            <Divider/>
          </>
          }
        </List>
      </CardContent>
    </Card>
    </>
    ):!loading ? (
      <Card elevation={0} className={classes.card}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Join now!
          </Typography>
          <CardActions>
            <Button component={Link} to="/login" variant="contained" color="primary">
              Login
            </Button>
            <Button component={Link} to="/signup" variant="outlined" color="secondary">
              Signup
            </Button>
          </CardActions>
        </CardContent>
      </Card>
    ): <p>loading...</p>
  )
}

export default withRouter(Profile)
