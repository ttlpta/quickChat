import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import NotificationSystem from "react-notification-system";

import Login from './Login';
import Signup from './Signup';
import Chat from './Chat/Chat';
import NotifyHolder from './NotifyHolder';
import PrivateRoute from './PrivateRoute';

const QuickchatRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <PrivateRoute path="/" component={Chat} />
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
