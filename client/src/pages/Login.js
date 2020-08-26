import React from 'react'
import { Link, withRouter} from 'react-router-dom'
import logo from '../assests/user.svg'
import {loginSignupStyles} from '../styles/hookStyles'
//HOOK FORM
import {loginSchema} from '../validators/userValidators'
import {useForm} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers'
//MATERIAL UI
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import MuiLink from '@material-ui/core/Link'
import CircularProgress from '@material-ui/core/CircularProgress';
import {makeStyles} from '@material-ui/core/styles'
//ICONS & SKELETONS
import LoginIcon from '@material-ui/icons/ExitToApp';
//REDUX
import {useDispatch, useSelector} from 'react-redux'
import {loginUser} from '../redux/actions/userActions'

const useStyles = makeStyles(theme => ({
  ...loginSignupStyles,
}))

const Login = ({history}) => {
  const dispatch = useDispatch()
  const {loading, errors} = useSelector(state => state.UI)
  const { register, handleSubmit, errors:{email, password}} = useForm({
    resolver: yupResolver(loginSchema)
  });
  const classes = useStyles()

  const onSubmit = async (data) => {
      const userData = {
        query: `
          query{
            login(email: "${data.email}", password: "${data.password}"){
              token
            }
          }
        `
      }
      dispatch(loginUser(userData, history))
  }
  return (
    <div className={classes.formContainer}>
      <img alt="logo" src={logo} className={classes.logo}/>
      <Typography variant="h2">Login</Typography>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <TextField 
          error={email || password ? true : false}
          className={classes.formInput} 
          fullWidth type="email"
          name="email" 
          label="Email"
          inputRef={register}
          helperText={email?.type === 'required' ? "Email must not be empty." : ""}
          />
        <TextField 
          error={email || password ? true : false}
          className={classes.formInput} 
          fullWidth type="password" 
          name="password" 
          label="Password"
          inputRef={register}
          helperText={password?.type ? "Password must not be empty." : ""}
          />
        {errors ? (
          <Typography variant="body2" className={classes.customError}>{errors}</Typography>
        ) : (email || password) ? 
        (
          <Typography variant="body2" className={classes.customError}>Invalid email address or password, Try again.</Typography>
        ) : null}
        <Button 
          className={classes.btn} 
          type="submit" 
          variant="contained" 
          color="primary"
          size="medium"
          disabled={loading}
          >{loading ? <CircularProgress className={classes.spinner}/> : 'Login'}</Button>
          <small>Don't have an account? sign up <MuiLink color="secondary" component={Link} to='/signup'>here <LoginIcon color="secondary" className={classes.loginIcon}/></MuiLink></small>
      </form>
    </div>
  )
}

export default withRouter(Login)