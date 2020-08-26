import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'

//REDUX
import {useSelector} from 'react-redux'
//components
import Navbar from './components/layout/Navbar'
import Profiles from './components/profile/Profiles'
//Pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home';
//Material ui
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'


const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      light: '#4e96b0',
      main: '#227c9d',
      dark: '#17566d',
      contrastText: '#e9ebee',
    },
    secondary: {
      light: '#45cfc1',
      main: '#17c3b2',
      dark: '#10887c',
      contrastText: '#000',
    },
  },
})

function App() {
  const authenticated = useSelector(state => state.user.authenticated)
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Router>
          <Navbar/>
          <div className="bodyContainer">
          <Switch>
            <Route path="/" component={authenticated ? Home : Login} exact/>
            <Route path="/login" render={() => authenticated ? <Redirect to="/"/> : <Login />} exact/>
            <Route path="/signup" render={() => authenticated ? <Redirect to="/"/> : <Signup />} exact/>
            <Route path='/user/:id' component={Profiles} exact/>
          </Switch>
          </div>
        </Router>
    </ThemeProvider>
  );
}

export default App;