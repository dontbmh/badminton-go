import React from 'react';
import { Route, Redirect } from "react-router-dom"
import { auth } from '../service'

const AuthRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    auth.isAuthenticated === true
      ? <Component {...props} user={auth.currentUser} />
      : <Redirect to='/' />
  )} />
)

export default AuthRoute;