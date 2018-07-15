import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Login from './Login';
import Signup from './Signup';
import Chat from './Chat';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isLoggin = false;
  return (<Route { ...rest } render={ props => (
    isLoggin ? (
      <Component { ...props }/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>)
}

export default  class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <PrivateRoute exact path="/" component={Chat} />
        </Switch>
      </BrowserRouter>
    );
  }
}
