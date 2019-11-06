import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotificationsSystem from 'reapop';
import reapopTheme from './styles/reapop-theme';
import { Login, Home, NotFound } from './components';

const App: React.FC = () => {
  return (
    <div>
      <NotificationsSystem theme={reapopTheme} />
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/home" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
