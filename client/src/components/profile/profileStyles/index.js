import {makeStyles} from '@material-ui/core/styles'

export const profileStyles = makeStyles(theme => ({
  title: {
    textAlign:'center', 
    textTransform: 'capitalize'
  },
  card: {
    '& :hover': {
      backgroundColor: 'transparent !important'
    },
    backgroundColor: '#e9ebee',
    width: '70%'
  },
  profileContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: theme.spacing(3),
  },
  profileImage: {
    borderRadius:'50%',
    border: '4px solid #FFF',
    maxHeight: 300,
    margin: 'auto'
  },
  imageButton: {
    display: 'flex'
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    '& button': {
      margin: `${theme.spacing(1)}px 0`
    },
    width: '70%',
    textAlign: 'center',
    margin: `${theme.spacing(2)}px 0`
  },
}))

export const postsStyles =  makeStyles(theme => ({
  cards:{
    margin: theme.spacing(3),
    width: '60%'
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: 0,
  },
  inputIcon: {
    marginRight: theme.spacing(1)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}))