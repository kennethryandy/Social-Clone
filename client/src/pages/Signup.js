import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import logo from '../assests/user.svg'
import {loginSignupStyles} from '../styles/hookStyles'
//HOOK FORM
import {signupSchema} from '../validators/userValidators'
import {useForm} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers'
//MATERIAL UI
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import MuiLink from '@material-ui/core/Link'
import CircularProgress from '@material-ui/core/CircularProgress';
import {makeStyles} from '@material-ui/core/styles'
//ICONS && SKELETONS
import LoginIcon from '@material-ui/icons/ExitToApp';
//REDUX
import {useDispatch, useSelector} from 'react-redux'
import {signupUser} from '../redux/actions/userActions'
import {SET_ERRORS} from '../redux/types'


const useStyles = makeStyles(theme => ({
  ...loginSignupStyles,
}))

const Signup = ({history}) => {
  const dispatch = useDispatch()
  const {loading, errors} = useSelector(state => state.UI)
  const { register, handleSubmit, errors:{email, username, password, confirmPassword}} = useForm({
    resolver: yupResolver(signupSchema)
  });
  const classes = useStyles()
  const onSubmit = async (data) => {
    const newUser = {
      query: `
        mutation{
          signup(userInput:{username:"${data.username}", email:"${data.email}", password:"${data.password}"}){
            token
          }
        }
      `
    }
    if(data.password !== data.confirmPassword){
      dispatch({type:SET_ERRORS, payload: "Password and confirm password must match."})
    }else{
      dispatch(signupUser(newUser,history))
    }
  }
  return (
    <div className={classes.formContainer}>
      <img alt="logo" src={logo} className={classes.logo}/>
      <Typography variant="h2">Signup</Typography>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <TextField 
          error={email ? true : false}
          className={classes.formInput} 
          fullWidth 
          type="email"
          name="email" 
          label="Email"
          inputRef={register}
          helperText={email?.type === 'required' ? "Email must not be empty." : ""}
          />
        <TextField 
          error={username ? true : false}
          className={classes.formInput} 
          fullWidth 
          type="text"
          name="username" 
          label="Full Name"
          inputRef={register}
          helperText={username?.type === 'required' ? "Name must not be empty." : ""}
          />
        <TextField 
          error={password ? true : false}
          className={classes.formInput} 
          fullWidth 
          type="password" 
          name="password" 
          label="Password"
          inputRef={register}
          helperText={password?.type ? "Password must not be empty." : ""}
          />
        <TextField 
          error={confirmPassword ? true : false}
          className={classes.formInput} 
          fullWidth 
          type="password" 
          name="confirmPassword" 
          label="Confirm password"
          inputRef={register}
          helperText={confirmPassword?.type ? "Confirm password must not be empty." : ""}
          />
        {errors && <Typography variant="body2" className={classes.customError}>{errors};</Typography>}
        {email || password  ? <Typography variant="body2" className={classes.customError}>Invalid credentials, Please try again.</Typography> : null}
        <Button 
          className={classes.btn} 
          type="submit" 
          variant="contained" 
          color="primary"
          size="medium"
          disabled={loading}
          >{loading ? <CircularProgress className={classes.spinner}/> : 'Signup'}</Button>
          <small>Already have an account? log in <MuiLink color="secondary" component={Link} to='/signup'>here <LoginIcon color="secondary" className={classes.loginIcon}/></MuiLink></small>
      </form>
    </div>
  )
}

export default withRouter(Signup)