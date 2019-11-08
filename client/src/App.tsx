import React from 'react';
import { Route, Switch, Router } from 'react-router-dom';
import * as history from 'history';
import { Login, Home, NotFound } from './components';
import './App.css';
import AuthRoute from './components/AuthRoute';

const App: React.FC = () => {
  return (
    <div className='app'>
        <Router history={ history.createHashHistory()}>
          <Switch>
            <Route exact path="/" component={Login} />
            <AuthRoute path="/home" component={Home} />
            <Route component={NotFound} />
          </Switch>
        </Router>
    </div>
  );
}

export default App;
