import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import NotificationSystem from "react-notification-system";

import { checkIsLogging } from "../utils";
import Login from './Login';
import Signup from './Signup';
import Chat from './Chat/Chat';
import NotifyHolder from './NotifyHolder';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isLoggin = checkIsLogging();
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

const QuickchatRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <PrivateRoute exact path="/" component={Chat} />
    </Switch>
  </BrowserRouter>
)

export default  class App extends Component {
  render() {
    return (
      <div id="sub-root">
        <QuickchatRouter />
        <NotificationSystem ref={ ref => NotifyHolder.setNotify(ref)} />
      </div>
    );
  }
}
